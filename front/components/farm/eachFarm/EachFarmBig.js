import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';
import axios from 'axios';

// page components
import EachFarm_farm from './EachFarm_Farm';

// images
import twitterIcon from '../../../src/image/logo/snsLogo/twitter_white.svg';
import shareIcon from '../../../src/image/utils/share_white.png';
import heartIcon_white from '../../../src/image/utils/heart_white.png';
import heartIcon_red from '../../../src/image/utils/heart_red.png';
import twitterSmallIcon from '../../../src/image/logo/snsLogo/twitter_small_white.png';
import { getIsNeighbor, updateNeighbor } from '../../../store/modules/neighbor/myNeighbor';
import { getLove, updateLove } from '../../../store/modules/love';

// store
import { setSmallModalBool } from '../../../store/modules/modal';

function EachFarmBig() {

    const dispatch = useDispatch();
    const router = useRouter();
    const { address } = router.query;
    const { asPath } = router;
    const currentLocation = `https://chickifarm.com${asPath}`;

    const farmerInfo = useSelector((state) => state.userInfo[address])
    const { account, isUser } = useSelector((state) => state.myInfo);
    const { isNeighbor } = useSelector((state) => state.myNeighbor);
    const { isLove, loves } = useSelector((state) => state.love);

    const [neighborMessage1, setNeighborMessage1] = useState("이웃 아님")
    const [neighborMessage2, setNeighborMessage2] = useState("이웃 농장")

    useEffect(() => {
        if (account === undefined || account === "") return
        dispatch(getIsNeighbor({ from: account, to: address }))
    }, [account, address])

    useEffect(() => {
        dispatch(getLove({ isUser: isUser, from: account, to: address }))
    }, [account, address, isUser])

    async function updateN() {
        if (!isUser) return
        const res = await dispatch(updateNeighbor({ from: account, to: address, nowBool: isNeighbor })).unwrap()
        dispatch(getIsNeighbor({ from: account, to: address }))
    }

    async function updateL() {
        if (!isUser) return
        const res = await dispatch(updateLove({ from: account, to: address, nowLove: isLove })).unwrap()
        dispatch(getLove({ isUser: isUser, from: account, to: address }))
    }

    return (
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
                    <Link href="/farm">
                        <span className="pageTitle">
                            치키농장
                        </span>
                    </Link>
                    <span className="pageTitleArrow">
                        &gt;
                    </span>
                    <span className="pageTitle">
                        {farmerInfo?.userName} 님의 농장
                    </span>
                </div>
                <div className="pageUtilBox">
                    <div id="balloon_light" balloon="좋아요 누르기" className="pageUtilIconBox" onClick={() => updateL()}>
                        <Image className="pageUtilIcon" src={Number(isLove) === 1 ? heartIcon_red : heartIcon_white} alt="" />
                    </div>
                    <span className="likeNumber">
                        {loves}
                    </span>
                    {/* 
                    <div className="pageUtilIconBox" onClick={() => {
                        window.open(`https://Twitter.com/intent/tweet?text=얘들아, 내 농장이 생겼어! 빨리 놀러와~%0a%0a${currentLocation}%0a%0a@klaychicken&hashtags=chickiz,chickifarm`)
                    }}>
                        <Image className="pageUtilIcon" src={twitterSmallIcon} alt="" />
                    </div>
                    */}
                    <CopyToClipboard text={currentLocation}>
                        <div id="balloon_light" balloon="농장 주소 복사" className="pageUtilIconBox" onClick={function () {
                            dispatch(setSmallModalBool({ bool: true, msg: `${farmerInfo?.userName}님의 농장 주소가 복사되었습니다.`, modalTemplate: "justAlert" }))
                        }}>
                            <Image className="pageUtilIcon" src={shareIcon} alt="" />
                        </div>
                    </CopyToClipboard>
                    {
                        account?.toUpperCase() !== address?.toUpperCase()
                            ?
                            null
                            :
                            <Link href="/myFarm">
                                <button className="pageUtilSubmit greenButton">
                                    농장 꾸미기
                                </button>
                            </Link>
                    }
                    {
                        isUser && account.toUpperCase() !== address?.toUpperCase()
                            ?
                            Number(isNeighbor) === 0
                                ?
                                <button className="pageUtilSubmit redToBlackButton"
                                    onMouseOver={() => setNeighborMessage1("이웃 추가")}
                                    onMouseOut={() => setNeighborMessage1("이웃 아님")}
                                    onClick={() => updateN()}>
                                    {neighborMessage1}
                                </button>
                                :
                                <button className="pageUtilSubmit greenToBlackButton"
                                    onMouseOver={() => setNeighborMessage2("이웃 취소")}
                                    onMouseOut={() => setNeighborMessage2("이웃 농장")}
                                    onClick={() => updateN()}>
                                    {neighborMessage2}
                                </button>
                            :
                            null
                    }
                </div>
            </div>
            <EachFarm_farm />
        </>
    )
}

export default EachFarmBig;