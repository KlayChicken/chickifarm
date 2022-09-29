// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "../contracts/klaytn-contracts/token/KIP7/KIP7.sol";
import "../contracts/klaytn-contracts/ownership/Ownable.sol";

contract Freezable is KIP7, Ownable {
    mapping(address => bool) public frozenAccount;
    event FrozenAccount(address target, bool frozen);

    function freezeAccount(address target, bool freeze) public onlyOwner {
        frozenAccount[target] = freeze;
        emit FrozenAccount(target, freeze);
    }

    modifier notFrozenAccount() {
        require(!frozenAccount[msg.sender], "frozen account");
        _;
    }

    function transfer(address to, uint256 value)
        public
        notFrozenAccount
        returns (bool)
    {
        return super.transfer(to, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public notFrozenAccount returns (bool) {
        return super.transferFrom(from, to, value);
    }

    function approve(address spender, uint256 value)
        public
        notFrozenAccount
        returns (bool)
    {
        return super.approve(spender, value);
    }
}
