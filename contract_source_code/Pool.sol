// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "./PoolToken.sol";
import "./klaytn-contracts/token/KIP7/IKIP7.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./klaytn-contracts/math/Math.sol";

contract Pool is PoolToken {
    IKIP7 public Chick;
    using SafeMath for uint256;

    constructor(IKIP7 _Chick) public {
        Chick = _Chick;
    }

    // for receiving KLAY
    function() external payable {}

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;

    uint112 private reserve_klay; // uses single storage slot, accessible via getReserves
    uint112 private reserve_chick; // uses single storage slot, accessible via getReserves

    uint256 public kLast;

    // lock
    uint256 private unlocked = 1;

    modifier lock() {
        require(unlocked == 1, "ChickPool: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves()
        public
        view
        returns (uint112 _reserve_klay, uint112 _reserve_chick)
    {
        _reserve_klay = reserve_klay;
        _reserve_chick = reserve_chick;
    }

    // event
    event Mint(
        address indexed sender,
        uint256 klay,
        uint256 chick,
        address indexed to
    );
    event Burn(
        address indexed sender,
        uint256 klay,
        uint256 chick,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint256 klayIn,
        uint256 chickIn,
        uint256 klayOut,
        uint256 chickOut,
        address indexed to
    );
    event Sync(uint112 reserve_klay, uint112 reserve_chick);

    function _update(uint256 bal_klay, uint256 bal_chick) private {
        require(
            bal_klay <= uint112(-1) && bal_chick <= uint112(-1),
            "ChickPool: OVERFLOW"
        );

        reserve_klay = uint112(bal_klay);
        reserve_chick = uint112(bal_chick);

        emit Sync(reserve_klay, reserve_chick);
    }

    // low-level function; should be called from BANK
    function mint(address to)
        external
        payable
        lock
        returns (uint256 liquidity)
    {
        (uint112 _reserve_klay, uint112 _reserve_chick) = getReserves(); // gas savings
        uint256 bal_klay = address(this).balance;
        uint256 bal_chick = Chick.balanceOf(address(this));
        uint256 amount_klay = bal_klay.sub(_reserve_klay);
        uint256 amount_chick = bal_chick.sub(_reserve_chick);

        uint256 _totalSupply = totalSupply; // gas savings

        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount_klay.mul(amount_chick)).sub(
                MINIMUM_LIQUIDITY
            );
            _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = Math.min(
                amount_klay.mul(_totalSupply) / _reserve_klay,
                amount_chick.mul(_totalSupply) / _reserve_chick
            );
        }
        require(liquidity > 0, "ChickPool: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(bal_klay, bal_chick);
        kLast = uint256(reserve_klay).mul(reserve_chick); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount_klay, amount_chick, to);
    }

    // low-level function; should be called from BANK
    function burn(address payable to)
        external
        payable
        lock
        returns (uint256 amount_klay, uint256 amount_chick)
    {
        uint256 bal_klay = address(this).balance;
        uint256 bal_chick = Chick.balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];

        uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        amount_klay = liquidity.mul(bal_klay) / _totalSupply; // using balances ensures pro-rata distribution
        amount_chick = liquidity.mul(bal_chick) / _totalSupply; // using balances ensures pro-rata distribution
        require(
            amount_klay > 0 && amount_chick > 0,
            "ChickPool: INSUFFICIENT_LIQUIDITY_BURNED"
        );
        _burn(address(this), liquidity);

        //(bool success, ) = to.call{value: amount_klay}(""); //same as to.transfer(amount_klay);
        (bool success, ) = to.call.value(amount_klay)(""); //same as to.transfer(amount_klay);
        require(success, "ChickPool: Klay Transfer Failed"); // because of gas issue
        Chick.transfer(to, amount_chick);

        bal_klay = address(this).balance;
        bal_chick = Chick.balanceOf(address(this));

        _update(bal_klay, bal_chick);
        kLast = uint256(reserve_klay).mul(reserve_chick); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount_klay, amount_chick, to);
    }

    // low-level function; should be called from BANK
    function swap(
        uint256 amount_klay_out,
        uint256 amount_chick_out,
        address payable to
    ) external payable lock {
        require(
            amount_klay_out > 0 || amount_chick_out > 0,
            "ChickPool: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        (uint112 _reserve_klay, uint112 _reserve_chick) = getReserves(); // gas savings
        require(
            amount_klay_out < _reserve_klay &&
                amount_chick_out < _reserve_chick,
            "ChickPool: INSUFFICIENT_LIQUIDITY"
        );

        uint256 bal_klay;
        uint256 bal_chick;

        {
            // avoids stack too deep errors
            require(address(to) != address(Chick), "ChickPool: INVALID_TO");
            if (amount_klay_out > 0) {
                (bool success, ) = to.call.value(amount_klay_out)(""); //same as to.transfer(amount_klay);
                require(success, "ChickPool: Klay Transfer Failed"); // because of gas issue
            }
            if (amount_chick_out > 0) {
                Chick.transfer(to, amount_chick_out);
            }

            bal_klay = address(this).balance;
            bal_chick = Chick.balanceOf(address(this));
        }

        uint256 amount_klay_in = bal_klay > _reserve_klay - amount_klay_out
            ? bal_klay - (_reserve_klay - amount_klay_out)
            : 0;
        uint256 amount_chick_in = bal_chick > _reserve_chick - amount_chick_out
            ? bal_chick - (_reserve_chick - amount_chick_out)
            : 0;
        require(
            amount_klay_in > 0 || amount_chick_in > 0,
            "UniswapV2: INSUFFICIENT_INPUT_AMOUNT"
        );

        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint256 bal_klay_adjusted = bal_klay.mul(1000).sub(
                amount_klay_in.mul(3)
            );
            uint256 bal_chick_adjusted = bal_chick.mul(1000).sub(
                amount_chick_in.mul(3)
            );
            require(
                bal_klay_adjusted.mul(bal_chick_adjusted) >=
                    uint256(_reserve_klay).mul(_reserve_chick).mul(1000**2),
                "UniswapV2: K not matched"
            );
        }

        _update(bal_klay, bal_chick);
        emit Swap(
            msg.sender,
            amount_klay_in,
            amount_chick_in,
            amount_klay_out,
            amount_chick_out,
            to
        );
    }

    // force balances to match reserves
    function skim(address to) external lock {
        uint256 bal_klay = address(this).balance;
        uint256 bal_chick = Chick.balanceOf(address(this));

        (bool success, ) = to.call.value(bal_klay.sub(reserve_klay))(""); //same as to.transfer(amount_klay);
        require(success, "ChickPool: Klay Transfer Failed"); // because of gas issue
        Chick.transfer(to, bal_chick.sub(reserve_chick));
    }

    // force reserves to match balances
    function sync() external lock {
        uint256 bal_klay = address(this).balance;
        uint256 bal_chick = Chick.balanceOf(address(this));

        _update(bal_klay, bal_chick);
    }
}
