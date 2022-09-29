// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "../contracts/klaytn-contracts/token/KIP7/IKIP7.sol";
import "../contracts/klaytn-contracts/ownership/Ownable.sol";

contract Ecosystem is Ownable {
    constructor() public {}

    function withdrawToken(IKIP7 token, uint256 amount) external onlyOwner {
        token.transfer(msg.sender, amount);
    }
}
