import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

// store
import { getChickiballTotalRank, getChickiballWeekRank, getMyRank, getHallOfFame } from '../../../store/modules/land/chickiball'

// image
import randomChickiz from '../../../src/image/utils/randomchickiz.png';
import crownIcon from '../../../src/image/utils/crown_yellow.png';
import questionIcon_yellow from "../../../src/image/utils/question_yellow.png";

// page component
import UtilModal from '../../modal/UtilModal';

// css
import classnames from 'classnames';
import LandCSS from '../../../styles/land.module.css';

function ChickiBall_Ranking() {

    const dispatch = useDispatch();
    const router = useRouter();
    const { isUser, myId, myRepChickiz, myName } = useSelector((state) => state.myInfo);
    const { start_total, totalRank, start_week, weekRank, totalRankNum,
        myWeekRank, myWeekScore, myTotalRank, myTotalScore,
        hallOfFame, start_hallOfFame, totalHallOfFameNum } = useSelector((state) => state.chickiball)
    const [tabNum, setTabNum] = useState(0);

    const [scrollRef1, inView1, entry1] = useInView();
    const [scrollRef2, inView2, entry2] = useInView();
    const [scrollRef3, inView3, entry3] = useInView();

    const [utilModalBool, setUtilModalBool] = useState(false);

    useEffect(() => {
        if (isUser) {
            dispatch(getMyRank(myId));
        }
    }, [myId])

    useEffect(() => {
        if (inView1 || start_week === 0) {
            dispatch(getChickiballWeekRank())
        }
    }, [inView1])

    useEffect(() => {
        if (inView2 || start_total === 0) {
            dispatch(getChickiballTotalRank())
        }
    }, [inView2])

    useEffect(() => {
        if (inView3 || start_hallOfFame === 0) {
            dispatch(getHallOfFame())
        }
    }, [inView3])

    return (
        <>
            <div className="pageHeaderBox" id="mobile_off">
                <div className="pageTitleBox">
                    <Link href="/">
                        <span className="pageTitle">
                            HOME
                        </span>
                    </Link>
                    <span className="pageTitleArrow">
                        &gt;
                    </span>
                    <Link href="/land">
                        <span className="pageTitle">
                            치키랜드
                        </span>
                    </Link>
                    <span className="pageTitleArrow">
                        &gt;
                    </span>
                    <span className="pageTitle">
                        치키볼
                    </span>
                </div>
            </div>
            <div className={classnames("pageContentBox", LandCSS.mobileChickiballRank)}>
                <div className={LandCSS.eachFarmFarmerSubTab}>
                    <span className={tabNum === 0 ? LandCSS.eachFarmFarmerSubTitleSelected : LandCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(0)}>
                        주간 순위
                    </span>
                    <span className={tabNum === 1 ? LandCSS.eachFarmFarmerSubTitleSelected : LandCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(1)}>
                        전체 순위
                    </span>
                    <span className={tabNum === 2 ? LandCSS.eachFarmFarmerSubTitleSelected : LandCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(2)}>
                        명예의 전당
                    </span>
                </div>
                {
                    {
                        0:
                            <>
                                <div className={LandCSS.nbRankingTitle}>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        순위
                                    </span>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        닉네임
                                    </span>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        점수
                                        <div id="balloon_light" balloon="점수 산정표 보기" className={classnames(LandCSS.nbRankingIconBox, "neonShine")} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_yellow} alt="" /></div>
                                    </span>
                                </div>
                                {
                                    isUser
                                        ?
                                        <div className={LandCSS.nbRankingMyBox}>
                                            <span className={LandCSS.nbRankingRank}>
                                                {myWeekRank}
                                            </span>
                                            <div className={LandCSS.nbRankingEachRep}>
                                                <Image width={256} height={256} className="image100" src={myRepChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${myRepChickiz}.png`} alt="" />
                                            </div>
                                            <span className={LandCSS.nbRankingEachName}>
                                                {myName}
                                            </span>
                                            <span className={LandCSS.nbRankingEachScore}>
                                                {myWeekScore}
                                            </span>
                                        </div>
                                        :
                                        <div className={LandCSS.nbRankingMyBox}>
                                            <span className={LandCSS.nbRankingNoLoginBox} onClick={() => router.push('/signUp')}>
                                                내 랭킹을 보려면 농장가입을 해주세요.
                                            </span>
                                        </div>
                                }
                                < div className={LandCSS.nbRankingBox}>
                                    {
                                        weekRank.map((a, index) => {
                                            return (
                                                <div key={index} className={LandCSS.nbRankingEachBox}
                                                    ref={(weekRank.length - 1 === index && weekRank.length < totalRankNum)
                                                        ? scrollRef1 : null}
                                                    onClick={() => router.push(`/farm/${a.address}`)}>
                                                    <span className={LandCSS.nbRankingRank}>
                                                        {a.rank}
                                                    </span>
                                                    <div className={LandCSS.nbRankingEachRep}>
                                                        <Image width={256} height={256} className="image100" src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} alt="" />
                                                    </div>
                                                    <span className={LandCSS.nbRankingEachName}>
                                                        {a.name}
                                                    </span>
                                                    <span className={LandCSS.nbRankingEachScore}>
                                                        {a.score}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>,
                        1:
                            <>
                                <div className={LandCSS.nbRankingTitle}>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        순위
                                    </span>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        닉네임
                                    </span>
                                    <span className={LandCSS.nbRankingTitle_each}>
                                        점수
                                        <div id="balloon_light" balloon="점수 산정표 보기" className={classnames(LandCSS.nbRankingIconBox, "neonShine")} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_yellow} alt="" /></div>
                                    </span>
                                </div>
                                {
                                    isUser
                                        ?
                                        <div className={LandCSS.nbRankingMyBox}>
                                            <span className={LandCSS.nbRankingRank}>
                                                {myTotalRank}
                                            </span>
                                            <div className={LandCSS.nbRankingEachRep}>
                                                <Image width={256} height={256} className="image100" src={myRepChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${myRepChickiz}.png`} alt="" />
                                            </div>
                                            <span className={LandCSS.nbRankingEachName}>
                                                {myName}
                                            </span>
                                            <span className={LandCSS.nbRankingEachScore}>
                                                {myTotalScore}
                                            </span>
                                        </div>
                                        :
                                        <div className={LandCSS.nbRankingMyBox}>
                                            <span className={LandCSS.nbRankingNoLoginBox} onClick={() => router.push('/signUp')}>
                                                내 랭킹을 보려면 농장가입을 해주세요.
                                            </span>
                                        </div>
                                }
                                <div className={LandCSS.nbRankingBox}>
                                    {
                                        totalRank.map((a, index) => {
                                            return (
                                                <div key={index} className={LandCSS.nbRankingEachBox}
                                                    ref={(totalRank.length - 1 === index && totalRank.length < totalRankNum)
                                                        ? scrollRef2 : null}
                                                    onClick={() => router.push(`/farm/${a.address}`)}>
                                                    <span className={LandCSS.nbRankingRank}>
                                                        {a.rank}
                                                    </span>
                                                    <div className={LandCSS.nbRankingEachRep}>
                                                        <Image width={256} height={256} className="image100" src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} alt="" />
                                                    </div>
                                                    <span className={LandCSS.nbRankingEachName}>
                                                        {a.name}
                                                    </span>
                                                    <span className={LandCSS.nbRankingEachScore}>
                                                        {a.score}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>,
                        2:
                            <>
                                <div className={LandCSS.nbRankingTitle}>
                                    <div className={LandCSS.nbRankingTitle_hallOfFame1}>
                                        <div className={LandCSS.nbRankingTitle_hallOfFameImage}>
                                            <Image src={crownIcon} alt="우승" />
                                        </div>
                                        <span>
                                            역대 주간 랭킹 1위
                                        </span>
                                    </div>
                                    <span className={LandCSS.nbRankingTitle_hallOfFame2}>
                                        점수
                                        <div id="balloon_light" balloon="점수 산정표 보기" className={classnames(LandCSS.nbRankingIconBox, "neonShine")} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_yellow} alt="" /></div>
                                    </span>
                                </div>
                                < div className={LandCSS.nbRankingBox_hallOfFame}>
                                    {
                                        hallOfFame.map((a, index) => {
                                            return (
                                                <div key={index} className={LandCSS.nbRankingEachBox}
                                                    ref={(hallOfFame.length - 1 === index && hallOfFame.length < totalHallOfFameNum)
                                                        ? scrollRef3 : null}
                                                    onClick={() => router.push(`/farm/${a.address}`)}>
                                                    <span className={LandCSS.nbRankingWeek}>
                                                        {a.week}주차
                                                    </span>
                                                    <div className={LandCSS.nbRankingEachRep}>
                                                        <Image width={256} height={256} className="image100" src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} alt="" />
                                                    </div>
                                                    <span className={LandCSS.nbRankingEachName}>
                                                        {a.name}
                                                    </span>
                                                    <span className={LandCSS.nbRankingEachScore}>
                                                        {a.score}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                    }[tabNum]
                }
            </div >
            {
                utilModalBool
                    ?
                    <UtilModal setModalBool={setUtilModalBool} modalTemplate="chickiballScore" />
                    :
                    null
            }
        </>
    )
}

export default ChickiBall_Ranking;