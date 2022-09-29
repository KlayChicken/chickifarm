import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import Image from 'next/image';

// page components
import RaffleInfo from "./RaffleInfo";
import RaffleNFTInfo from "./RaffleNFTInfo";
import RaffleParticipants from "./RaffleParticipants";
import Loading from '../../util/Loading';

// image
import favorite_empty from "../../../src/image/utils/favorite_empty.png";
import favorite_fill from "../../../src/image/utils/favorite_fill.png";

// css
import classnames from 'classnames'
import RaffleCSS from "../../../styles/raffle.module.css";

// store
import { getFavorite, updateFavorite } from '../../../store/modules/raffle/raffleFavorite';

function RaffleDetail({ refresh, selectedRaffleId }) {

    const dispatch = useDispatch();

    const [tabNum, setTabNum] = useState(0);

    const { myId, isUser } = useSelector((state) => state.myInfo);
    const { raffleDetail } = useSelector((state) => state.raffle);
    const { isFavorite } = useSelector((state) => state.raffleFavorite);


    useEffect(() => {
        if (selectedRaffleId === null) return;
        dispatch(getFavorite({ raffleId: selectedRaffleId, userId: myId }))
    }, [selectedRaffleId])

    async function updateF() {
        if (!isUser) return
        await dispatch(updateFavorite({ raffleId: selectedRaffleId, userId: myId })).unwrap()
        dispatch(getFavorite({ raffleId: selectedRaffleId, userId: myId }))
    }

    return (
        <div className={RaffleCSS.raffleDetailBox}>
            <div className={RaffleCSS.raffleDetailHeader}>
                <div className={
                    raffleDetail.collection === "SuperWalk Collection"
                        ? RaffleCSS.raffleDetailImgBox_width
                        :
                        raffleDetail.collection === "Klay 3 Kingdoms"
                            ? RaffleCSS.raffleDetailImgBox_height
                            : RaffleCSS.raffleDetailImgBox
                }>
                    {
                        raffleDetail.nftMeta?.image.endsWith('mp4') || raffleDetail.nftMeta?.image.endsWith('genesis')
                            ? <video className="image100" autoPlay muted loop><source src={raffleDetail.nftMeta?.image} type='video/mp4' /></video>
                            : <img className={RaffleCSS.raffleImgEach} src={raffleDetail.nftMeta?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} />
                    }
                </div>
                <div className={RaffleCSS.raffleDetailHead}>
                    <span className={RaffleCSS.raffleDetailCollection}>
                        {raffleDetail.collection}
                    </span>
                    <span className={RaffleCSS.raffleDetailName}>
                        {raffleDetail.nftMeta?.name}
                    </span>
                </div>
            </div>
            <hr className={RaffleCSS.raffleLine} />
            <div className={RaffleCSS.raffleTabBox}>
                <div className={tabNum === 0 ? classnames(RaffleCSS.raffleTab, RaffleCSS.raffleTabSelected) : RaffleCSS.raffleTab} onClick={() => setTabNum(0)}>
                    래플 정보
                </div>
                <div className={tabNum === 1 ? classnames(RaffleCSS.raffleTab, RaffleCSS.raffleTabSelected) : RaffleCSS.raffleTab} onClick={() => setTabNum(1)}>
                    NFT 정보
                </div>
                <div className={tabNum === 2 ? classnames(RaffleCSS.raffleTab, RaffleCSS.raffleTabSelected) : RaffleCSS.raffleTab} onClick={() => setTabNum(2)}>
                    구매자 정보
                </div>
            </div>
            <div className={RaffleCSS.raffleIdBox}>
                <span className={RaffleCSS.raffleId}>no. {raffleDetail.id}</span>
            </div>
            <div className={RaffleCSS.raffleFavoriteBox} onClick={updateF}>
                <div id='balloon_light' balloon={isFavorite === 0 ? '찜하기' : '찜 취소하기'} className='image100'>
                    <Image className='image100' src={isFavorite === 0 ? favorite_empty : favorite_fill} alt='찜하기' />
                </div>
            </div>
            {
                <>
                    {
                        {
                            0:
                                <RaffleInfo refresh={refresh} />,
                            1:
                                <RaffleNFTInfo />,
                            2:
                                <RaffleParticipants selectedRaffleId={selectedRaffleId} />,
                        }[tabNum]
                    }
                </>
            }
        </div>
    );
}

export default RaffleDetail;