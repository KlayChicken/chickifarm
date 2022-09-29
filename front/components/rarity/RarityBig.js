import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from 'react-intersection-observer';

// css
import classnames from "classnames";
import RarityCSS from "../../styles/rarity.module.css";
import MyInfoCSS from "../../styles/myinfo.module.css";

// Image
import closeIcon from '../../src/image/utils/close_lightgray.png'
import filterIcon from '../../src/image/utils/filter_white.png'
import itemNotFound from "../../src/image/utils/itemNotFound.png";

import crunchPowerImage from '../../src/image/rarity/raritySelect/crunchpower.png'
import backgroundImage from '../../src/image/rarity/raritySelect/background.png'
import wingImage from '../../src/image/rarity/raritySelect/wing.png'
import menuImage from '../../src/image/rarity/raritySelect/menu.png'
import skinImage from '../../src/image/rarity/raritySelect/skin.png'
import clothesImage from '../../src/image/rarity/raritySelect/clothes.png'
import eyebrowImage from '../../src/image/rarity/raritySelect/eyebrow.png'
import eyesImage from '../../src/image/rarity/raritySelect/eyes.png'
import neckImage from '../../src/image/rarity/raritySelect/neck.png'
import headImage from '../../src/image/rarity/raritySelect/head.png'
import itemsImage from '../../src/image/rarity/raritySelect/items.png'
import levelImage from '../../src/image/rarity/raritySelect/level.png'

// page components
import NoNFT from "../nftGrid/NoNFT";
import Loading from '../util/Loading';
import KIP17 from "../nftGrid/KIP17";
import ChickizModal from '../modal/ChickizModal'

// util component

// store
import { findByFilter, changeMyChickizFilter, changeSuperChickizFilter } from '../../store/modules/rarity';
import { getSuperList } from '../../store/modules/lab/makeSuper';

// data
import chickizMeta from '../../src/data/chickiz/chickizMeta.json'
import metaIndex from '../../src/data/chickiz/metaIndex.json'
import Rarity from "../../pages/rarity";

