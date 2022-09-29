// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "../contracts/klaytn-contracts/token/KIP7/KIP7Burnable.sol";
import "../contracts/klaytn-contracts/token/KIP7/KIP7Pausable.sol";
import "../contracts/klaytn-contracts/token/KIP7/KIP7Metadata.sol";
import "../contracts/klaytn-contracts/ownership/Ownable.sol";
import "./Freezable.sol";

contract Chick is KIP7Burnable, KIP7Pausable, KIP7Metadata, Ownable, Freezable {
    constructor() public KIP7Metadata("CHICK", "CHICK", 18) {
        _mint(msg.sender, 400000000 * 1e18);
    }
}
