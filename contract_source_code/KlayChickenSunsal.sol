pragma solidity ^0.5.6;

import "./klaytn-contracts/token/KIP17/KIP17Full.sol";
import "./klaytn-contracts/token/KIP17/KIP17Mintable.sol";
import "./klaytn-contracts/token/KIP17/KIP17Burnable.sol";
import "./klaytn-contracts/token/KIP17/KIP17Pausable.sol";
import "./klaytn-contracts/ownership/Ownable.sol";

contract KlayChickenSunsal is
    Ownable,
    KIP17Full,
    KIP17Mintable,
    KIP17Burnable,
    KIP17Pausable
{
    constructor(string memory name, string memory symbol)
        public
        KIP17Full(name, symbol)
    {}

    uint256 public ts = 0;
    uint256 public constant maxSupply = 900;
    string public baseURI =
        "https://klayproject.s3.ap-northeast-2.amazonaws.com/klaychicken/sunsal/meta/";

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(
            _exists(tokenId),
            "KIP17Metadata: URI query for nonexistent token"
        );

        string memory _baseURI = baseURI;
        string memory idstr;
        string memory baseURIback = ".json";

        uint256 temp = tokenId;
        idstr = uint2str(temp);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(_baseURI, idstr, baseURIback))
                : "";
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function setBaseURI(string memory __baseURI) public onlyOwner {
        baseURI = __baseURI;
    }

    function massMint(uint256 sup) public onlyOwner {
        uint256 from = ts;
        uint256 to = ts + sup;
        for (uint256 i = from; i < to; i += 1) {
            _mint(msg.sender, i);
        }
        ts += sup;
    }

    function bulkTransfer(address[] calldata tos, uint256[] calldata ids)
        external
    {
        uint256 length = ids.length;
        for (uint256 i = 0; i < length; i += 1) {
            transferFrom(msg.sender, tos[i], ids[i]);
        }
    }
}
