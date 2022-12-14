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
                dispatch(setSmallModalBool({ bool: true, msg: '????????? ?????????????????????.', modalTemplate: "justAlert" }))
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
                    dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ?????????????????????.', modalTemplate: "justAlert" }))
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
                dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ?????????????????????.', modalTemplate: "justAlert" }))
            }
            refresh(raffleDetail.id);
            dispatch(getMyRaffleList_buy_live_first({ account: account }))
            setWalletSignLoading(false);
        } catch (err) {
            setWalletSignLoading(false);
            dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ?????????????????????.\n\n* ???, ??????????????? ????????? ?????????(??????)??? ?????????????????? 1??? ????????? ????????? ??????????????? ???????????????.\n\n* ????????? ???????????? ???????????? ???????????????.', modalTemplate: "justAlert" }))
            console.error(err)
        }
    }

    async function buyTicket() {
        if (!isUser) {
            setFunc('signUp')
            dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ???????????? ?????? ????????? ???????????????. \n ????????? ???????????? ?????? ?????? ???????????? ???????????????.', modalTemplate: "confirmAlert" }))
            return;
        }
        if (Number(raffleDetail.ticketQuan) === Number(raffleDetail_soldTickets)) {
            dispatch(setSmallModalBool({ bool: true, msg: '????????? ?????????????????????.', modalTemplate: "justAlert" }))
            return
        }
        if (!(ticketInput !== '' && ticketInput % 1 === 0 && 0 < ticketInput && ticketInput <= 20 && ticketInput <= (raffleDetail.ticketQuan - raffleDetail_soldTickets))) {
            dispatch(setSmallModalBool({ bool: true, msg: `????????? ?????? ????????? ??????????????????(1~${Math.min(20, (raffleDetail.ticketQuan - raffleDetail_soldTickets))}???).`, modalTemplate: "justAlert" }))
            return
        }
        setFunc('buy')
        dispatch(setSmallModalBool({ bool: true, msg: '?????? ?????? ???????????? ??????/???????????? ??? ????????????. \n ????????? ?????????????????????????', modalTemplate: "confirmAlert" }))
    }

    async function getRefund() {
        try {
            const rafflecon = new Rafflecontract();
            if (Number(await rafflecon.getRaffleStatus(raffleDetail.id)) !== 1) {
                dispatch(setSmallModalBool({ bool: true, msg: '?????? ?????? ?????? ??????????????????.', modalTemplate: "justAlert" }))
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
                                ?????????
                            </span>
                            <span id='balloon_light' balloon='?????? ????????????' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
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
                                    ???????????? ????????????
                                </button>
                        }
                    </>
                )
            } else {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                ?????? ??????
                            </span>
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                ??? {raffleDetail_soldTickets > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, raffleDetail_soldTickets) : 0}
                                {raffleDetail.paymentMethod === 0 ? ' KLAY' : ' CHICK'}
                                <div id='balloon_light' balloon={raffleDetail.rafflerStatus === 0 ? '????????? 3%' : '????????? 6%'} className={RaffleCSS.raffleInfoHelpIcon}
                                    onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: raffleDetail.rafflerStatus === 0 ? '????????? 3%??? ???????????????(????????? 3??? ?????? ??????).' : '????????? 6%??? ???????????????(????????? 3??? ?????? ??????).', modalTemplate: "justAlert" }))
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
                                    ???????????? ????????????
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
                                ?????????
                            </span>
                            <span id='balloon_light' balloon='?????? ????????????' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
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
                                    NFT ????????????
                                </button>
                        }
                    </>
                )
            } else {
                return (
                    <>
                        <div className={RaffleCSS.raffleInfoFooter_top} >
                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                ?????????
                            </span>
                            <span id='balloon_light' balloon='?????? ????????????' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
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
                                    NFT ????????????
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
                            ?????????
                        </span>
                        <span id='balloon_light' balloon='?????? ????????????' className={RaffleCSS.raffleInfoFooterPriceBox} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.winner}`)}>
                            <b id='hyperBlue'>{raffleDetail.winnerName}</b>
                        </span>
                    </div>
                    <span className={RaffleCSS.raffleInfoWinnerSmall}>
                        ({raffleDetail.winnerQuan}??? ??????)
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
                                                <input className={RaffleCSS.raffleInputBox} type='number' placeholder="1 ~ 20???"
                                                    onChange={onChangeTicketInput}
                                                    value={ticketInput}
                                                    min={1} max={20} />
                                                <div id='balloon_light' balloon='??? ??? ????????? 20?????????' className={RaffleCSS.raffleInfoHelpIcon}
                                                    onClick={function () {
                                                        dispatch(setSmallModalBool({ bool: true, msg: '??? ???????????? ??? 20????????? ?????? ???????????????.', modalTemplate: "justAlert" }))
                                                    }}>
                                                    <Image className='image100' src={questionIcon_black} alt='help' />
                                                </div>
                                            </div>
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                ??? {ticketInput > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, ticketInput) : 0}
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
                                                    ????????????
                                                </button>
                                        }
                                    </>
                                    :
                                    <>
                                        <div className={RaffleCSS.raffleInfoFooter_top} >
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                ?????? ??????
                                            </span>
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                ??? {raffleDetail_soldTickets > 0 ? convert.from_mKLAY_to_KLAY_multiply(raffleDetail.ticketPrice, raffleDetail_soldTickets) : 0}
                                                {raffleDetail.paymentMethod === 0 ? ' KLAY' : ' CHICK'}
                                                <div id='balloon_light' balloon={raffleDetail.rafflerStatus === 0 ? '????????? 3%' : '????????? 6%'} className={RaffleCSS.raffleInfoHelpIcon}
                                                    onClick={function () {
                                                        dispatch(setSmallModalBool({ bool: true, msg: raffleDetail.rafflerStatus === 0 ? '????????? 3%??? ???????????????(????????? 3??? ?????? ??????).' : '????????? 6%??? ???????????????(????????? 3??? ?????? ??????).', modalTemplate: "justAlert" }))
                                                    }}>
                                                </div>
                                            </span>
                                        </div>
                                        <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')}>
                                            ???????????? ????????????
                                        </button>
                                    </>
                            }
                        </>,
                    1:
                        <>
                            <div className={RaffleCSS.raffleInfoFooter_top} >
                                <span className={RaffleCSS.raffleInfoFooter_singleLine}>
                                    ????????? ???????????? ??????, ???????????? ????????????.
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
                                                NFT ????????????
                                            </button>
                                            :
                                            <button className={classnames(RaffleCSS.raffleInfoFooterButton, 'grayButton')} >
                                                NFT ????????????
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
                                ????????? ????????? ??????????????????.
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