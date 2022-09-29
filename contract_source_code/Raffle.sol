pragma solidity ^0.5.6;

import "./interface/IRaffle.sol";
import "./klaytn-contracts/token/KIP17/IKIP17.sol";
import "./klaytn-contracts/token/KIP7/IKIP7.sol";
import "./klaytn-contracts/ownership/Ownable.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./ReentrancyGuard.sol";

/*
                                        @@@@@@@                                                      
                                     @@@@@@@@@@@@#                                                   
                                   (@@@@@@@@@@@@@@                                                   
                               ,@@ @@@@@@@@@@@@@@@@@@                                                
                            @@@@@@@@@@@@@@@@@@,@@@@@@@@,                                             
                            @@@@@@&%@@@@@@@@ @@@@@@@@@@                                              
                             @@@@              (@@@@@                                                
                                *@@@@@@@@@@@@@@%                                                     
                          ,@@@@@@@@@@@@@@@@@@@@@@@@@@,                                               
                        *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                             
                      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                          
                   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                       
                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                     
               @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                    
              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                  
           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                
           @%                                                      @@                                
          %@%  @@@%      @@@@@@@@@@         @@@&      @@@@@@@@@@   @@@                               
          @@%  @@@     @@@@@@@@@@@@#  @@@   @@@     %@@@@@@@@@@@   @@@                               
         @@@%  @@/    @@@@@@@@@@@@@#  @@@   @@%    @@@@@@@@@@@@@   @@@@                              
       &@@@@@  %@@   #@@@@@@@@@@@@@  ,@@@@  @@%   *@@@@@@@@@@@@@  (@@@@@@  @@@@@@@@&                 
       @@@@@@@  ,@@  @@@@@@@@@@@@@           @@@  @@@@@@@@@@@@(  ,@@@@@@ *@@@@@@@@@                  
      @@@@@@@@@(   @@ @@@@@@@@@&   @@@@@@@@@.  *@@ @@@@@@@@@*   @@@@@@@ .@@@@@@@@@@                  
      @@@@@@@@@@@@              #@@@@@@@@@@@@@@              @@@@@@@@@* @@@@@@@@@@                   
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@                   
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*,        (@@@@@@@@@@                   
         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  %@@@@@@@@@@@@@@@@@@@@@@*                  
            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ .@@@@@@@@@@@@@@@@@@@@@@@@@@                 
              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  //@@@@@@@@@@@@@@@@@@@@@@@@@                
                  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@( @@@@@@@@@@@@@@@@@@@@@@@@@@@@@                
                         @      @@   &@@@@@    @@       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@                
                           (@@@@@@@@@@@@@@@@@@@@@@@@@         @@@@@@@@@@@@@@@@@@@@@@                 
                               @@@@@@@@@@@@@@@@@@#       *@@@@@@@@@@@@@@@@@@@@@@@@%                  
                                   .@@@@@@@@.             /@@@@@@@@@@@@@@@@@@@@@                     
                                                                 (@@@@@@@/.                          

      @@@@@@     @@@@     @@@  @@@@     @@@@@@    *@@@       % %@@@ @@@@@@@@@@@@                     
   &@@@@@@@@@@@  @@@@     @@@  @@@@  @@@@@@@@@@@# *@@@  (@@@@% %@@@        @@@@/                     
   @@@@          @@@@     @@@  @@@@ #@@@,         *@@@@@@@@    %@@@      @@@@&                       
   @@@@          @@@@@@@@@@@@  @@@@ #@@@          *@@@@@@      %@@@     @@@@                         
   @@@@          @@@@     @@@  @@@@ #@@@          *@@@@@@@@@   %@@@   @@@@                           
   @@@@@,,@@@@@  @@@@     @@@  @@@@  @@@@@,,@@@@@ *@@@   &@@@@ %@@@ @@@@@@@@@@@@                     
     @@@@@@@@    @@@@     @@@  @@@@   .@@@@@@@%   *@@@      .@ %@@@ @@@@@@@@@@@@         
*/

