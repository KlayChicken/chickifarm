import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from "next/link";

// css
import classnames from 'classnames'
import RaffleCSS from "../../../styles/raffle.module.css";
import MyInfoCSS from "../../../styles/myinfo.module.css";

// page components
import useInput from '../../../hooks/useInput';
import RaffleDetail from '../search/RaffleDetail';

// data
import raffleCollectionList from '../../../src/data/contract/OtherNFTProjectList';

// Image
import findImage from '../../../src/image/utils/find_gray.png';
import resetIcon_white from '../../../src/image/utils/reset_white.png';
import shareIcon_white from '../../../src/image/utils/share_white.png';
import questionIcon_white from "../../../src/image/utils/question_white.png";

// store
import {
    getSingleRaffle, getSingleRaffle_chain, getBuyerList_first
} from "../../../store/modules/raffle/raffle";
import { setSmallModalBool } from "../../../store/modules/modal";


function MyRaffleSmall({ selectedRaffleId, setSelectedRaffleId }) {

    const { isUser, account } = useSelector((state) => state.myInfo);
    const dispatch = useDispatch();

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
            dispatch(getFavorite({ id: selectedRaffleId, favoriter: account }))
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
                                <Link href="/raffle">
                                    <span className="pageTitle">
                                        래플
                                    </span>
                                </Link>
                                <span className="pageTitleArrow">
                                    &gt;
                                </span>
                                <span className="pageTitle">
                                    내 래플
                                </span>
                            </div>
                            <div className="pageUtilBox">
                                <div id="balloon_light" balloon="래플 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/739131b4525b43dfbb54f4da98bbec68')}>
                                    <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                                </div>
                                <Link href="/raffle/createRaffle">
                                    <button className="pageUtilSubmit greenButton">
                                        래플 생성
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className={RaffleCSS.raffleSmallWholeBox}>
                            <div className={MyInfoCSS.myInfoOtherNFT_null}>
                                <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                    우측(하단)의 래플을 클릭해
                                </span>
                                <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                    래플의 상세 정보를 확인하세요.
                                </span>
                                <button className={classnames(MyInfoCSS.myInfoOtherNFT_nullButton, "purpleButton")}
                                    onClick={() => window.open('https://klayproject.notion.site/739131b4525b43dfbb54f4da98bbec68')}>
                                    래플 가이드 보기
                                </button>
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
                                    <div id="balloon_light" balloon="래플 주소 공유하기" className="pageUtilIconBox"
                                        onClick={function () {
                                            dispatch(setSmallModalBool({ bool: true, msg: `${selectedRaffleId}번 래플 주소가 복사되었습니다.`, modalTemplate: "justAlert" }))
                                        }}>
                                        <Image className="pageUtilIcon" src={shareIcon_white} alt="" />
                                    </div>
                                </CopyToClipboard>
                                <div id="balloon_light" balloon="래플 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('hhttps://klayproject.notion.site/021431fde9c44c88882dd016fabcd1ed')}>
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

export default MyRaffleSmall;