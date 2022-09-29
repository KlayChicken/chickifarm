import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from 'react-intersection-observer';

import convert from '../../chain/utils/convert';

// page components
import Loading from '../../util/Loading';

// css
import classnames from "classnames";
import RaffleCSS from "../../../styles/raffle.module.css";

// image
import klaytnlogo from '../../../src/image/logo/klaytnLogo.png';
import chickLogo from '../../../src/image/chick/chick.png';
import winnerIcon from '../../../src/image/utils/ranking_white.png';
import itemNotFound from '../../../src/image/utils/itemNotFound.png';

function RaffleListShow({ raffleList, getDone, loading, loading_more, setSelectedRaffleId, getListFirst, getListMore, reset = 0 }) {

    const dispatch = useDispatch();
    const { account, myId } = useSelector((state) => state.myInfo);

    const [now, setNow] = useState('');
    const [scrollRef, inView, entry] = useInView();

    useEffect(() => {
        const _now = new Date();
        const _utcNow = _now.getTime() + (_now.getTimezoneOffset() * 60 * 1000)
        const _koreaTimeDiff = 9 * 60 * 60 * 1000;
        setNow(_utcNow + _koreaTimeDiff);

        const interval = setInterval(() => {
            const now = new Date();
            const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
            const koreaTimeDiff = 9 * 60 * 60 * 1000;
            setNow(utcNow + koreaTimeDiff);
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if ((raffleList.length < 1 && !getDone) || reset === 1) {
            getListFirst();
        }
    }, [getListFirst])

    useEffect(() => {
        if (inView && !getDone) {
            getListMore();
        }
    }, [inView])

    return (
        <>
            {
                loading
                    ?
                    <div className="noNFTBox">
                        <div className={RaffleCSS.raffleWholeLoading}>
                            <div className={RaffleCSS.raffleWholeLoadingBox}>
                                <Loading />
                            </div>
                            <span className={RaffleCSS.raffleWholeLoadingSpan}>
                                loading...
                            </span>
                        </div>
                    </div>
                    :
                    raffleList?.length < 1
                        ?
                        <div className="noNFTBox">
                            <div className="noNFT">
                                <Image className="image100" src={itemNotFound} alt="" />
                                <div className="noNFTDescBox">
                                    <span className="noNFTDesc">
                                        검색 결과가 없습니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            <div className={RaffleCSS.raffleBigBox}>
                                {
                                    raffleList?.map((a, index) => {

                                        let time;
                                        let timeMil;
                                        let diff;
                                        let hour;
                                        let min;
                                        let sec;

                                        if (a.raffleStatus === 0) {
                                            time = new Date(a.endTime)
                                            timeMil = time.getTime();
                                            diff = timeMil - now;

                                            hour = Math.floor(diff / (1000 * 60 * 60));
                                            min = Math.floor(diff / (1000 * 60) % 60);
                                            sec = Math.floor(diff / (1000) % 60);
                                        }

                                        return (
                                            <div className={RaffleCSS.raffleEachBox} key={index}
                                                onClick={() => setSelectedRaffleId(a.id)}
                                                ref={(raffleList.length - 1 === index && !getDone)
                                                    ? scrollRef
                                                    : null}>
                                                <div className={
                                                    a.collection === "SuperWalk Collection"
                                                        ? RaffleCSS.raffleImg_width
                                                        :
                                                        a.collection === "Klay 3 Kingdoms"
                                                            ? RaffleCSS.raffleImg_height
                                                            : RaffleCSS.raffleImg}
                                                >
                                                    {
                                                        a.nftMeta?.image.endsWith('mp4') || a.nftMeta?.image.endsWith('genesis')
                                                            ? <video className="image100" autoPlay muted loop><source src={a.nftMeta?.image} type='video/mp4' /></video>
                                                            : <img className={RaffleCSS.raffleImgEach} src={a.nftMeta?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")} />
                                                    }
                                                </div>
                                                <div className={RaffleCSS.raffleDescBox}>
                                                    <span className={RaffleCSS.raffleCollection}>
                                                        {a.collection}
                                                    </span>
                                                    <span className={RaffleCSS.raffleName}>
                                                        {a.nftMeta?.name}
                                                    </span>
                                                    <div className={RaffleCSS.rafflePriceTimeBox}>
                                                        <span className={RaffleCSS.rafflePrice}>
                                                            <div className={RaffleCSS.rafflePriceImg}>
                                                                <Image src={a.paymentMethod === 0 ? klaytnlogo : chickLogo}
                                                                    alt={a.paymentMethod === 0 ? 'KLAY' : 'CHICK'} />
                                                            </div>
                                                            {convert.from_mKLAY_to_KLAY(a.ticketPrice)}
                                                        </span>
                                                        <span className={RaffleCSS.raffleRemainNum}>
                                                            {a.ticketQuan - a.ticketSell} / {a.ticketQuan}
                                                        </span>
                                                    </div >
                                                    <div className={
                                                        {
                                                            0:
                                                                hour <= 0 && min <= 0 && sec <= 0
                                                                    ? RaffleCSS.raffleTimeRaffling
                                                                    : hour <= 0 && min <= 29
                                                                        ? RaffleCSS.raffleAlmostEnd
                                                                        : RaffleCSS.raffleRemainTime
                                                            ,
                                                            1: RaffleCSS.raffleTimeOut
                                                            ,
                                                            2: RaffleCSS.raffleTimeRaffling
                                                            ,
                                                            3: RaffleCSS.raffleTimeOut
                                                        }[a.raffleStatus]
                                                    }>
                                                        {
                                                            {
                                                                0:
                                                                    now === ""
                                                                        ?
                                                                        <div className={RaffleCSS.raffleTimeLoading}>
                                                                            <Loading />
                                                                        </div>
                                                                        :
                                                                        hour <= 0 && min <= 0 && sec <= 0
                                                                            ?
                                                                            <>
                                                                                <div className={RaffleCSS.raffleTimeLoading}>
                                                                                    <Loading />
                                                                                </div>
                                                                                <span className={RaffleCSS.raffleTimeLoadingSpan}>추첨 진행중...</span>
                                                                            </>
                                                                            : hour + "시간 " + min + "분 " + sec + "초 남음"
                                                                ,
                                                                1:
                                                                    <>
                                                                        <div className={RaffleCSS.raffleTimeBoxImage}>
                                                                            < Image src={winnerIcon} alt='winner' />
                                                                        </div>
                                                                        {
                                                                            a.winnerName
                                                                                ?
                                                                                a.winnerName
                                                                                :
                                                                                '-'
                                                                        }
                                                                    </>
                                                                ,
                                                                2:
                                                                    <>
                                                                        <div className={RaffleCSS.raffleTimeLoading}>
                                                                            <Loading />
                                                                        </div>
                                                                        <span className={RaffleCSS.raffleTimeLoadingSpan}>추첨 진행중...</span>
                                                                    </>
                                                                ,
                                                                3:
                                                                    <>
                                                                        <div className={RaffleCSS.raffleTimeBoxImage}>
                                                                            < Image src={winnerIcon} alt='winner' />
                                                                        </div>
                                                                        {
                                                                            a.winnerName
                                                                                ?
                                                                                a.winnerName
                                                                                :
                                                                                '-'
                                                                        }
                                                                    </>
                                                            }[a.raffleStatus]
                                                        }
                                                    </div>
                                                </div>
                                                <div className={RaffleCSS.raffleIdBox}>
                                                    <span className={RaffleCSS.raffleId}>no. {a.id}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                loading_more
                                    ?
                                    <div className={RaffleCSS.raffleWholeLoading}>
                                        <div className={RaffleCSS.raffleWholeLoadingBox}>
                                            <Loading />
                                        </div>
                                        <span className={RaffleCSS.raffleWholeLoadingSpan}>
                                            loading...
                                        </span>
                                    </div>
                                    :
                                    null
                            }
                        </>
            }
        </>
    )
}

export default RaffleListShow;