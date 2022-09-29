import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '../../hooks/useInput';
import Image from 'next/image';

// page scomponents
import MyInfo_OtherNFT from './MyInfo_OtherNFT';

import NoNFT from '../nftGrid/NoNFT';
import KIP17 from '../nftGrid/KIP17';
import KIP37 from '../nftGrid/KIP37';

import NftModal from '../modal/NftModal';
import ChickizModal from '../modal/ChickizModal';
import Loading from '../util/Loading';

// image
import questionIcon from '../../src/image/utils/question_yellow.png'

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css'

function MyInfoBig_NFT() {

    const { chickiz, sign, ornament, bone, sunsal, nftFromChainLoading } = useSelector((state) => state.nft);
    // nft kind
    const [nftKind, onChangeNftKind] = useInput('치키즈');

    // modal
    const [nftName, setNftName] = useState(null);
    const [nftId, setNftId] = useState(null);
    const [nftModalBool, setNftModalBool] = useState(false);

    function openDetails([name, id]) {
        setNftName(name);
        setNftId(id);
        setNftModalBool(true);
    }

    return (
        <>
            <div className={MyInfoCSS.myInfoNFTTitleBox}>
                <span className={MyInfoCSS.myInfoNFTEachTitle}>
                    {nftKind}
                    {
                        nftKind === '타 프로젝트'
                            ?
                            <div id="balloon_light" balloon="지원 프로젝트 보기"
                                className={classnames(MyInfoCSS.myInfoNFTEachTitleQuestion, "neonShine")}
                                onClick={() => window.open('https://klayproject.notion.site/Verified-NFT-LIST-25142c052d2044128cf3a91e298c9a7c')}>
                                <Image className='image100' src={questionIcon} alt="other project list" />
                            </div>
                            :
                            null
                    }
                </span>
                <select className={MyInfoCSS.myInfoNFTSelect} value={nftKind} onChange={onChangeNftKind}>
                    <option className={MyInfoCSS.myInfoNFTSelectOption} value='치키즈'>치키즈</option>
                    <option className={MyInfoCSS.myInfoNFTSelectOption} value='클레이치킨 V1'>클레이치킨 V1</option>
                    <option className={MyInfoCSS.myInfoNFTSelectOption} value='농장 장식품'>농장 장식품</option>
                    <option className={MyInfoCSS.myInfoNFTSelectOption} value='농장 팻말'>농장 팻말</option>
                    <option className={MyInfoCSS.myInfoNFTSelectOption} value='타 프로젝트'>타 프로젝트</option>
                </select>
            </div>
            <div className={MyInfoCSS.myInfoNFTBox}>
                {
                    {
                        '치키즈':
                            <div className={MyInfoCSS.myInfoNFTGridBox}>
                                {
                                    chickiz.length === 0
                                        ?
                                        <NoNFT url='https://opensea.io/collection/chickiz' />
                                        :
                                        <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid6", "mobile_grid4")}>
                                            <KIP17 nft={chickiz} nftName="chickiz" url="https://api.klaychicken.com/v2small/" openDetails={openDetails} />
                                        </div>
                                }
                            </div>,
                        '클레이치킨 V1':
                            <div className={MyInfoCSS.myInfoNFTGridBox}>{
                                nftFromChainLoading
                                    ?
                                    <div className={MyInfoCSS.myInfoNFTLoadingBox}>
                                        <div className={MyInfoCSS.myInfoNFTLoadingSemiBox}>
                                            <div className={MyInfoCSS.myInfoNFTLoading}>
                                                <Loading />
                                            </div>
                                            <span className={MyInfoCSS.myInfoNFTLoadingSpan}>
                                                loading...
                                            </span>
                                        </div>
                                    </div>
                                    :
                                    sunsal.length + bone.length === 0
                                        ?
                                        <NoNFT url='https://opensea.io/collection/klaychicken' />
                                        :
                                        <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid6", "mobile_grid4")}>
                                            <KIP17 nft={sunsal} nftName="sunsal" url="https://api.klaychicken.com/v1/sunsal/image/" openDetails={openDetails} />
                                            <KIP17 nft={bone} nftName="bone" url="https://api.klaychicken.com/v1/bone/image/" openDetails={openDetails} />
                                        </div>
                            }
                            </div>,
                        '농장 장식품':
                            <div className={MyInfoCSS.myInfoNFTGridBox}>
                                {
                                    nftFromChainLoading
                                        ?
                                        <div className={MyInfoCSS.myInfoNFTLoadingBox}>
                                            <div className={MyInfoCSS.myInfoNFTLoadingSemiBox}>
                                                <div className={MyInfoCSS.myInfoNFTLoading}>
                                                    <Loading />
                                                </div>
                                                <span className={MyInfoCSS.myInfoNFTLoadingSpan}>
                                                    loading...
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        ornament.length === 0
                                            ?
                                            <NoNFT url='https://opensea.io/collection/chickifarm-ornaments' />
                                            :
                                            <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid6", "mobile_grid4")}>
                                                <KIP37 nft={ornament} nftName="ornament" url="https://api.klaychicken.com/ornament/image/" openDetails={openDetails} />
                                            </div>
                                }
                            </div>,
                        '농장 팻말':
                            <div className={MyInfoCSS.myInfoNFTGridBox}>
                                {
                                    nftFromChainLoading
                                        ?
                                        <div className={MyInfoCSS.myInfoNFTLoadingBox}>
                                            <div className={MyInfoCSS.myInfoNFTLoadingSemiBox}>
                                                <div className={MyInfoCSS.myInfoNFTLoading}>
                                                    <Loading />
                                                </div>
                                                <span className={MyInfoCSS.myInfoNFTLoadingSpan}>
                                                    loading...
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        sign.length === 0
                                            ?
                                            <NoNFT url='https://opensea.io/collection/chickifarm-signs' />
                                            :
                                            <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid4", "mobile_grid3")}>
                                                <KIP37 nft={sign} nftName="sign" url="https://api.klaychicken.com/sign/image/" openDetails={openDetails} />
                                            </div>
                                }
                            </div>,
                        '타 프로젝트':
                            <MyInfo_OtherNFT />
                    }[nftKind]
                }
            </div>
            {
                nftModalBool
                    ?
                    nftName === "chickiz"
                        ?
                        <ChickizModal tokenId={nftId} setModalBool={setNftModalBool} />
                        :
                        <NftModal modalBool={nftModalBool} setModalBool={setNftModalBool} nftName={nftName} nftId={nftId} />
                    :
                    null
            }
        </>
    )
}

export default MyInfoBig_NFT;