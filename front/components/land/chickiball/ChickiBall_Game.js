import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';

// image
import chickizIcon from '../../../src/image/logo/chickizLogo.png'
import backspaceIcon from '../../../src/image/utils/backspace.png'
import enterIcon from '../../../src/image/utils/enter.png'
import wrongImg from '../../../src/image/chickiball/nbWrong.png'

// store
import {
    getChickiBallBoard_Local,
    checkAnswer_Local,
    getChickiBallRecord_Local,
    getChickiBallBoard_Server,
    checkAnswer_Server,
    getChickiBallRecord_Server,
    refreshRank,
    getMyRank,
} from '../../../store/modules/land/chickiball';

// css
import classnames from 'classnames';
import LandCSS from '../../../styles/land.module.css';

function ChickiBall_Game({ setMobileDisplay, congratModalOn, failModalOn }) {

    const dispatch = useDispatch()
    const { isUser, myId } = useSelector((state) => state.myInfo);
    const { boardState, boardResult, gameStatus, rowIndex } = useSelector((state) => state.chickiball);

    const ref = useRef();

    useEffect(() => {
        if (isUser) {
            dispatch(getChickiBallBoard_Server(myId));
            dispatch(getChickiBallRecord_Server(myId));
        } else {
            dispatch(getChickiBallBoard_Local());
            dispatch(getChickiBallRecord_Local());
        }
    }, [isUser, myId])

    const [value, setValue] = useState("");
    const [focusNum, setFocusNum] = useState(0);
    const [clickKey, setClickKey] = useState(10);

    // modal
    const [wrongModalBool, setWrongModalBool] = useState(false);


    useEffect(() => {
        ref.current.focus()
    }, [focusNum])

    useEffect(() => {
        if (clickKey === 10) return

        setTimeout(() => setClickKey(10), 200)
    }, [clickKey])

    function wrongModalOn() {
        if (wrongModalBool) return;
        setWrongModalBool(true);
        setTimeout(() => setWrongModalBool(false), 1000);
    }


    function controlKeyDown(keydown) {
        if (rowIndex === 7 || gameStatus !== "inProgress") return;
        let _value = value;
        setClickKey(keydown);
        if (keydown === " ") {
            return;
        } else if (0 <= Number(keydown) && Number(keydown) < 10) {
            if (_value.length === 4) return;
            _value += keydown.toString();
            setValue(_value)
        } else if (keydown === "Backspace") {
            const __value = _value.substring(0, _value.length - 1);
            setValue(__value);
        } else if (keydown === "Enter") {
            if (_value.length === 4) {
                checkAnswer();
                return;
            }
        } else {
            return;
        }
    }

    async function checkAnswer() {
        let _value = [...new Set(value)];
        const set = _value.join("");
        if (set.length !== 4) {
            wrongModalOn();
            return
        }
        setValue("");
        if (isUser) {
            const result = await dispatch(checkAnswer_Server({ value: set, userId: myId })).unwrap();
            console.log(result)
            if (result.gameStatus === "WIN") {
                dispatch(getChickiBallRecord_Server(myId));
                dispatch(getMyRank(myId));
                dispatch(refreshRank());
                congratModalOn();
                setMobileDisplay(3);
            } else if (result.gameStatus === "LOSE") {
                dispatch(getChickiBallRecord_Server(myId));
                dispatch(getMyRank(myId));
                dispatch(refreshRank());
                failModalOn();
                setMobileDisplay(3);
            }
        } else {
            dispatch(checkAnswer_Local({ value: set }));
            dispatch(getChickiBallBoard_Local());
            dispatch(getChickiBallRecord_Local());
            const gs = JSON.parse(localStorage.getItem('chickiball_board')).gameStatus;
            if (gs === 'WIN') {
                congratModalOn();
                setMobileDisplay(3);
            } else if (gs === 'LOSE') {
                failModalOn();
                setMobileDisplay(3);
            }
        }
    }



    return (
        <>
            <div className={LandCSS.nbBody} onClick={() => setFocusNum(focusNum + 1)}>
                <div className={LandCSS.nbNum}>
                    {
                        boardState.map((a, index) => {
                            if (index === rowIndex) {
                                return (
                                    <div key={index} className={LandCSS.nbRow} id={wrongModalBool ? "shake" : null}>
                                        <span className={value[0] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {value[0] === undefined ? null : value[0]}
                                        </span>
                                        <span className={value[1] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {value[1] === undefined ? null : value[1]}
                                        </span>
                                        <span className={value[2] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {value[2] === undefined ? null : value[2]}
                                        </span>
                                        <span className={value[3] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {value[3] === undefined ? null : value[3]}
                                        </span>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index} className={LandCSS.nbRow}>
                                        <span className={a[0] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {a[0] === undefined ? null : a[0]}
                                        </span>
                                        <span className={a[1] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {a[1] === undefined ? null : a[1]}
                                        </span>
                                        <span className={a[2] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {a[2] === undefined ? null : a[2]}
                                        </span>
                                        <span className={a[3] === undefined ? LandCSS.nbEach : LandCSS.nbEach_written}>
                                            {a[3] === undefined ? null : a[3]}
                                        </span>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className={LandCSS.nbResult}>
                    {
                        boardResult.map((a, index) => {
                            return (
                                <div key={index} className={LandCSS.nbResultEach}>
                                    {
                                        a.ball === undefined && a.strike === undefined
                                            ?
                                            <div className={LandCSS.nbResultIcon}>
                                                <Image src={chickizIcon} alt="" />
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        a.ball === 0 || a.ball === undefined
                                            ?
                                            null
                                            :
                                            <b className={LandCSS.nbGreen} id="popIn">{a.ball}B</b>
                                    }
                                    {
                                        a.strike === 0 || a.strike === undefined || a.strike === 4
                                            ?
                                            null
                                            :
                                            <b className={LandCSS.nbYellow} id="popIn">&nbsp;{a.strike}S</b>
                                    }
                                    {
                                        a.ball === 0 && a.strike === 0
                                            ?
                                            <b className={LandCSS.nbRed} id="popIn">OUT</b>
                                            :
                                            null
                                    }
                                    {
                                        a.strike === 4
                                            ?
                                            <b id="popIn">🎉</b>
                                            :
                                            null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={LandCSS.nbKeyBoard}>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(0)} id={Number(clickKey) === 0 ? "nbKeyOn" : null}>
                    0
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(1)} id={Number(clickKey) === 1 ? "nbKeyOn" : null}>
                    1
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(2)} id={Number(clickKey) === 2 ? "nbKeyOn" : null}>
                    2
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(3)} id={Number(clickKey) === 3 ? "nbKeyOn" : null}>
                    3
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(4)} id={Number(clickKey) === 4 ? "nbKeyOn" : null}>
                    4
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown("Backspace")} id={clickKey === "Backspace" ? "nbKeyOn" : null}>
                    <div className={LandCSS.nbKeyBoardIcon}>
                        <Image className="image100" src={backspaceIcon} alt="" />
                    </div>
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(5)} id={Number(clickKey) === 5 ? "nbKeyOn" : null}>
                    5
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(6)} id={Number(clickKey) === 6 ? "nbKeyOn" : null}>
                    6
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(7)} id={Number(clickKey) === 7 ? "nbKeyOn" : null}>
                    7
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(8)} id={Number(clickKey) === 8 ? "nbKeyOn" : null}>
                    8
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown(9)} id={Number(clickKey) === 9 ? "nbKeyOn" : null}>
                    9
                </span>
                <span className={LandCSS.nbKeyBoardEach} onClick={() => controlKeyDown("Enter")} id={clickKey === "Enter" ? "nbKeyOn" : null}>
                    <div className={LandCSS.nbKeyBoardIcon}>
                        <Image className="image100" src={enterIcon} alt="" />
                    </div>
                </span>
            </div>
            <input className={LandCSS.nbNo} ref={ref} maxLength={1} onKeyUp={(e) => controlKeyDown(e.key)} />
            {
                wrongModalBool &&
                <div className={LandCSS.nbWorngModal}>
                    <Image priority={true} className="image100" src={wrongImg} alt="" />
                </div>
            }
        </>
    )
}

export default ChickiBall_Game;