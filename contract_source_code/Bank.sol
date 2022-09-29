// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "./Pool.sol";
import "./klaytn-contracts/token/KIP7/IKIP7.sol";
import "./libraries/BankLibrary.sol";
import "./klaytn-contracts/math/SafeMath.sol";

contract Bank {
    using SafeMath for uint256;

    Pool public ChickPool;
    IKIP7 public Chick;

    constructor(Pool _ChickPool, IKIP7 _Chick) public {
        ChickPool = _ChickPool;
        Chick = _Chick;
    }

    /* USE AS KIND */
    uint8 private constant _KIND_KLAY = 1;
    uint8 private constant _KIND_CHICK = 2;

    function addLiquidity(
        uint256 amount_chick_desired,
        uint256 amount_chick_min,
        uint256 amount_chick_max,
        address to
    )
        external
        payable
        returns (
            uint256 amount_klay,
            uint256 amount_chick,
            uint256 liquidity
        )
    {
        uint256 amount_klay_transfered = msg.value;

        (uint256 reserve_klay, uint256 reserve_chick) = ChickPool.getReserves();

        if (reserve_klay == 0 && reserve_chick == 0) {
            (amount_klay, amount_chick) = (
                amount_klay_transfered,
                amount_chick_desired
            );
        } else {
            uint256 amount_chick_optimal = BankLibrary.quote(
                amount_klay_transfered,
                reserve_klay,
                reserve_chick
            );
            require(
                amount_chick_min <= amount_chick_optimal &&
                    amount_chick_optimal <= amount_chick_max,
                "Bank: CHICK_AMOUNT NOT MATCHED"
            );

            (amount_klay, amount_chick) = (
                amount_klay_transfered,
                amount_chick_optimal
            );
        }

        (bool success, ) = address(ChickPool).call.value(amount_klay)(""); //same as to.transfer(amount_klay);
        require(success, "Bank: Klay Transfer Failed"); // because of gas issue
        Chick.transferFrom(msg.sender, address(ChickPool), amount_chick);

        liquidity = ChickPool.mint(to);
    }

    function removeLiquidity(
        uint256 liquidity,
        uint256 amount_klay_min,
        uint256 amount_chick_min,
        address payable to
    ) public returns (uint256 amount_klay, uint256 amount_chick) {
        ChickPool.transferFrom(msg.sender, address(ChickPool), liquidity); // send liquidity to pool
        (amount_klay, amount_chick) = ChickPool.burn(to);
        require(
            amount_klay >= amount_klay_min,
            "Bank: INSUFFICIENT_KLAY_AMOUNT"
        );
        require(
            amount_chick >= amount_chick_min,
            "Bank: INSUFFICIENT_CHICK_AMOUNT"
        );
    }

    // view_predict
    function getAmountOutFromPool(uint256 amount_in, uint8 amount_in_kind)
        public
        view
        returns (uint256 amount_out)
    {
        (uint256 reserve_klay, uint256 reserve_chick) = ChickPool.getReserves();
        if (amount_in_kind == _KIND_KLAY) {
            amount_out = BankLibrary.getAmountOut(
                amount_in,
                reserve_klay,
                reserve_chick
            );
        } else if (amount_in_kind == _KIND_CHICK) {
            amount_out = BankLibrary.getAmountOut(
                amount_in,
                reserve_chick,
                reserve_klay
            );
        }
    }

    function getAmountInFromPool(uint256 amount_out, uint8 amount_out_kind)
        public
        view
        returns (uint256 amount_in)
    {
        (uint256 reserve_klay, uint256 reserve_chick) = ChickPool.getReserves();
        if (amount_out_kind == _KIND_KLAY) {
            amount_in = BankLibrary.getAmountIn(
                amount_out,
                reserve_chick,
                reserve_klay
            );
        } else if (amount_out_kind == _KIND_CHICK) {
            amount_in = BankLibrary.getAmountIn(
                amount_out,
                reserve_klay,
                reserve_chick
            );
        }
    }

    function swapExactKlayForChick(uint256 amount_out_min, address payable to)
        external
        payable
    {
        uint256 amount_in = msg.value;

        uint256 amount_out = getAmountOutFromPool(amount_in, _KIND_KLAY);
        require(
            amount_out >= amount_out_min,
            "Bank: INSUFFICIENT_OUTPUT_AMOUNT"
        );

        // transfer to POOL
        (bool success, ) = address(ChickPool).call.value(amount_in)(""); //same as to.transfer(amount_klay);
        require(success, "Bank: Klay Transfer Failed"); // because of gas issue

        ChickPool.swap(uint256(0), amount_out, to);
    }

    function swapKlayForExactChick(uint256 amount_out, address payable to)
        external
        payable
    {
        uint256 amount_in_max = msg.value;

        uint256 amount_in = getAmountInFromPool(amount_out, _KIND_CHICK);
        require(amount_in <= amount_in_max, "Bank: TOO_HIGH_INPUT_AMOUNT");

        // transfer to POOL
        (bool success1, ) = address(ChickPool).call.value(amount_in)(""); //same as to.transfer(amount_klay);
        require(success1, "Bank: Klay Transfer Failed"); // because of gas issue

        // refund
        uint256 amount_refund = amount_in_max.sub(amount_in);
        if (amount_refund > 0) {
            (bool success2, ) = to.call.value(amount_refund)(""); //same as to.transfer(amount_klay);
            require(success2, "Bank: Klay Transfer Failed"); // because of gas issue
        }

        ChickPool.swap(uint256(0), amount_out, to);
    }

    function swapExactChickForKlay(
        uint256 amount_in,
        uint256 amount_out_min,
        address payable to
    ) external {
        uint256 amount_out = getAmountOutFromPool(amount_in, _KIND_CHICK);
        require(
            amount_out >= amount_out_min,
            "Bank: INSUFFICIENT_OUTPUT_AMOUNT"
        );

        // transfer to POOL
        Chick.transferFrom(msg.sender, address(ChickPool), amount_in);

        ChickPool.swap(amount_out, uint256(0), to);
    }

    function swapChickForExactKlay(
        uint256 amount_in_max,
        uint256 amount_out,
        address payable to
    ) external {
        uint256 amount_in = getAmountInFromPool(amount_out, _KIND_KLAY);
        require(amount_in <= amount_in_max, "Bank: TOO_HIGH_INPUT_AMOUNT");

        // transfer to POOL
        Chick.transferFrom(msg.sender, address(ChickPool), amount_in);

        ChickPool.swap(amount_out, uint256(0), to);
    }

    // view
    function getReservesFromPool()
        public
        view
        returns (uint256 reserve_klay, uint256 reserve_chick)
    {
        return ChickPool.getReserves();
    }
}
