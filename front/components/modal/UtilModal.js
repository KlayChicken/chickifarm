import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import useInput from '../../hooks/useInput';
import classnames from 'classnames';


// components
import farmerRankList from '../../src/data/farm/FarmerRankList';

// images
import closeIcon from "../../src/image/utils/close_black.png";

// stores
import { createGuestBook } from '../../store/modules/guestBook/guestBook';
import { getTodayChicken, refreshTodayChicken } from '../../store/modules/etc'
import { setSmallModalBool } from '../../store/modules/modal'

// css
import modalCSS from '../../styles/modal.module.css';

function UtilModal(props) {

    const dispatch = useDispatch();

    const [modalTemplate, setModalTemplate] = useState(null);
    const [guestBookMainText, onChangeGuestBookMainText] = useInput("");
    const [rouletteBtnClick, setRouletteBtnClick] = useState(false);
    const { todayChickenList } = useSelector((state) => state.etc)

    useEffect(() => {
        setModalTemplate(props.modalTemplate)
    }, [props.modalTemplate])

    useEffect(() => {
        if (rouletteBtnClick === true) {
            dispatch(getTodayChicken());
        } else {
            dispatch(refreshTodayChicken());
        }
    }, [rouletteBtnClick])

    async function submitGuestBook() {
        const res = await dispatch(createGuestBook({ from: props.from, to: props.to, text: guestBookMainText })).unwrap()
        props.setModalBool(false);
        props.refresh();
        dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }))
    }

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => props.setModalBool(false)}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.utilModalContent}>
                    {
                        {
                            "guestBook":
                                <>
                                    <div className={modalCSS.guestBookBox}>
                                        <span className={modalCSS.modalContentTitle}>
                                            ???????????? ????????? ?????????
                                        </span>
                                        <span className={modalCSS.guestBookInputLength}>
                                            {guestBookMainText.length} / 150
                                        </span>
                                        <textarea className={modalCSS.guestBookInput} placeholder="150??? ?????? ??????" maxlength="150" onChange={onChangeGuestBookMainText} />
                                        <div className={modalCSS.guestBookButtonBox}>
                                            <button className={classnames(modalCSS.guestBookButton, modalCSS.greenButton)} onClick={() => submitGuestBook()}>??????</button>
                                        </div>
                                    </div>
                                </>,
                            "farmQuestion":
                                <>
                                    <div className={modalCSS.farmQuestion}>
                                        <span className={modalCSS.modalContentTitle}>
                                            ????????? ???????????? ?????? ???????????????.
                                        </span>
                                        <table className={modalCSS.farmTable}>
                                            <thead className={modalCSS.farmTableThead}>
                                                <tr>
                                                    <th className={modalCSS.farmTableTh}>??????</th>
                                                    <th className={modalCSS.farmTableTh}>????????? ??????</th>
                                                </tr>
                                            </thead>
                                            <tbody className={modalCSS.farmTableTbody}>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[0].class)}>{farmerRankList[0].name}</td>
                                                    <td className={modalCSS.farmTableTd}>0</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[1].class)}>{farmerRankList[1].name}</td>
                                                    <td className={modalCSS.farmTableTd}>1 ~ 6</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[2].class)}>{farmerRankList[2].name}</td>
                                                    <td className={modalCSS.farmTableTd}>7 ~ 12</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[3].class)}>{farmerRankList[3].name}</td>
                                                    <td className={modalCSS.farmTableTd}>13 ~ 19</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[4].class)}>{farmerRankList[4].name}</td>
                                                    <td className={modalCSS.farmTableTd}>20 ~ 26</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[5].class)}>{farmerRankList[5].name}</td>
                                                    <td className={modalCSS.farmTableTd}>27 ~ 34</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[6].class)}>{farmerRankList[6].name}</td>
                                                    <td className={modalCSS.farmTableTd}>35 ~ 42</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[7].class)}>{farmerRankList[7].name}</td>
                                                    <td className={modalCSS.farmTableTd}>43 ~ 51</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[8].class)}>{farmerRankList[8].name}</td>
                                                    <td className={modalCSS.farmTableTd}>52 ~ 60</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[9].class)}>{farmerRankList[9].name}</td>
                                                    <td className={modalCSS.farmTableTd}>61 ~</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={classnames(modalCSS.farmTableTd_rank, farmerRankList[10].class)}>{farmerRankList[10].name}</td>
                                                    <td className={modalCSS.farmTableTd}>?????? ??????</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>,
                            "chickiballScore":
                                <>
                                    <div className={modalCSS.chickiballScore}>
                                        <div className={modalCSS.chickiballModalContentTitle}>
                                            [?????? ??? ?????? ?????????]
                                        </div>
                                        <table className={modalCSS.chickiballTable}>
                                            <thead className={modalCSS.farmTableThead}>
                                                <tr>
                                                    <th className={modalCSS.farmTableTh}>?????? ??????</th>
                                                    <th className={modalCSS.farmTableTh}>??????</th>
                                                </tr>
                                            </thead>
                                            <tbody className={modalCSS.farmTableTbody}>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>1</td>
                                                    <td className={modalCSS.chickiballTd}>11</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>2</td>
                                                    <td className={modalCSS.chickiballTd}>10</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>3</td>
                                                    <td className={modalCSS.chickiballTd}>9</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>4</td>
                                                    <td className={modalCSS.chickiballTd}>6</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>5</td>
                                                    <td className={modalCSS.chickiballTd}>5</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>6</td>
                                                    <td className={modalCSS.chickiballTd}>3</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>7</td>
                                                    <td className={modalCSS.chickiballTd}>2</td>
                                                </tr>
                                                <tr className={modalCSS.farmTableTr}>
                                                    <td className={modalCSS.chickiballTd}>??????</td>
                                                    <td className={modalCSS.chickiballTd}>1</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className={modalCSS.chickiballModalContentFooter}>
                                            <span>* ??? ???????????? ???????????? ???????????????.</span>
                                            <span>* ?????? ????????? ?????? ???????????? ?????? ????????? 0?????? ???????????????.</span>
                                        </div>
                                    </div>
                                </>,
                            "roulette":
                                <>
                                    <div className={modalCSS.rouletteDiv}>
                                        <div className={modalCSS.rouletteHeader}>
                                            <span className={modalCSS.rouletteTitle}>
                                                ?????? ?????????
                                            </span>
                                            <span className={modalCSS.rouletteDes}>
                                                ????????? ?????? ?????? ?????????? ???
                                            </span>
                                        </div>
                                        <div className={modalCSS.rouletteBox}>
                                            <div className={modalCSS.rouletteUlBox}>
                                                <ul className={rouletteBtnClick === false ? classnames(modalCSS.rouletteList, modalCSS.rouletteListReverseSlide) : classnames(modalCSS.rouletteList, modalCSS.rouletteListSlide)}>
                                                    <li className={modalCSS.rouletteItem}>
                                                        <span className={modalCSS.rouletteItemName}>????????? ??????????</span>
                                                    </li>
                                                    {
                                                        todayChickenList.map((a, index) => {
                                                            return (
                                                                <li className={modalCSS.rouletteItem} key={index}>
                                                                    <span className={modalCSS.rouletteItemName}>{a}</span>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={modalCSS.rouletteBtnBox}>
                                            <button type="button" className={classnames(modalCSS.rouletteBtn, modalCSS.greenButton)} onClick={() => rouletteBtnClick === false ? setRouletteBtnClick(true) : setRouletteBtnClick(false)}>
                                                {rouletteBtnClick === false ? "?????? ????????????" : "?????????"}
                                            </button>
                                        </div>
                                    </div>
                                </>
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default UtilModal;