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
                                        <input className={RaffleCSS.raffleFindInput} value={_filterSearchWord} placeholder="래플 번호 혹은 컬렉션 검색" onChange={onChangeFilterSearchWord}
                                            onKeyUp={() => {
                                                if (window.event.keyCode === 13) {
                                                    getRaffle();
                                                }
                                            }}>
                                        </input>
                                    </div>
                                    <button className="pageUtilSubmit greenButton" onClick={() => getRaffle()}>
                                        검색하기
                                    </button>
                                </div>
                                <div className={RaffleCSS.raffleFindTotalSelectBox}>
                                    <div className={RaffleCSS.raffleFindFilterWholeCheck} onClick={() => filterReset()}>
                                        <span className={RaffleCSS.raffleFindFilterWholeCheckTitle}>
                                            필터 초기화
                                        </span>
                                        <div className={classnames(RaffleCSS.raffleFindFilterReset, "neonShine")} >
                                            <Image className="image100" src={resetIcon_white} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        정렬 방법
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterSortWay} onChange={onChangeFilterSortWay}>
                                            <option className={RaffleCSS.raffleFindOption2} value={0} >신규 업로드 순</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={1} >시간 적게 남은 순</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={2} >남은 티켓 적은 순</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={3} >티켓 가격 낮은 순</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={4} >티켓 가격 높은 순</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        래플 상태
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterRaffleStatus} onChange={onChangeFilterRaffleStatus}>
                                            <option className={RaffleCSS.raffleFindOption2} value={0}>모두 보기</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={1}>진행중인 래플</option>
                                            <option className={RaffleCSS.raffleFindOption2} value={2}>종료된 래플</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={RaffleCSS.raffleFindFilterRange}>
                                    <span className={RaffleCSS.raffleFindFilterRangeTitle}>
                                        컬렉션 선택
                                    </span>
                                    <div className={RaffleCSS.raffleFindFilterRangeBox}>
                                        <select className={RaffleCSS.raffleFindFilterSelect2} value={_filterRaffleCollection} onChange={onChangeFilterRaffleCollection}>
                                            <option className={RaffleCSS.raffleFindOption2} value={''}>전체</option>
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
                                        티켓 구매 방법
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        1. 참가하고 싶은 래플을 선택하여, 티켓을 구매하세요.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        2. 구매한 티켓은 환불되지 않습니다. 신중하게 구매하세요.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        3. 트랜잭션당 최대 20개의 티켓을 구매할 수 있습니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_desc}>
                                        4. 내가 참여한 래플의 당첨자를 확인 후, 당첨 시 NFT를 수령할 수 있습니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_title}>
                                        구매 시 유의사항
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * $CHICK으로 래플 구매 시 2번의 트랜잭션이 발생합니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * 래플에 당첨되지 않는 경우에도 구매한 티켓은 환불되지 않습니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * 본인이 생성한 래플의 티켓은 구매할 수 없습니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * 반드시 ‘NFT 수령’을 눌러야 상품을 수령할 수 있습니다.
                                    </span>
                                    <span className={RaffleCSS.raffleSmallDetailsNoticeBoxContent_notice}>
                                        * 티켓이 모두 판매되어도 설정한 시간이 모두 지나야 당첨자가 발표됩니다.
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
                                    &lt; 뒤로 가기
                                </span>
                            </div>
                            <div className="pageUtilBox">
                                <div id="balloon_light" balloon="래플 새로고침" className="pageUtilIconBox" onClick={() => refreshSingleRaffle(selectedRaffleId)}>
                                    <Image className="pageUtilIcon" src={resetIcon_white} alt="" />
                                </div>
                                <CopyToClipboard text={`https://chickifarm.com/raffle?id=${selectedRaffleId}`}>
                                    <div id="balloon_light" balloon="래플 주소 공유하기" className="pageUtilIconBox" onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: `${selectedRaffleId}번 래플 주소가 복사되었습니다.`, modalTemplate: "justAlert" }))
                                    }}>
                                        <Image className="pageUtilIcon" src={shareIcon_white} alt="" />
                                    </div>
                                </CopyToClipboard>
                                <div id="balloon_light" balloon="래플 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/021431fde9c44c88882dd016fabcd1ed')}>
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