contract Raffle is Ownable, ReentrancyGuard, IRaffle {
    using SafeMath for uint256;

    IKIP7 public Chick;
    IKIP17 public Chickiz;
    address payable public Treasury;

    /*
        -- CONSTANT VALUES --
        
        PAYMENT METHOD 0,1

        RAFFLER STATUS 0,1
        - status with 0 will get discount, status with 1 won't.
        - it depends on chickiz balance and raffler_discount_chickizQuan.

        RAFFLE STATUS 0,1,2
    */

    uint8 private constant _PAYMENT_METHOD_KLAY = 0;
    uint8 private constant _PAYMENT_METHOD_CHICK = 1;

    uint8 private constant _RAFFLER_STATUS_DISCOUNT = 0;
    uint8 private constant _RAFFLER_STATUS_NODISCOUNT = 1;

    uint8 private constant _RAFFLE_STATUS_ING = 0; // 진행중
    uint8 private constant _RAFFLE_STATUS_REFUND = 1; // 환불
    uint8 private constant _RAFFLE_STATUS_ED = 2; // 끝, 추첨 아직
    uint8 private constant _RAFFLE_STATUS_DONE = 3; // 추첨까지 끝

    // for checking rafflerStatus
    uint256 public raffler_minimun_chickizQuan = 0;
    uint256 public raffler_discount_chickizQuan = 3;

    uint256 public raffle_fee = 60; // divided by 1000
    uint256 public raffle_fee_discount = 30;
    uint256 public raffle_fee_dividend = 1000;

    // ticket
    uint256 public ticket_min = 10;
    uint256 public ticket_max = 300;
    uint256 public ticket_max_price = 1e27;

    // interface
    bytes4 private constant _INTERFACE_ID_KIP17 = 0x80ac58cd;

    // period
    uint256 public minRafflePeriod = 21600;
    uint256 public maxRafflePeriod = 172800;

    // raffle info
    struct RaffleStruct {
        uint256 raffleNum;
        address raffler;
        uint8 rafflerStatus; // 0 - chickiz holder => discount, 1 - not holder => no discount
        IKIP17 nft;
        uint256 nft_tokenId;
        uint256 startBlock;
        uint256 rafflePeriod;
        uint8 paymentMethod; // 0 - klay, 1 - chick
        uint256 ticketPrice;
        uint256 ticketQuan;
    }

    struct WinnerStruct {
        address winner;
        uint256 ticketQuan;
    }

    RaffleStruct[] public RaffleList;
    mapping(uint256 => mapping(address => uint256)) public participants_ticket;
    mapping(uint256 => uint256) public soldTickets;
    mapping(uint256 => mapping(uint256 => address))
        public ticketnumber_participants;
    mapping(uint256 => bool) public rafflingDone; // 추첨 끝났는가
    mapping(uint256 => WinnerStruct) public raffleResult;

    mapping(uint256 => bool) public claimByRaffler_done;
    mapping(uint256 => bool) public claimByWinner_done;

    constructor() public {}

    // settings
    function setChick(IKIP7 _token) external onlyOwner {
        Chick = _token;
    }

    function setChickiz(IKIP17 _nft) external onlyOwner {
        Chickiz = _nft;
    }

    function setTreasury(address payable _treasury) external onlyOwner {
        Treasury = _treasury;
    }

    function setRafflePeriod(uint256 _min, uint256 _max) external onlyOwner {
        minRafflePeriod = _min;
        maxRafflePeriod = _max;
    }

    function setRaffleFee(uint256 _fee, uint256 _fee_discount)
        external
        onlyOwner
    {
        raffle_fee = _fee;
        raffle_fee_discount = _fee_discount;
    }

    function setRafflerQuan(uint256 _minimum, uint256 _discount)
        external
        onlyOwner
    {
        raffler_minimun_chickizQuan = _minimum;
        raffler_discount_chickizQuan = _discount;
    }

    function setTicketQuan(uint256 _minimum, uint256 _maximum)
        external
        onlyOwner
    {
        ticket_min = _minimum;
        ticket_max = _maximum;
    }

    function setTicketMaxPrice(uint256 _price) external onlyOwner {
        ticket_max_price = _price;
    }

    // raffle view
    function totalRaffles() public view returns (uint256) {
        return RaffleList.length;
    }

    function raffleStatus(uint256 _raffleNum) public view returns (uint256) {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];

        if (_raffle.startBlock.add(_raffle.rafflePeriod) >= block.number) {
            return _RAFFLE_STATUS_ING;
        } else if (soldTickets[_raffleNum] == 0) {
            return _RAFFLE_STATUS_REFUND;
        } else {
            return
                rafflingDone[_raffleNum]
                    ? _RAFFLE_STATUS_DONE
                    : _RAFFLE_STATUS_ED;
        }
    }

    // raffle
    function createRaffle(
        IKIP17 _nft,
        uint256 _tokenId,
        uint256 _period,
        uint8 _paymentMehtod,
        uint256 _ticketPrice,
        uint256 _ticketQuan
    ) external {
        uint256 chickizBalance = Chickiz.balanceOf(msg.sender);
        require(_checkKIP17(_nft), "it's not an NFT");
        require(
            chickizBalance >= raffler_minimun_chickizQuan,
            "not enough chickiz"
        );
        require(
            minRafflePeriod <= _period && _period <= maxRafflePeriod,
            "not correct period"
        );
        require(
            ticket_min <= _ticketQuan && _ticketQuan <= ticket_max,
            "not correct ticketQuan"
        );

        _nft.transferFrom(msg.sender, address(this), _tokenId);

        uint256 _raffleNum = totalRaffles();

        RaffleList.push(
            RaffleStruct({
                raffleNum: _raffleNum,
                raffler: msg.sender,
                rafflerStatus: chickizBalance >= raffler_discount_chickizQuan
                    ? _RAFFLER_STATUS_DISCOUNT
                    : _RAFFLER_STATUS_NODISCOUNT,
                nft: _nft,
                nft_tokenId: _tokenId,
                startBlock: block.number,
                rafflePeriod: _period,
                paymentMethod: _paymentMehtod,
                ticketPrice: _ticketPrice,
                ticketQuan: _ticketQuan
            })
        );

        emit RaffleCreate(_raffleNum, msg.sender, _nft, _tokenId);
    }

    function buyTicketsWithKlay(uint256 _raffleNum, uint256 _ticketQuan)
        external
        payable
    {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];
        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_ING,
            "raffle is not in progress"
        );
        require(
            _raffle.paymentMethod == _PAYMENT_METHOD_KLAY,
            "buy tickets with Chick, plz"
        );
        require(
            msg.value >= _ticketQuan.mul(_raffle.ticketPrice),
            "not enough KLAY"
        );
        require(
            soldTickets[_raffleNum].add(_ticketQuan) <= _raffle.ticketQuan,
            "not enough TICKET"
        );
        require(_raffle.raffler != msg.sender, "raffler can't buy tickets");

        for (
            uint256 i = soldTickets[_raffleNum];
            i < soldTickets[_raffleNum].add(_ticketQuan);
            i++
        ) {
            ticketnumber_participants[_raffleNum][i] = msg.sender;
        }

        soldTickets[_raffleNum] = soldTickets[_raffleNum].add(_ticketQuan);

        uint256 _now_ticket_quan = participants_ticket[_raffleNum][msg.sender]
            .add(_ticketQuan);

        participants_ticket[_raffleNum][msg.sender] = _now_ticket_quan;

        emit TicketBuy(_raffleNum, msg.sender, _ticketQuan, _now_ticket_quan);
    }

    function buyTicketsWithChick(uint256 _raffleNum, uint256 _ticketQuan)
        external
    {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];
        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_ING,
            "raffle is not in progress"
        );
        require(
            _raffle.paymentMethod == _PAYMENT_METHOD_CHICK,
            "buy tickets with Klay, plz"
        );
        require(
            soldTickets[_raffleNum].add(_ticketQuan) <= _raffle.ticketQuan,
            "not enough TICKET"
        );
        require(_raffle.raffler != msg.sender, "raffler can't buy tickets");

        Chick.transferFrom(
            msg.sender,
            address(this),
            _ticketQuan.mul(_raffle.ticketPrice)
        );

        for (
            uint256 i = soldTickets[_raffleNum];
            i < soldTickets[_raffleNum].add(_ticketQuan);
            i++
        ) {
            ticketnumber_participants[_raffleNum][i] = msg.sender;
        }

        soldTickets[_raffleNum] = soldTickets[_raffleNum].add(_ticketQuan);

        uint256 _now_ticket_quan = participants_ticket[_raffleNum][msg.sender]
            .add(_ticketQuan);

        participants_ticket[_raffleNum][msg.sender] = _now_ticket_quan;

        emit TicketBuy(_raffleNum, msg.sender, _ticketQuan, _now_ticket_quan);
    }

    function selectWinner(uint256 _raffleNum, uint256 _rnd)
        external
        onlyOwner
        nonReentrant
    {
        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_ED,
            "raffle's not over yet"
        );

        uint256 selectedTicket = _randomNumber(_rnd, soldTickets[_raffleNum]);
        address _winner = ticketnumber_participants[_raffleNum][selectedTicket];
        uint256 _winner_ticketQuan = participants_ticket[_raffleNum][_winner];

        raffleResult[_raffleNum] = WinnerStruct({
            winner: _winner,
            ticketQuan: _winner_ticketQuan
        });

        rafflingDone[_raffleNum] = true;

        emit WinnerSelect(_raffleNum, _winner, _winner_ticketQuan);
    }

    function claimByRaffler(uint256 _raffleNum) external nonReentrant {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];
        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_DONE,
            "raffle's not over yet"
        );
        require(claimByRaffler_done[_raffleNum] == false, "already claimed");
        require(_raffle.raffler == msg.sender, "you're not a raffler");

        if (_raffle.paymentMethod == _PAYMENT_METHOD_KLAY) {
            if (_raffle.rafflerStatus == _RAFFLER_STATUS_DISCOUNT) {
                msg.sender.transfer(
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_dividend.sub(raffle_fee_discount))
                        .div(raffle_fee_dividend)
                );
                Treasury.transfer(
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_discount)
                        .div(raffle_fee_dividend)
                );
            } else {
                msg.sender.transfer(
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_dividend.sub(raffle_fee))
                        .div(raffle_fee_dividend)
                );
                Treasury.transfer(
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee)
                        .div(raffle_fee_dividend)
                );
            }
        } else if (_raffle.paymentMethod == _PAYMENT_METHOD_CHICK) {
            if (_raffle.rafflerStatus == _RAFFLER_STATUS_DISCOUNT) {
                Chick.transfer(
                    msg.sender,
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_dividend.sub(raffle_fee_discount))
                        .div(raffle_fee_dividend)
                );
                Chick.transfer(
                    Treasury,
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_discount)
                        .div(raffle_fee_dividend)
                );
            } else {
                Chick.transfer(
                    msg.sender,
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee_dividend.sub(raffle_fee))
                        .div(raffle_fee_dividend)
                );
                Chick.transfer(
                    Treasury,
                    soldTickets[_raffleNum]
                        .mul(_raffle.ticketPrice)
                        .mul(raffle_fee)
                        .div(raffle_fee_dividend)
                );
            }
        }

        claimByRaffler_done[_raffleNum] = true;

        emit RafflerClaim(_raffleNum, msg.sender);
    }

    function claimByWinner(uint256 _raffleNum) external nonReentrant {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];
        WinnerStruct memory _winner = raffleResult[_raffleNum];

        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_DONE,
            "raffle's not over yet"
        );
        require(claimByWinner_done[_raffleNum] == false, "already claimed");
        require(_winner.winner == msg.sender, "you're not a winner"); // winner

        _raffle.nft.transferFrom(
            address(this),
            msg.sender,
            _raffle.nft_tokenId
        );

        claimByWinner_done[_raffleNum] = true;

        emit WinnerClaim(_raffleNum, msg.sender);
    }

    function refund(uint256 _raffleNum) external nonReentrant {
        RaffleStruct memory _raffle = RaffleList[_raffleNum];
        require(
            raffleStatus(_raffleNum) == _RAFFLE_STATUS_REFUND,
            "it's not for refund"
        );
        require(claimByRaffler_done[_raffleNum] == false, "already claimed");
        require(_raffle.raffler == msg.sender, "you're not a raffler");

        _raffle.nft.transferFrom(
            address(this),
            msg.sender,
            _raffle.nft_tokenId
        );

        claimByRaffler_done[_raffleNum] = true;
        claimByWinner_done[_raffleNum] = true;

        emit RefundClaim(_raffleNum, msg.sender);
    }

    // random

    function _randomNumber(uint256 _rnd, uint256 max)
        internal
        view
        returns (uint256)
    {
        return
            uint256(
                uint256(keccak256(abi.encodePacked(block.timestamp, _rnd))) %
                    max
            );
    }

    // check nft raffle possible
    function _checkKIP17(IKIP17 _raffleNFT) internal view returns (bool) {
        return _raffleNFT.supportsInterface(_INTERFACE_ID_KIP17);
    }

    // for emergencies
    function withdrawNFT(IKIP17 _nft, uint256 _tokenId) external onlyOwner {
        _nft.transferFrom(address(this), msg.sender, _tokenId);
    }

    function withdrawKlay(uint256 amount) external onlyOwner {
        msg.sender.transfer(amount);
    }

    function withdrawChick(uint256 amount) external onlyOwner {
        Chick.transfer(msg.sender, amount);
    }
}
