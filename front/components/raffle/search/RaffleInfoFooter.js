import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";

// css
import classnames from 'classnames'
import RaffleCSS from "../../../styles/raffle.module.css";

// page components
import Loading from '../../util/Loading';
import useInput from '../../../hooks/useInput';

// chain
import Rafflecontract from '../../chain/contract/Rafflecontract';
import convert from '../../chain/utils/convert';
import Chickcontract from "../../chain/contract/Chickcontract";
import ContractAddress from "../../../src/data/contract/ContractAddress";

// data
import farmerRankList from '../../../src/data/farm/FarmerRankList';

// images
import questionIcon_black from '../../../src/image/utils/question_black.png';
import klaytnLogo from '../../../src/image/logo/klaytnLogo.png';
import chickLogo from '../../../src/image/chick/chick.png';

// store
import { setRequestKey, setKlipModalBool } from '../../../store/modules/klipstore';
import { resetOtherNFT, getOtherNFTBalances } from "../../../store/modules/otherNft";
import { getBalance } from '../../../store/modules/myInfo';
import { buyRaffleTicket } from "../../../store/modules/raffle/raffle";

import { getMyRaffleList_buy_live_first, getMyRaffleList_buy_end_first, getMyRaffleList_buy_win_first } from '../../../store/modules/raffle/myRaffle';
import { setSmallModalBool, setConfirmState } from '../../../store/modules/modal';

