pragma solidity ^0.5.6;

import "../klaytn-contracts/token/KIP17/IKIP17.sol";

interface IRaffle {
    event RaffleCreate(
        uint256 indexed raffleNum,
        address indexed raffler,
        IKIP17 indexed nft,
        uint256 tokenId
    );

    event TicketBuy(
        uint256 indexed raffleNum,
        address indexed buyer,
        uint256 indexed ticketQuan,
        uint256 ticketBalance
    );

    event WinnerSelect(
        uint256 indexed raffleNum,
        address indexed winner,
        uint256 indexed winnerTicketQuan
    );

    event RafflerClaim(uint256 indexed raffleNum, address indexed claimer);
    event WinnerClaim(uint256 indexed raffleNum, address indexed claimer);
    event RefundClaim(uint256 indexed raffleNum, address indexed claimer);

    function createRaffle(
        IKIP17 _nft,
        uint256 _tokenId,
        uint256 _period,
        uint8 _paymentMehtod,
        uint256 _ticketPrice,
        uint256 _ticketQuan
    ) external;

    function buyTicketsWithKlay(uint256 _raffleNum, uint256 _ticketQuan)
        external
        payable;

    function buyTicketsWithChick(uint256 _raffleNum, uint256 _ticketQuan)
        external;

    function selectWinner(uint256 _raffleNum, uint256 _rnd) external;

    function claimByRaffler(uint256 _raffleNum) external;

    function claimByWinner(uint256 _raffleNum) external;

    function refund(uint256 _raffleNum) external;
}
