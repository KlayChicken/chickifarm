import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { CopyToClipboard } from 'react-copy-to-clipboard';

// css
import classnames from 'classnames'
import RaffleCSS from "../../../styles/raffle.module.css";

// page components
import useInput from '../../../hooks/useInput';
import RaffleDetail from './RaffleDetail';

// data
import OtherNFTProjectList from '../../../src/data/contract/OtherNFTProjectList';

// Image
import findImage from '../../../src/image/utils/find_gray.png';
import resetIcon_white from '../../../src/image/utils/reset_white.png';
import shareIcon_white from '../../../src/image/utils/share_white.png';
import questionIcon_white from "../../../src/image/utils/question_white.png";

// store
import {
    getRaffleList_first, resetFilter,
    getSingleRaffle, getSingleRaffle_chain, getBuyerList_first
} from "../../../store/modules/raffle/raffle";
import { setSmallModalBool } from '../../../store/modules/modal';

function RaffleSmall({ selectedRaffleId, setSelectedRaffleId }) {

    const { isUser, account } = useSelector((state) => state.myInfo);
    const { sortWay, searchWord, filterRaffleStatus, filterRaffleCollection, raffleList } = useSelector((state) => state.raffle);
    const dispatch = useDispatch();

    const [_filterSortWay, onChangeFilterSortWay] = useInput(sortWay);
    const [_filterSearchWord, onChangeFilterSearchWord] = useInput(searchWord);
    const [_filterRaffleStatus, onChangeFilterRaffleStatus] = useInput(filterRaffleStatus);
    const [_filterRaffleCollection, onChangeFilterRaffleCollection] = useInput(filterRaffleCollection);

    //useEffect(() => {
    //    if (raffleList.length > 0) return
    //    dispatch(getRaffleList_first({
    //        sortWay: sortWay,
    //        searchWord: searchWord,
    //        filterRaffleStatus: filterRaffleStatus,
    //        filterRaffleCollection: filterRaffleCollection,
    //    }))
    //}, [])

    async function getRaffle() {
        //document.querySelector(`.${RaffleCSS.raffleWholeBox}`).scrollTop = 0;
        dispatch(getRaffleList_first({
            sortWay: _filterSortWay,
            searchWord: _filterSearchWord,
            filterRaffleStatus: _filterRaffleStatus,
            filterRaffleCollection: _filterRaffleCollection,
        }))
    }

    async function filterReset() {
        let trash = { target: { value: '' } };
        let trash1 = { target: { value: 0 } };
        //document.querySelector(`.${RaffleCSS.raffleWholeBox}`).scrollTop = 0;
        onChangeFilterSortWay(trash1);
        onChangeFilterSearchWord(trash);
        onChangeFilterRaffleStatus(trash1);
        onChangeFilterRaffleCollection(trash);
        dispatch(resetFilter())
    }

    // single raffle
    useEffect(() => {
        if (selectedRaffleId === null) return;
        refreshSingleRaffle(selectedRaffleId)
    }, [selectedRaffleId])

    async function refreshSingleRaffle(id) {
        try {
            await dispatch(getSingleRaffle({ raffleId: id })).unwrap();
            dispatch(getBuyerList_first({ raffleId: id }));
            dispatch(getSingleRaffle_chain({ isUser: isUser, account: account }));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="subBoard_small">
            {
                selectedRaffleId === null
                    ?
                    <>
                        <div className={RaffleCSS.raffleFindWholeBox}>
                            <div className={RaffleCSS.raffleFindBox}>
                                <div className={RaffleCSS.raffleFindInputBoxWhole}>
                                    <div className={RaffleCSS.raffleFindInputBox}>
                                        <div className={RaffleCSS.raffleFindIcon} onClick={() => getRaffle()}>
                                            <Image className="image100" src={findImage} alt="" />
                                        </div>
                                        <input className={RaffleCSS.raffleFindInput} value={_filterSearchWord} placeholder="?????? ?????? ?????? ????????? ??????" onChange={onChangeFilterSearchWord}
                                            onKeyUp={() => {
                                                if (window.event.keyCode === 13) {
                                                    getRaffle();
                                                }
                                            }}>
                                        </input>
                                    </div>
                                    <button className="pageUtilSubmit greenButton" onClick={() => getRaffle()}>
                                        ????????????
                                    </button>
                                </div>
                                <div className={RaffleCSS.raffleFindTotalSelectBox}>
                                    <div className={RaffleCSS.raffleFindFilterWholeCheck} onClick={() => filterReset()}>
                                        <span className={RaffleCSS.raffleFindFilterWholeCheckTitle}>
                                            ?????? ?????????
                                        </span>
                                        <div className={classnames(RaffleCSS.raffleFindFilterReset, "neonShine")} >
                                            <Image className="image100" src={resetIcon_white} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        ?????? ??????
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterSortWay} onChange={onChangeFilterSortWay}>
                                            <option className={RaffleCSS.raffleFindOption2} value={0} >?????? ????????? ???</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={1} >?????? ?????? ?????? ???</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={2} >?????? ?????? ?????? ???</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={3} >?????? ?????? ?????? ???</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={4} >?????? ?????? ?????? ???</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        ?????? ??????
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterRaffleStatus} onChange={onChangeFilterRaffleStatus}>
                                            <option className={RaffleCSS.raffleFindOption2} value={0}>?????? ??????</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={1}>???????????? ??????</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={2}>????????? ??????</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        ????????? ??????
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterRaffleCollection} onChange={onChangeFilterRaffleCollection}>
                                            <option className={RaffleCSS.raffleFindOption2} value={''}>??????</option>
                                            {
                                                OtherNFTProjectList.map((a, index) => {
                                                    return (
                                                        <option key={index} className={RaffleCSS.raffleFindOption2} value={a.name} >{a.name} </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={RaffleCSS.raffleSmallDetailsNoticeBox}>
                                <div className={RaffleCSS.raffleSmallDetailsNoticeBoxContent}>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_title}>
                                        ?????? ?????? ??????
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        1. ???????????? ?????? ????????? ????????????, ????????? ???????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        2. ????????? ????????? ???????????? ????????????. ???????????? ???????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        3. ??????????????? ?????? 20?????? ????????? ????????? ??? ????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        4. ?????? ????????? ????????? ???????????? ?????? ???, ?????? ??? NFT??? ????????? ??? ????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_title}>
                                        ?????? ??? ????????????
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * $CHICK?????? ?????? ?????? ??? 2?????? ??????????????? ???????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * ????????? ???????????? ?????? ???????????? ????????? ????????? ???????????? ????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * ????????? ????????? ????????? ????????? ????????? ??? ????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * ????????? ???NFT ???????????? ????????? ????????? ????????? ??? ????????????.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * ????????? ?????? ??????????????? ????????? ????????? ?????? ????????? ???????????? ???????????????.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="pageHeaderBox">
                            <div className="pageTitleBox">
                                <span className={RaffleCSS.rafflePageTitle} onClick={() => setSelectedRaffleId(null)}>
                                    &lt; ?????? ??????
                                </span>
                            </div>
                            <div className="pageUtilBox">
                                <div id="balloon_light" balloon="?????? ????????????" className="pageUtilIconBox" onClick={() => refreshSingleRaffle(selectedRaffleId)}>
                                    <Image className="pageUtilIcon" src={resetIcon_white} alt="" />
                                </div>
                                <CopyToClipboard text={`https://chickifarm.com/raffle?id=${selectedRaffleId}`}>
                                    <div id="balloon_light" balloon="?????? ?????? ????????????" className="pageUtilIconBox" onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: `${selectedRaffleId}??? ?????? ????????? ?????????????????????.`, modalTemplate: "justAlert" }))
                                    }}>
                                        <Image className="pageUtilIcon" src={shareIcon_white} alt="" />
                                    </div>
                                </CopyToClipboard>
                                <div id="balloon_light" balloon="?????? ????????? ??????" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/021431fde9c44c88882dd016fabcd1ed')}>
                                    <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={RaffleCSS.raffleSmallWholeBox}>
                            <RaffleDetail refresh={refreshSingleRaffle} selectedRaffleId={selectedRaffleId} />
                        </div>
                    </>
            }
        </div >
    );
}

export default RaffleSmall;