function RarityBig() {

    const dispatch = useDispatch();
    const router = useRouter();
    const [scrollRef, inView, entry] = useInView();

    const { isUser } = useSelector((state) => state.myInfo);
    const { chickiz: chickizNFT } = useSelector((state) => state.nft);
    const { chickizList, myChickizList, chickizList_super, myChickizList_super, filter, sortWay, filter_myChickiz, filter_superChickiz } = useSelector((state) => state.rarity);
    const { superList } = useSelector((state) => state.makeSuper)

    const [chickiz, setChickiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState('');

    useEffect(() => {
        dispatch(getSuperList());
    }, [])

    useEffect(() => {
        if (chickizList.length !== 0) {
            setLoading(true)
            getMoreChickiz(true)
            setLoading(false)
        }
    }, [chickizList, myChickizList, filter_myChickiz, filter_superChickiz])

    useEffect(() => {
        if (inView && !loading) {
            setLoading(true)
            getMoreChickiz(false);
            setLoading(false)
        }
    }, [inView])

    function getMoreChickiz(_first) {
        if (_first) {
            if (!filter_myChickiz && !filter_superChickiz) {
                const _chickiz = chickizList.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
                return
            } else if (!filter_myChickiz && filter_superChickiz) {
                const _chickiz = chickizList_super.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
                return
            } else if (filter_myChickiz && !filter_superChickiz) {
                const _chickiz = myChickizList.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
                return
            } else if (filter_myChickiz && filter_superChickiz) {
                const _chickiz = myChickizList_super.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
                return
            }
        }
        if (!filter_myChickiz && !filter_superChickiz) {
            if (cursor === '') {
                const _chickiz = chickizList.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            } else {
                const _chickiz = [...chickiz]
                const __chickiz = chickizList.slice(cursor, cursor + 60)
                _chickiz.push(...__chickiz)
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            }
        } else if (!filter_myChickiz && filter_superChickiz) {
            if (cursor === '') {
                const _chickiz = chickizList_super.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            } else {
                const _chickiz = [...chickiz]
                const __chickiz = chickizList_super.slice(cursor, cursor + 60)
                _chickiz.push(...__chickiz)
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            }
        } else if (filter_myChickiz && !filter_superChickiz) {
            if (cursor === '') {
                const _chickiz = myChickizList.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            } else {
                const _chickiz = [...chickiz]
                const __chickiz = myChickizList.slice(cursor, cursor + 60)
                _chickiz.push(...__chickiz)
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            }
        } else if (filter_myChickiz && filter_superChickiz) {
            if (cursor === '') {
                const _chickiz = myChickizList_super.slice(0, 60);
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            } else {
                const _chickiz = [...chickiz]
                const __chickiz = myChickizList_super.slice(cursor, cursor + 60)
                _chickiz.push(...__chickiz)
                setChickiz(_chickiz)
                setCursor(_chickiz.length)
            }
        }
    }

    // filter

    // image
    const rarityIcon = [
        crunchPowerImage,
        backgroundImage,
        wingImage,
        menuImage,
        skinImage,
        clothesImage,
        eyebrowImage,
        eyesImage,
        neckImage,
        headImage,
        itemsImage,
        levelImage
    ]

    const find_filter = (_type, _trait) => {
        dispatch(findByFilter({ type: _type, trait: _trait, sortWay: Number(sortWay), myList: chickizNFT, superList: superList }))
    }

    const filterMaker = (_filter) => {
        return (
            _filter.map((a) => {
                if (a.trait.length > 0) {
                    return a.trait.map((b) => {
                        return (
                            <span className={RarityCSS.rarityBigFilter} key={`${a}_${b}`} onClick={() => find_filter(a.type, b)}>
                                <div className={RarityCSS.rarityBigFilterIcon}>
                                    <Image className="image100" src={rarityIcon[a.type]} alt='' />
                                </div>
                                {metaIndex[a.type].trait[b]}
                                <div className={RarityCSS.rarityBigFilterIcon2}>
                                    <Image className="image100" src={closeIcon} alt='' />
                                </div>
                            </span>
                        )
                    })
                }
            })
        )
    }


    // modal
    const [modalBool, setModalBool] = useState(false);
    const [selectedChickiz, setSelectedChickiz] = useState(null);
    const openDetails = useCallback((_id) => {
        setSelectedChickiz(_id)
        setModalBool(true)
    }, [selectedChickiz])

    return (
        <>
            <div className="subBoard_big">
                <div className="pageHeaderBox" id='mobile_off'>
                    <div className="pageTitleBox">
                        <span className="pageTitle">
                            치키즈 수 : {
                                filter_myChickiz
                                    ?
                                    filter_superChickiz
                                        ?
                                        myChickizList_super.length
                                        :
                                        myChickizList.length
                                    :
                                    filter_superChickiz
                                        ?
                                        chickizList_super.length
                                        :
                                        chickizList.length
                            }
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon={filter_superChickiz ? '전체 보기' : '슈퍼치키즈만 보기'}
                            className={RarityCSS.rarityBigMyButton} onClick={() => {
                                dispatch(changeSuperChickizFilter())
                            }}>
                            {
                                filter_superChickiz
                                    ?
                                    <>
                                        슈퍼치키즈
                                        <span className={RarityCSS.rarityMyOn}>
                                            ON
                                        </span>
                                    </>
                                    :
                                    <>
                                        슈퍼치키즈
                                        <span className={RarityCSS.rarityMyOff}>
                                            OFF
                                        </span>
                                    </>
                            }
                        </div>
                        <div id="balloon_light" balloon={filter_myChickiz ? '전체 보기' : (isUser ? "내 치키즈만 보기" : '농장 가입이 필요합니다.')}
                            className={RarityCSS.rarityBigMyButton} onClick={() => {
                                if (isUser) {
                                    dispatch(changeMyChickizFilter())
                                }
                            }}>
                            {
                                filter_myChickiz
                                    ?
                                    <>
                                        내 치키즈
                                        <span className={RarityCSS.rarityMyOn}>
                                            ON
                                        </span>
                                    </>
                                    :
                                    <>
                                        내 치키즈
                                        <span className={RarityCSS.rarityMyOff}>
                                            OFF
                                        </span>
                                    </>
                            }
                        </div>
                    </div>
                </div>
                <div className={RarityCSS.rarityBigFilterWholeBox}>
                    <span className={RarityCSS.rarityBigFilterIndex}>
                        <div className={RarityCSS.rarityBigFilterIndexIcon}>
                            <Image className="image100" src={filterIcon} alt='' />
                        </div>
                        FILTER
                    </span>
                    <div className={RarityCSS.rarityBigFilterBox}>
                        {filterMaker(filter)}
                    </div>
                </div>
                <div className={RarityCSS.rarityBigWholeBox}>
                    <div className={MyInfoCSS.myInfoNFTGridBox}>
                        {
                            (filter_myChickiz ? myChickizList.length === 0 : chickizList.length === 0)
                                ?
                                <div className="noNFTBox">
                                    <div className="noNFT" onClick={() => window.open(`${url}`)}>
                                        <Image className="image100" src={itemNotFound} alt="" />
                                        <div className="noNFTDescBox">
                                            <span className="noNFTDesc">
                                                치키즈가 없습니다.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid6", "mobile_grid3")}>
                                    {
                                        chickiz?.map(function (a, index) {
                                            return (
                                                <div key={index} className="NFTBox neonShine" ref={
                                                    (chickiz?.length - 1 === index && chickiz?.length < chickizList?.length)
                                                        ? scrollRef : null}
                                                    onClick={() => openDetails(a)}>
                                                    <div className="NFTImageBox">
                                                        <Image
                                                            width={256} height={256}
                                                            loading="lazy"
                                                            placeholder='blur'
                                                            className="image100"
                                                            blurDataURL={`/image/otherProject/Chickiz.png`}
                                                            src={'https://api.klaychicken.com/v2small/' + a + ".png"} alt="" />
                                                    </div>
                                                    <span className="NFTName">
                                                        #{a}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                        }
                        {
                            loading
                                ?
                                <div className={MyInfoCSS.myInfoNFTSemiLoadingBox}>
                                    <div className={MyInfoCSS.myInfoNFTLoading}>
                                        <Loading />
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
            {
                modalBool
                    ?
                    <ChickizModal tokenId={selectedChickiz} setModalBool={setModalBool} />
                    :
                    null
            }
        </>
    );
}

export default RarityBig;