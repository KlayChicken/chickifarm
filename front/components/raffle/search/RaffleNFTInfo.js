import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import moment from "moment";

// images

import openseaIcon from "../../../src/image/logo/snsLogo/color/opensea.svg"
import twitterIcon from '../../../src/image/logo/snsLogo/color/twitter_circle.png'
import discordIcon from '../../../src/image/logo/snsLogo/color/discord_circle.png'
import klaytnLogo from '../../../src/image/logo/klaytnLogo.svg'

// css
import RaffleCSS from "../../../styles/raffle.module.css";
import modalCSS from "../../../styles/modal.module.css";


function RaffleNFTInfo({ twitterUrl, discordUrl }) {

    const { raffleDetail, raffleDetail_twitter, raffleDetail_discord, } = useSelector((state) => state.raffle);

    return (
        <div className={RaffleCSS.raffleNFTInfoBox}>
            <div className={RaffleCSS.raffleNFTInfoSNSBox}>
                <div className={modalCSS.otherNFTModalLinkBox}>
                    <div id="balloon_dark" balloon="오픈씨에서 보기" className={modalCSS.otherNFTModalLinkEach}
                        onClick={() => window.open(`https://opensea.io/assets/klaytn/${raffleDetail.nftAddress}/${raffleDetail.tokenId}`)}>
                        <Image className="image100" src={openseaIcon} alt="opensea" />
                    </div>
                    <div id="balloon_dark" balloon="파인더에서 보기" className={modalCSS.otherNFTModalLinkEach}
                        onClick={() => window.open(`https://www.klaytnfinder.io/nft/${raffleDetail.nftAddress}/${raffleDetail.tokenId}`)}>
                        <Image className="image100" src={klaytnLogo} alt="klaytnfinder" />
                    </div>
                    <div id="balloon_dark" balloon="트위터" className={modalCSS.otherNFTModalLinkEach}
                        onClick={() => window.open(raffleDetail_twitter)}>
                        <Image className="image100" src={twitterIcon} alt="twitter" />
                    </div>
                    <div id="balloon_dark" balloon="디스코드" className={modalCSS.otherNFTModalLinkEach}
                        onClick={() => window.open(raffleDetail_discord)}>
                        <Image className="image100" src={discordIcon} alt="discord" />
                    </div>
                </div>
            </div>
            <div className={RaffleCSS.raffleNFTInfoMetaBox}>
                <div className={modalCSS.otherNFTModalTraitBox_Whole}>
                    <div className={modalCSS.otherNFTModalTraitBox_Grid}>
                        {
                            raffleDetail.nftMeta?.attributes?.map((a, index) => {
                                return (
                                    <div key={index} className={modalCSS.otherNFTModalGrid}>
                                        <span className={modalCSS.otherNFTModalTraitType}>
                                            {a.trait_type}
                                        </span>
                                        <span className={modalCSS.otherNFTModalTraitValue}>
                                            {a.value}
                                        </span>
                                    </div>
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RaffleNFTInfo;