function RaffleInfoFooter({ refresh }) {

    const dispatch = useDispatch();
    const router = useRouter();

    const { isUser, account } = useSelector((state) => state.myInfo);
    const { raffleDetail,
        loading_raffleDetail_chain,
        raffleDetail_soldTickets,
        raffleDetail_rafflerClaim,
        raffleDetail_winnerClaim, } = useSelector((state) => state.raffle);
    const { confirmState } = useSelector((state) => state.modal);
    const [func, setFunc] = useState('');

    const [ticketInput, onChangeTicketInput] = useInput('');

    // loading
    const [walletSignLoading, setWalletSignLoading] = useState(false);

    useEffect(() => {
        if (!confirmState) return;
        dispatch(setConfirmState({ confirmState: false }))
        if (func === 'signUp') {
            router.push('/signUp')
        } else if (func === 'buy') {
            buy()
        }
    }, [confirmState])


    // function getUserRankNum(chickizQuan) {
    //     for (let i = 0; i < farmerRankList.length; i++) {
    //         if (farmerRankList[i].min <= chickizQuan && chickizQuan <= farmerRankList[i].max) {
    //             return i
    //         }
    //     }
    // }

    async function buy() {
        try {
            const rafflecon = new Rafflecontract();
            if (Number(await rafflecon.getRaffleStatus(raffleDetail.id)) !== 0) {
                dispatch(setSmallModalBool({ bool: true, msg: '래플이 종료되었습니다.', modalTemplate: "justAlert" }))
                return
            }
            setWalletSignLoading(true);

            if (Number(raffleDetail.paymentMethod) === 1) {
                const chick_con = new Chickcontract();
                let res = {};

                if ((await chick_con.getAllowance(account, ContractAddress.raffle)).toString() !== '0') {
                    res.status = true;
                } else {
                    res = await chick_con.approve(klipPopOn, klipPopOff, account, ContractAddress.raffle)
                }

                if (res.status !== true) {
                    dispatch(setSmallModalBool({ bool: true, msg: '티켓 구매에 실패하였습니다.', modalTemplate: "justAlert" }))
                    setWalletSignLoading(false);
                    return
                }
            }

            const res1 = await rafflecon.buyTicket(klipPopOn, klipPopOff, account, raffleDetail.paymentMethod, raffleDetail.ticketPrice, raffleDetail.id, ticketInput);
            if (res1.status = true) {
                const res2 = await dispatch(buyRaffleTicket({ buyer: account, raffleId: raffleDetail.id })).unwrap()
                dispatch(getBalance(account));
                dispatch(setSmallModalBool({ bool: true, msg: res2?.msg, modalTemplate: "justAlert" }))
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '티켓 구매에 실패하였습니다.', modalTemplate: "justAlert" }))
            }
            refresh(raffleDetail.id);
            dispatch(getMyRaffleList_buy_live_first({ account: account }))
            setWalletSignLoading(false);
        } catch (err) {
            setWalletSignLoading(false);
            dispatch(setSmallModalBool({ bool: true, msg: '티켓 구매에 실패하였습니다.\n\n* 단, 트랜잭션이 일어나 클레이(토큰)가 빠져나갔다면 1분 이내에 티켓이 정상적으로 수령됩니다.\n\n* 오류가 반복되면 운영팀에 문의주세요.', modalTemplate: "justAlert" }))
            console.error(err)
        }
    }

    async function buyTicket() {
        if (!isUser) {
            setFunc('signUp')
            dispatch(setSmallModalBool({ bool: true, msg: '티켓 구매를 위해서는 농장 입주가 필요합니다. \n 확인을 누르시면 농장 입주 페이지로 이동합니다.', modalTemplate: "confirmAlert" }))
            return;
        }
        if (Number(raffleDetail.ticketQuan) === Number(raffleDetail_soldTickets)) {
            dispatch(setSmallModalBool({ bool: true, msg: '티켓이 매진되었습니다.', modalTemplate: "justAlert" }))
            return
        }
        if (!(ticketInput !== '' && ticketInput % 1 === 0 && 0 < ticketInput && ticketInput <= 20 && ticketInput <= (raffleDetail.ticketQuan - raffleDetail_soldTickets))) {
            dispatch(setSmallModalBool({ bool: true, msg: `올바른 티켓 개수를 입력해주세요(1~${Math.min(20, (raffleDetail.ticketQuan - raffleDetail_soldTickets))}개).`, modalTemplate: "justAlert" }))
            return
        }
        setFunc('buy')
        dispatch(setSmallModalBool({ bool: true, msg: '티켓 구매 이후에는 환불/취소하실 수 없습니다. \n 티켓을 구매하시겠습니까?', modalTemplate: "confirmAlert" }))
    }

    async function getRefund() {
        try {
            const rafflecon = new Rafflecontract();
            if (Number(await rafflecon.getRaffleStatus(raffleDetail.id)) !== 1) {
                dispatch(setSmallModalBool({ bool: true, msg: '잠시 후에 다시 시도해주세요.', modalTemplate: "justAlert" }))
                return
            }
            await rafflecon.refund(klipPopOn, klipPopOff, account, raffleDetail.id);
            refresh(raffleDetail.id);
            dispatch(resetOtherNFT());
            dispatch(getOtherNFTBalances(account));
        } catch (err) {
            console.error(err);
        }
    }

    async function claim_Raffler() {
        try {
            const rafflecon = new Rafflecontract();
            await rafflecon.claimByRaffler(klipPopOn, klipPopOff, account, raffleDetail.id);
            refresh(raffleDetail.id);
            dispatch(getBalance(account));
        } catch (err) {
            console.error(err);
        }
    }

    async function claim_Winner() {
        try {
            const rafflecon = new Rafflecontract();
            await rafflecon.claimByWinner(klipPopOn, klipPopOff, account, raffleDetail.id);
            refresh(raffleDetail.id);
            dispatch(resetOtherNFT());
            dispatch(getOtherNFTBalances(account));
        } catch (err) {
            console.error(err);
        }
    }

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    // component
    function forRaffleStatus_3() {
        if (account.toUpperCase() === raffleDetail.raffler?.toUpperCase()) {
            if (raffleDetail_rafflerClaim) {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                당첨자
                            </span>
                            <span id='balloon_light' balloon='농장 방문하기' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
                                <b id='hyperBlue'>{raffleDetail.winnerName}</b>
                            </span>
                        </div>
                        {
                            loading_raffleDetail_chain
                                ?
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    판매금액 수령완료
                                </button>
                        }
                    </>
                )
            } else {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                판매 금액
                            </span>
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                총 {raffleDetail_soldTickets > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, raffleDetail_soldTickets) : 0}
                                {raffleDetail.paymentMethod === 0 ? ' KLAY' : ' CHICK'}
                                <div id='balloon_light' balloon={raffleDetail.rafflerStatus === 0 ? '수수료 3%' : '수수료 6%'} className={RaffleCSS.raffleInfoHelpIcon}
                                    onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: raffleDetail.rafflerStatus === 0 ? '수수료 3%가 차감됩니다(치키즈 3개 이상 보유).' : '수수료 6%가 차감됩니다(치키즈 3개 미만 보유).', modalTemplate: "justAlert" }))
                                    }}>
                                    <Image className='image100' src={questionIcon_black} alt='help' />
                                </div>
                            </span>
                        </div >
                        {
                            loading_raffleDetail_chain || walletSignLoading
                                ?
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'purpleButton')} onClick={claim_Raffler}>
                                    판매금액 수령하기
                                </button>
                        }
                    </>
                )
            }
        } else if (account.toUpperCase() === raffleDetail.winner?.toUpperCase()) {
            if (raffleDetail_winnerClaim) {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                당첨자
                            </span>
                            <span id='balloon_light' balloon='농장 방문하기' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
                                <b id='hyperBlue'>{raffleDetail.winnerName}</b>
                            </span>
                        </div>
                        {
                            loading_raffleDetail_chain
                                ?
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    NFT 수령완료
                                </button>
                        }
                    </>
                )
            } else {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                당첨자
                            </span>
                            <span id='balloon_light' balloon='농장 방문하기' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
                                <b id='hyperBlue'>{raffleDetail.winnerName}</b>
                            </span>
                        </div>
                        {
                            loading_raffleDetail_chain || walletSignLoading
                                ?
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                    <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'purpleButton')} onClick={claim_Winner}>
                                    NFT 수령하기
                                </button>
                        }
                    </>
                )
            }
        } else {
            return (
                <>
                    <div className={RaffleCSS.raffleInfoFooter_top} >
                        <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                            당첨자
                        </span>
                        <span id='balloon_light' balloon='농장 방문하기' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
                            <b id='hyperBlue'>{raffleDetail.winnerName}</b>
                        </span>
                    </div>
                    <span className={RaffleCSS.raffleInfoWinnerSmall}>
                        ({raffleDetail.winnerQuan}개 구매)
                    </span>
                </>
            )
        }
    }


    return (
        <div className={RaffleCSS.raffleInfoFooter}>
            {
                {
                    0:
                        <>
                            {
                                account.toUpperCase() !== raffleDetail.raffler?.toUpperCase()
                                    ?
                                    <>
                                        <div className={RaffleCSS.raffleInfoFooter_top} >
                                            <div className={RaffleCSS.raffleInfoFooterInputWhole}>
                                                <input className={RaffleCSS.raffleInputBox} type='number' placeholder="1 ~ 20개"
                                                    onChange={onChangeTicketInput}
                                                    value={ticketInput}
                                                    min={1} max={20} />
                                                <div id='balloon_light' balloon='한 번 구매에 20개까지' className={RaffleCSS.raffleInfoHelpIcon}
                                                    onClick={function () {
                                                        dispatch(setSmallModalBool({ bool: true, msg: '한 트랜잭션 당 20개까지 구매 가능합니다.', modalTemplate: "justAlert" }))
                                                    }}>
                                                    <Image className='image100' src={questionIcon_black} alt='help' />
                                                </div>
                                            </div>
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                총 {ticketInput > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, ticketInput) : 0}
                                                {raffleDetail.paymentMethod === 0 ? ' KLAY' : ' CHICK'}
                                            </span>
                                        </div>
                                        {
                                            loading_raffleDetail_chain || walletSignLoading
                                                ?
                                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                                    <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                                        <Loading />
                                                    </div>
                                                </button>
                                                :
                                                <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'purpleButton')} onClick={buyTicket}>
                                                    구매하기
                                                </button>
                                        }
                                    </>
                                    :
                                    <>
                                        <div className={RaffleCSS.raffleInfoFooter_top} >
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                판매 금액
                                            </span>
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                총 {raffleDetail_soldTickets > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, raffleDetail_soldTickets) : 0}
                                                {raffleDetail.paymentMethod === 0 ? ' KLAY' : ' CHICK'}
                                                <div id='balloon_light' balloon={raffleDetail.rafflerStatus === 0 ? '수수료 3%' : '수수료 6%'} className={RaffleCSS.raffleInfoHelpIcon}
                                                    onClick={function () {
                                                        dispatch(setSmallModalBool({ bool: true, msg: raffleDetail.rafflerStatus === 0 ? '수수료 3%가 차감됩니다(치키즈 3개 이상 보유).' : '수수료 6%가 차감됩니다(치키즈 3개 미만 보유).', modalTemplate: "justAlert" }))
                                                    }}>
                                                </div>
                                            </span>
                                        </div>
                                        <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                            판매금액 수령하기
                                        </button>
                                    </>
                            }
                        </>,
                    1:
                        <>
                            <div className={RaffleCSS.raffleInfoFooter_top} >
                                <span className={RaffleCSS.raffleInfoFooter_singleLine}>
                                    티켓이 판매되지 않아, 당첨자가 없습니다.
                                </span>
                            </div>
                            {
                                account.toUpperCase() === raffleDetail.raffler?.toUpperCase()
                                    ?
                                    loading_raffleDetail_chain || walletSignLoading
                                        ?
                                        <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                            <div className={RaffleCSS.raffleInfoFooterLoadingButton}>
                                                <Loading />
                                            </div>
                                        </button>
                                        :
                                        !raffleDetail_rafflerClaim
                                            ?
                                            <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'purpleButton')} onClick={getRefund}>
                                                NFT 반환받기
                                            </button>
                                            :
                                            <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')} >
                                                NFT 반환완료
                                            </button>
                                    :
                                    null
                            }
                        </>,
                    2:
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooter_singleLine}>
                                <div className={RaffleCSS.raffleInfoFooter_singleLineLoading}>
                                    <Loading color='light' />
                                </div>
                                당첨자 추첨이 진행중입니다.
                            </span>
                        </div>,
                    3:
                        <>
                            {forRaffleStatus_3()}
                        </>
                }[raffleDetail.raffleStatus]
            }
        </div >
    );
}

export default RaffleInfoFooter;