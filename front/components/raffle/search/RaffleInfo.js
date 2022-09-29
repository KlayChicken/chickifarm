import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import convert from '../../chain/utils/convert';

// css
import classnames from 'classnames'
import RaffleCSS from "../../../styles/raffle.module.css";

// page components
import Loading from '../../util/Loading';
import RaffleInfoFooter from './RaffleInfoFooter';

// data
import farmerRankList from '../../../src/data/farm/FarmerRankList';

// store
import { buyTicket, getRaffleList, getBuyerList } from "../../../store/modules/raffle/raffle";

// images
import questionIcon_black from '../../../src/image/utils/question_black.png';
import klaytnLogo from '../../../src/image/logo/klaytnLogo.png';
import chickLogo from '../../../src/image/chick/chick.png';

function RaffleInfo({ refresh }) {

    const { raffleDetail,
        buyQuan,
        loading_raffleDetail_chain,
        raffleDetail_soldTickets } = useSelector((state) => state.raffle);


    // time
    const [now, setNow] = useState('');
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');
    const [sec, setSec] = useState('');

    useEffect(() => {
        const __now = new Date();
        const _utcNow = __now.getTime() + (__now.getTimezoneOffset() * 60 * 1000)
        const _koreaTimeDiff = 9 * 60 * 60 * 1000;
        setNow(_utcNow + _koreaTimeDiff);

        const interval = setInterval(() => {
            const _now = new Date();
            const utcNow = _now.getTime() + (_now.getTimezoneOffset() * 60 * 1000)
            const koreaTimeDiff = 9 * 60 * 60 * 1000;

            setNow(utcNow + koreaTimeDiff);
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (now === '') return
        if (!raffleDetail.endTime) return
        if (raffleDetail.raffleStatus !== 0) return
        const time = new Date(raffleDetail.endTime);
        const timeMil = time.getTime()

        const diff = timeMil - now;
        if (
            hour === 0 &&
            min === 0 &&
            sec === 0
        ) {
            refresh(raffleDetail.id);
        }

        setHour(Math.floor(diff / (1000 * 60 * 60)));
        setMin(Math.floor(diff / (1000 * 60) % 60));
        setSec(Math.floor(diff / (1000) % 60));

    }, [now])

    function getUserRankNum(chickizQuan) {
        for (let i = 0; i < farmerRankList.length; i++) {
            if (farmerRankList[i].min <= chickizQuan && chickizQuan <= farmerRankList[i].max) {
                return i
            }
        }
    }

    return (
        <>
            <div className={RaffleCSS.raffleInfoBox}>
                {
                    <>
                        {
                            {
                                0:
                                    now === '' || hour === ''
                                        ?
                                        <div className={RaffleCSS.raffleInfoLeftTime}>
                                            <span className={RaffleCSS.raffleLeftInfo}>
                                                <div className={RaffleCSS.raffleInfoBulbLoading}>
                                                </div>
                                                LOADING
                                            </span>
                                            <span className={RaffleCSS.raffleInfoInfo_loading}>
                                                <Loading color='light' />
                                            </span>
                                        </div>
                                        :
                                        hour <= 0 && min <= 0 && sec <= 0
                                            ?
                                            <div className={RaffleCSS.raffleInfoLeftTime}>
                                                <span className={RaffleCSS.raffleLeftInfo}>
                                                    <div className={RaffleCSS.raffleInfoBulbLoading}>
                                                    </div>
                                                    추첨중
                                                </span>
                                                <span className={RaffleCSS.raffleInfoInfo_loading}>
                                                    <Loading color='light' />
                                                </span>
                                            </div>
                                            :
                                            <div className={RaffleCSS.raffleInfoLeftTime}>
                                                <span className={RaffleCSS.raffleLeftInfo}>
                                                    <div className={RaffleCSS.raffleInfoBulbOn}>
                                                    </div>
                                                    LIVE
                                                </span>
                                                <span className={RaffleCSS.raffleLeftTime}>
                                                    {
                                                        hour + "시간 " + min + "분 " + sec + "초 남음"
                                                    }
                                                </span>
                                            </div>
                                ,
                                1:
                                    <div className={RaffleCSS.raffleInfoLeftTime}>
                                        <span className={RaffleCSS.raffleLeftInfo}>
                                            <div className={RaffleCSS.raffleInfoBulbOff}>
                                            </div>
                                            END
                                        </span>
                                        <span className={RaffleCSS.raffleLeftTime}>
                                            종료
                                        </span>
                                    </div>
                                ,
                                2:
                                    <div className={RaffleCSS.raffleInfoLeftTime}>
                                        <span className={RaffleCSS.raffleLeftInfo}>
                                            <div className={RaffleCSS.raffleInfoBulbLoading}>
                                            </div>
                                            추첨중
                                        </span>
                                        <span className={RaffleCSS.raffleInfoInfo_loading}>
                                            <Loading color='light' />
                                        </span>
                                    </div>
                                ,
                                3:
                                    <div className={RaffleCSS.raffleInfoLeftTime}>
                                        <span className={RaffleCSS.raffleLeftInfo}>
                                            <div className={RaffleCSS.raffleInfoBulbOff}>
                                            </div>
                                            END
                                        </span>
                                        <span className={RaffleCSS.raffleLeftTime}>
                                            종료
                                        </span>
                                    </div>
                            }[raffleDetail.raffleStatus]
                        }
                        <div className={RaffleCSS.raffleInfo}>
                            <span className={RaffleCSS.raffleInfoTitle}>
                                가격
                            </span>
                            <span className={RaffleCSS.raffleInfoInfo}>
                                <div className={RaffleCSS.raffleInfoPayment}>
                                    <Image className='image100' src={raffleDetail.paymentMethod === 0 ? klaytnLogo : chickLogo}
                                        alt={raffleDetail.paymentMethod === 0 ? 'klay' : 'CHICK'} />
                                </div>
                                {raffleDetail.ticketPrice ? convert.from_mKLAY_to_KLAY(raffleDetail.ticketPrice) : '-'}
                            </span>
                        </div>
                        <div className={RaffleCSS.raffleInfo}>
                            <span className={RaffleCSS.raffleInfoTitle}>
                                총 티켓 수
                            </span>
                            <span className={RaffleCSS.raffleInfoInfo}>
                                {raffleDetail.ticketQuan} 개
                            </span>
                        </div>
                        <div className={RaffleCSS.raffleInfo}>
                            <span className={RaffleCSS.raffleInfoTitle}>
                                잔여 티켓 수
                            </span>
                            {
                                loading_raffleDetail_chain
                                    ?
                                    <span className={RaffleCSS.raffleInfoInfo_loading}>
                                        <Loading color='light' />
                                    </span>
                                    :
                                    <span className={RaffleCSS.raffleInfoInfo}>
                                        {raffleDetail.ticketQuan - raffleDetail_soldTickets} 개
                                    </span>
                            }
                        </div>
                        <div className={RaffleCSS.raffleInfo}>
                            <span className={RaffleCSS.raffleInfoTitle}>
                                총 구매자 수
                            </span>
                            <span className={RaffleCSS.raffleInfoInfo}>
                                {buyQuan} 명
                            </span>
                        </div>
                        <div className={RaffleCSS.raffleInfo}>
                            <span className={RaffleCSS.raffleInfoTitle}>
                                래플 생성자
                            </span>
                            <span id='balloon_light' balloon='농장 방문하기' className={RaffleCSS.raffleInfoInfo} onClick={() => window.open(`https://chickifarm.com/farm/${raffleDetail.raffler}`)}>
                                <b id='hyperBlue'>{raffleDetail.rafflerName}</b>
                                <span className={classnames(RaffleCSS.raffleInfoRank, classnames(farmerRankList[getUserRankNum(raffleDetail.raffler_chickizQuan)]?.class))}>
                                    {farmerRankList[getUserRankNum(raffleDetail.raffler_chickizQuan)]?.name}
                                </span>
                            </span>
                        </div>
                    </>
                }
            </div >
            <hr className={RaffleCSS.raffleLine} />
            <RaffleInfoFooter refresh={refresh} />
        </>
    );
}

export default RaffleInfo;
