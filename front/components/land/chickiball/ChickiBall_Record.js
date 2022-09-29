import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import copy from 'copy-to-clipboard';

// image
import openIcon_white from '../../../src/image/utils/open.png';
import copyImg from '../../../src/image/utils/copy_chickiz.png';
import questionIcon_white from "../../../src/image/utils/question_white.png";

// page components
import ChickiBallModal from '../../modal/ChickiBallModal';
import UtilModal from '../../modal/UtilModal';

// store
import { getChickiballWeek } from '../../../store/modules/land/chickiball';

// css
import classnames from 'classnames';
import LandCSS from '../../../styles/land.module.css';

function ChickiBall_Record({ setMobileDisplay }) {

    const dispatch = useDispatch();

    const { myId } = useSelector((state) => state.myInfo);
    const { totalGame, chickiballRecord, successRate, averageTry,
        boardState, boardResult, gameStatus, rowIndex, score, week } = useSelector((state) => state.chickiball);

    // Share
    const [shareResult, setShareResult] = useState('');

    useEffect(() => {
        dispatch(getChickiballWeek());
        if (gameStatus !== "inProgress") {
            makeShareResult()
        }
    }, [gameStatus, myId])


    // modal
    const [copyModalBool, setCopyModalBool] = useState(false);
    const [chickiballModalBool, setChickiballModalBool] = useState(false);
    const [chickiballModalTemplate, setChickiballModalTemplate] = useState('howToPlay');
    const [utilModalBool, setUtilModalBool] = useState(false);

    function copyModalOn() {
        if (copyModalBool) return;
        setCopyModalBool(true)
        setTimeout(() => setCopyModalBool(false), 1000)
    }

    function makeShareResult() {
        if (gameStatus === "inProgress") return
        const today = new Date();
        const dayList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const day = today.getDay();
        let _shareResult = `치키볼 ${week}주차 ${dayList[day]}${'\n'}`

        function changeToMoji(num) {
            switch (Number(num)) {
                case 0:
                    return '0️⃣';
                case 1:
                    return '1️⃣';
                case 2:
                    return '2️⃣';
                case 3:
                    return '3️⃣';
                case 4:
                    return '4️⃣';
                case 5:
                    return '5️⃣';
                case 6:
                    return '6️⃣';
                case 7:
                    return '7️⃣';
                case 8:
                    return '8️⃣';
                case 9:
                    return '9️⃣';
                default:
                    return '';
            }
        }

        for (let i = 0; i < rowIndex; i++) {
            let word = "\n";
            for (let j = 0; j < 4; j++) {
                word += changeToMoji(boardState[i][j])
            }

            word += ' | '

            if (boardResult[i].ball + boardResult[i].strike === 0) {
                word += '🔴'
            } else if (boardResult[i].strike === 4) {
                word += '🎉'
            } else {
                for (let j = 0; j < boardResult[i].ball; j++) {
                    word += '🟢'
                }
                for (let j = 0; j < boardResult[i].strike; j++) {
                    word += '🟡'
                }
            }

            _shareResult += word;
        }

        setShareResult(_shareResult);
    }

    return (
        <>
            <div className={LandCSS.nbRecordMain}>
                <div className={LandCSS.nbRecordMainEach}>
                    <span className={LandCSS.nbReocordMainEach_big}>
                        {totalGame}
                    </span>
                    <span className={LandCSS.nbReocordMainEach_small}>
                        총 게임
                    </span>
                </div>
                <div className={LandCSS.nbRecordMainEach}>
                    <span className={LandCSS.nbReocordMainEach_big}>
                        {successRate}
                    </span>
                    <span className={LandCSS.nbReocordMainEach_small}>
                        성공%
                    </span>
                </div>
                <div className={LandCSS.nbRecordMainEach}>
                    <span className={LandCSS.nbReocordMainEach_big}>
                        {averageTry}
                    </span>
                    <span className={LandCSS.nbReocordMainEach_small}>
                        평균 회
                    </span>
                </div>
                <div className={LandCSS.nbRecordMainEach}>
                    <span className={LandCSS.nbReocordMainEach_big}>
                        {score}
                    </span>
                    <span className={LandCSS.nbReocordMainEach_small}>
                        점수
                        <div id="balloon_light" balloon="점수 산정표 보기" className={classnames(LandCSS.nbRankingIconBox, "neonShine")} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_white} alt="" /></div>
                    </span>
                </div>
            </div>
            <div className={LandCSS.nbRecordGraph}>
                {
                    chickiballRecord.map((a, i) => {
                        if (i < 7) {
                            return (
                                <div key={i} className={LandCSS.nbRecordGraphEachBox}>
                                    <div className={LandCSS.nbRecordGraphBarBox}>
                                        <span className={a === Math.max.apply(null, chickiballRecord.slice(0, 7)) && a !== 0 ? LandCSS.nbRecordGraphBar_selected : LandCSS.nbRecordGraphBar} style={{ height: `${100 * a / Math.max.apply(null, chickiballRecord.slice(0, 7))}%` }}>
                                            {a}
                                        </span>
                                    </div>
                                    <span className={LandCSS.nbRecordGraphIndex}>
                                        {i + 1}
                                    </span>
                                </div>
                            )
                        }
                    })
                }
            </div>
            {
                gameStatus !== "inProgress"
                    ?
                    <button onClick={() => { copyModalOn(); copy(shareResult, { format: 'text/plain' }); }} className={classnames(LandCSS.nbShareBox, "greenButton")}>
                        결과 공유하기
                    </button>
                    :
                    <button className={LandCSS.nbShareBox_dead} onClick={() => setMobileDisplay(2)}>
                        치키볼에 참여해주세요.
                    </button>
            }
            <div className={LandCSS.nbFAQBox}>
                <div className={LandCSS.nbFAQEach} onClick={() => { setChickiballModalBool(true); setChickiballModalTemplate('howToPlay') }}>
                    <span className={LandCSS.nbFAQEachWord}>
                        Q. '치키볼'은 어떻게 플레이하나요?
                    </span>
                    <div className={LandCSS.nbFAQIconBox}>
                        <Image className='image100' src={openIcon_white} alt="" />
                    </div>
                </div>
                <div className={LandCSS.nbFAQEach} onClick={() => { setChickiballModalBool(true); setChickiballModalTemplate('howToRecord') }}>
                    <span className={LandCSS.nbFAQEachWord}>
                        Q. 기록을 남기려면 어떻게 해야하나요?
                    </span>
                    <div className={LandCSS.nbFAQIconBox}>
                        <Image className='image100' src={openIcon_white} alt="" />
                    </div>
                </div>
                <div className={LandCSS.nbFAQEach} onClick={() => { setChickiballModalBool(true); setChickiballModalTemplate('findBug') }}>
                    <span className={LandCSS.nbFAQEachWord}>
                        Q. 버그를 발견했어요. 어떻게 할까요?
                    </span>
                    <div className={LandCSS.nbFAQIconBox}>
                        <Image className='image100' src={openIcon_white} alt="" />
                    </div>
                </div>
            </div>
            <div className={LandCSS.nbFooter}>
                inspired by Wordle
            </div>
            {
                copyModalBool &&
                <div className={LandCSS.nbWorngModal}>
                    <Image className="image100" src={copyImg} alt="" />
                </div>
            }
            {
                chickiballModalBool
                    ?
                    <ChickiBallModal setModalBool={setChickiballModalBool} modalTemplate={chickiballModalTemplate} />
                    :
                    null
            }
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

export default ChickiBall_Record;