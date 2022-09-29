pragma solidity ^0.5.6;

import "./klaytn-contracts/token/KIP37/KIP37.sol";
import "./klaytn-contracts/token/KIP37/KIP37Burnable.sol";
import "./klaytn-contracts/token/KIP37/KIP37Mintable.sol";
import "./klaytn-contracts/ownership/Ownable.sol";
import "./klaytn-contracts/math/SafeMath.sol";

contract Ornament is Ownable, KIP37, KIP37Burnable, KIP37Mintable {
    using SafeMath for uint256;

    constructor()
        public
        KIP37("https://api.klaychicken.com/ornament/meta/{id}.json")
    {}

    string public baseURI = "https://api.klaychicken.com/ornament/meta/";
    string public baseURIBack = ".json";

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

    function uri(uint256 tokenId) public view returns (string memory) {
        require(
            _exists(tokenId),
            "KIP17Metadata: URI query for nonexistent token"
        );

        string memory _baseURI = baseURI;
        string memory idstr;
        string memory _baseURIBack = baseURIBack;

        uint256 temp = tokenId;
        idstr = uint2str(temp);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(_baseURI, idstr, _baseURIBack))
                : "";
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function setBaseURIBack(string memory _baseURIBack) public onlyOwner {
        baseURIBack = _baseURIBack;
    }

    function massTransfer(address[] calldata adrs, uint256 _id) external {
        uint256 length = adrs.length;
        for (uint256 i = 0; i < length; i = i.add(1)) {
            safeTransferFrom(msg.sender, adrs[i], _id, 1, "");
        }
    }
}
