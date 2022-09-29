import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
// css
import RaffleCSS from "../../../styles/raffle.module.css";

// Image
import refreshIcon_white from "../../../src/image/utils/reset_white.png";
import questionIcon_white from "../../../src/image/utils/question_white.png";

// page components
import RaffleListShow from '../search/RaffleListShow';

// store
import { getRaffleList_first, getRaffleList_more } from "../../../store/modules/raffle/raffle";

function RaffleBig({ setSelectedRaffleId }) {

    const dispatch = useDispatch();

    const {
        sortWay, searchWord, filterRaffleStatus, filterRaffleCollection,
        raffleList, loading, loading_more, getDone
    } = useSelector((state) => state.raffle);

    const get_first = useCallback(() => {
        dispatch(getRaffleList_first({
            sortWay: sortWay,
            searchWord: searchWord,
            filterRaffleStatus: filterRaffleStatus,
            filterRaffleCollection: filterRaffleCollection
        }));
    }, [])

    const get_more = useCallback(() => {
        dispatch(getRaffleList_more());
    }, [])

    function refresh() {
        dispatch(getRaffleList_first({
            sortWay: sortWay,
            searchWord: searchWord,
            filterRaffleStatus: filterRaffleStatus,
            filterRaffleCollection: filterRaffleCollection
        }));
    }

    //function refresh_term() {
    //    document.querySelector(`.${RaffleCSS.raffleWholeBox}`).scrollTop = 0;
    //    dispatch(getRaffleList_first({
    //        sortWay: sortWay,
    //        searchWord: searchWord,
    //        filterRaffleStatus: filterRaffleStatus,
    //        filterRaffleCollection: filterRaffleCollection,
    //    }))
    //}

    //if (hour === 0 && min === 0 && sec === 0) {
    //    refresh_term()
    //}

    return (
        <>
            <div className="subBoard_big">
                <div className="pageHeaderBox">
                    <div className="pageTitleBox">
                        <Link href="/">
                            <span className="pageTitle">
                                HOME
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            래플
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon="리스트 새로고침" className="pageUtilIconBox" onClick={refresh}>
                            <Image className="pageUtilIcon" src={refreshIcon_white} alt="" />
                        </div>
                        <div id="balloon_light" balloon="래플 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/021431fde9c44c88882dd016fabcd1ed')}>
                            <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                        </div>
                        <Link href="/raffle/myRaffle">
                            <button className="pageUtilSubmit greenButton">
                                내 래플
                            </button>
                        </Link>
                        <Link href="/raffle/createRaffle">
                            <button className="pageUtilSubmit greenButton">
                                래플 생성
                            </button>
                        </Link>
                    </div>
                </div>
                <div className={RaffleCSS.raffleWholeBox}>
                    <RaffleListShow
                        raffleList={raffleList}
                        getDone={getDone}
                        loading={loading}
                        loading_more={loading_more}
                        setSelectedRaffleId={setSelectedRaffleId}
                        getListFirst={get_first}
                        getListMore={get_more}
                        reset={1} />
                </div>
            </div >
        </>
    );
}

export default RaffleBig;