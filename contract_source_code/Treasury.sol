pragma solidity ^0.5.6;

import "./klaytn-contracts/ownership/Ownable.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./klaytn-contracts/token/KIP7/IKIP7.sol";

contract Treasury is Ownable {
    constructor() public {}

    function() external payable {}

    function withdrawKlay() external onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    function withdrawChick(IKIP7 _token) external onlyOwner {
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }
}
