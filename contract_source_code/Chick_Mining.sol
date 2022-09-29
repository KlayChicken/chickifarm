// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "../contracts/klaytn-contracts/token/KIP7/IKIP7.sol";
import "../contracts/klaytn-contracts/token/KIP17/IKIP17Enumerable.sol";
import "../contracts/klaytn-contracts/token/KIP37/KIP37Burnable.sol";
import "../contracts/klaytn-contracts/math/SafeMath.sol";
import "../contracts/klaytn-contracts/ownership/Ownable.sol";
import "./ReentrancyGuard.sol";

contract Chick_Mining is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    event SuperChickiz(uint256 indexed id, address indexed chef);

    event EquipMentor(
        uint256 indexed id,
        address indexed chef,
        uint256 indexed mentorId
    );

    event UnEquipMentor(
        uint256 indexed id,
        address indexed chef,
        uint256 indexed mentorId
    );

    IKIP7 public Chick;
    IKIP17Enumerable public Chickiz;
    IKIP17Enumerable public Bone;
    IKIP17Enumerable public Sunsal;
    KIP37Burnable public Oil; // #2001 - basic / #2002 - olive

    constructor(
        IKIP7 _Chick,
        IKIP17Enumerable _Chickiz,
        IKIP17Enumerable _Bone,
        IKIP17Enumerable _Sunsal,
        KIP37Burnable _Oil
    ) public {
        Chick = _Chick;
        Chickiz = _Chickiz;
        Bone = _Bone;
        Sunsal = _Sunsal;
        Oil = _Oil;
    }

    /*
        cp(crunch power) 0,1,2,3,4,5
        - used to check crunch power and Super Chickiz Status
        => * 3

        mentor 0,1
        - used to check whether fitted or not
        - #1 ~ #899 => normal => * 1.2
            **IMPORTANT** #0 should be never used. It's default value.
        - #900 ~ #999 => special => * 2
    */

    uint8 private constant _CHICKIZ_BASAK = 0;
    uint8 private constant _CHICKIZ_BBASAK = 1;
    uint8 private constant _CHICKIZ_BBBASAK = 2;
    uint8 private constant _CHICKIZ_BASAK_SUPER = 3;
    uint8 private constant _CHICKIZ_BBASAK_SUPER = 4;
    uint8 private constant _CHICKIZ_BBBASAK_SUPER = 5;

    uint256 private constant _BASAK_CP = 10 * 1e18;
    uint256 private constant _BBASAK_CP = 15 * 1e18;
    uint256 private constant _BBBASAK_CP = 20 * 1e18;
    uint256 private constant _BASAK_SUPER_CP = 30 * 1e18;
    uint256 private constant _BBASAK_SUPER_CP = 45 * 1e18;
    uint256 private constant _BBBASAK_SUPER_CP = 60 * 1e18;

    uint256 private constant _OIL_DURATION = 2592000; // 86400 * 30

    uint8 private constant _MENTOR_BONE = 0;
    uint8 private constant _MENTOR_SUNSAL = 1;

    mapping(uint256 => uint8) public cp;
    mapping(uint256 => uint256) public mentor;
    mapping(uint256 => uint8) public mentorKind;
    mapping(uint256 => uint256) public oilCharged; // timestamp
    mapping(uint256 => uint256) public lastMined; // timestamp

    function setCP(uint256 _id, uint8 _cp) external onlyOwner {
        cp[_id] = _cp;
    }

    function makeSuperChickiz(uint256 id) public {
        require(Chickiz.ownerOf(id) == msg.sender, "not owner");
        require(cp[id] < 3, "already super");
        //require(mentor[id] == 0, "you have to unequip mentor");

        if (minable(id) > 0) {
            _mine(id);
        } else {
            lastMined[id] = block.timestamp;
        }

        Oil.burn(msg.sender, 2002, 1);
        cp[id] = cp[id] + 3;

        emit SuperChickiz(id, msg.sender);
    }

    function equipMentor(
        uint256 _chickizId,
        uint256 _mentorId,
        uint8 _mentorKind
    ) public {
        require(Chickiz.ownerOf(_chickizId) == msg.sender, "not owner");
        require(cp[_chickizId] < 3, "super can't equip mentor");
        require(mentor[_chickizId] == 0, "already equiped");
        require(
            _mentorKind == 0 || _mentorKind == 1,
            "it should be bone or sunsal"
        );

        if (minable(_chickizId) > 0) {
            _mine(_chickizId);
        } else {
            lastMined[_chickizId] = block.timestamp;
        }

        if (_mentorKind == 0) {
            Bone.transferFrom(msg.sender, address(this), _mentorId);
        } else if (_mentorKind == 1) {
            Sunsal.transferFrom(msg.sender, address(this), _mentorId);
        }

        mentorKind[_chickizId] = _mentorKind;
        mentor[_chickizId] = _mentorId;

        emit EquipMentor(_chickizId, msg.sender, _mentorId);
    }

    function unEquipMentor(uint256 id) public {
        require(Chickiz.ownerOf(id) == msg.sender, "not owner");
        require(mentor[id] != 0, "not equiped");

        if (minable(id) > 0) {
            _mine(id);
        } else {
            lastMined[id] = block.timestamp;
        }

        uint256 _mentor = mentor[id];

        if (mentorKind[id] == 0) {
            Bone.transferFrom(address(this), msg.sender, mentor[id]);
        } else if (mentorKind[id] == 1) {
            Sunsal.transferFrom(address(this), msg.sender, mentor[id]);
        }

        mentor[id] = 0;

        emit UnEquipMentor(id, msg.sender, _mentor);
    }

    function minable(uint256 id) public view returns (uint256) {
        uint256 minablePeriods;

        if (cp[id] >= 3) {
            minablePeriods = block.timestamp.sub(lastMined[id]);
        } else {
            if (
                oilCharged[id].add(_OIL_DURATION) <= lastMined[id] ||
                oilCharged[id] == 0
            ) {
                minablePeriods = 0;
            } else if (lastMined[id] <= oilCharged[id]) {
                minablePeriods = block.timestamp.sub(oilCharged[id]) <=
                    _OIL_DURATION
                    ? block.timestamp.sub(oilCharged[id])
                    : _OIL_DURATION;
            } else if (
                lastMined[id] > oilCharged[id] &&
                oilCharged[id].add(_OIL_DURATION) > lastMined[id]
            ) {
                minablePeriods = block.timestamp.sub(lastMined[id]) <=
                    oilCharged[id].add(_OIL_DURATION).sub(lastMined[id])
                    ? block.timestamp.sub(lastMined[id])
                    : oilCharged[id].add(_OIL_DURATION).sub(lastMined[id]);
            }
        }

        if (cp[id] == _CHICKIZ_BASAK) {
            if (mentor[id] > 899) {
                return _BASAK_CP.mul(minablePeriods).mul(2).div(86400);
            } else if (mentor[id] > 0) {
                return _BASAK_CP.mul(minablePeriods).mul(6).div(5).div(86400);
            } else {
                return _BASAK_CP.mul(minablePeriods).div(86400);
            }
        } else if (cp[id] == _CHICKIZ_BBASAK) {
            if (mentor[id] > 899) {
                return _BBASAK_CP.mul(minablePeriods).mul(2).div(86400);
            } else if (mentor[id] > 0) {
                return _BBASAK_CP.mul(minablePeriods).mul(6).div(5).div(86400);
            } else {
                return _BBASAK_CP.mul(minablePeriods).div(86400);
            }
        } else if (cp[id] == _CHICKIZ_BBBASAK) {
            if (mentor[id] > 899) {
                return _BBBASAK_CP.mul(minablePeriods).mul(2).div(86400);
            } else if (mentor[id] > 0) {
                return _BBBASAK_CP.mul(minablePeriods).mul(6).div(5).div(86400);
            } else {
                return _BBBASAK_CP.mul(minablePeriods).div(86400);
            }
        } else if (cp[id] == _CHICKIZ_BASAK_SUPER) {
            return _BASAK_SUPER_CP.mul(minablePeriods).div(86400);
        } else if (cp[id] == _CHICKIZ_BBASAK_SUPER) {
            return _BBASAK_SUPER_CP.mul(minablePeriods).div(86400);
        } else if (cp[id] == _CHICKIZ_BBBASAK_SUPER) {
            return _BBBASAK_SUPER_CP.mul(minablePeriods).div(86400);
        }
    }

    function _mine(uint256 id) internal {
        require(Chickiz.ownerOf(id) == msg.sender, "not owner");
        require(minable(id) > 0, "There's nothing to mine");
        Chick.transfer(msg.sender, minable(id));
        lastMined[id] = block.timestamp;
    }

    function _charge_withoutburn(uint256 id) internal {
        require(cp[id] < 3, "super can't be charged");
        require(Chickiz.ownerOf(id) == msg.sender, "not owner");
        require(oilCharged[id].add(_OIL_DURATION) < block.timestamp);

        if (minable(id) > 0) {
            _mine(id);
        }

        oilCharged[id] = block.timestamp;
    }

    function mine(uint256[] memory ids) public nonReentrant {
        uint256 len = ids.length;
        for (uint256 i = 0; i < len; i++) {
            _mine(ids[i]);
        }
    }

    function charge(uint256[] memory ids) public {
        uint256 len = ids.length;
        Oil.burn(msg.sender, 2001, len);
        for (uint256 i = 0; i < len; i++) {
            _charge_withoutburn(ids[i]);
        }
    }

    function chickizInfo(uint256 id)
        public
        view
        returns (
            uint8 _cp,
            uint256 _mentor,
            uint8 _mentorKind,
            uint256 _oilCharged,
            uint256 _lastMined
        )
    {
        _cp = cp[id];
        _mentor = mentor[id];
        _mentorKind = mentorKind[id];
        _oilCharged = oilCharged[id];
        _lastMined = lastMined[id];

        return (_cp, _mentor, _mentorKind, _oilCharged, _lastMined);
    }
}
