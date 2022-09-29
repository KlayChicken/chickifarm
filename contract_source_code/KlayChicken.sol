pragma solidity ^0.5.0;

import "./klaytn-contracts/token/KIP17/KIP17Full.sol";
import "./klaytn-contracts/token/KIP17/KIP17Mintable.sol";
import "./klaytn-contracts/token/KIP17/KIP17Burnable.sol";
import "./klaytn-contracts/token/KIP17/KIP17Pausable.sol";
import "./klaytn-contracts/token/KIP17MetadataMintable.sol";
import "./klaytn-contracts/ownership/Ownable.sol";

contract KlayChicken is
    KIP17Full("Klay Chicken", "CHICKEN"),
    KIP17Mintable,
    KIP17MetadataMintable,
    KIP17Burnable,
    KIP17Pausable,
    Ownable
{
}
