import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import useInput from '../../hooks/useInput';

// css
import classnames from "classnames";
import RarityCSS from "../../styles/rarity.module.css";
import RaffleCSS from "../../styles/raffle.module.css";

// Image
import numberIcon from '../../src/image/utils/numberIcon_black.png';
import rankingIcon from '../../src/image/utils/rankingIcon_black.png';
import resetIcon from '../../src/image/utils/reset_white.png';
import closeIcon from '../../src/image/utils/close_lightgray.png';

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
import Loading from '../util/Loading';

// data
import chickizMeta from '../../src/data/chickiz/chickizMeta.json'
import metaIndex from '../../src/data/chickiz/metaIndex.json'

// util component

// store
import { resetRarityList, findById, findByRank, findByFilter, changeMyChickizFilter, changeSuperChickizFilter } from '../../store/modules/rarity';

function RaritySmall() {

    const dispatch = useDispatch();
    const router = useRouter();

    const { isUser } = useSelector((state) => state.myInfo);
    const { chickiz } = useSelector((state) => state.nft);
    const { chickizList, myChickizList, chickizList_super, myChickizList_super, filter, sortWay, filter_myChickiz, filter_superChickiz } = useSelector((state) => state.rarity);
    const { superList } = useSelector((state) => state.makeSuper)

    // for mobile
    const [mobileFilterOn, setMobileFilterOn] = useState(false);

    // rarity
    const [raritySelected, setRaritySelected] = useState(null);

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

    // id & rank
    const [filter_id, onChangeFilter_id] = useInput('');
    const [filter_rank, onChangeFilter_rank] = useInput('');
    const [filter_sortWay, onChangeFilter_sortWay] = useInput(0);

    const find_id = useCallback(() => {
        if (filter_id === '') {
            dispatch(findByFilter({ type: '', trait: '', sortWay: Number(filter_sortWay), myList: chickiz, superList: superList }))
            return
        }
        dispatch(findById({ id: Number(filter_id), myList: chickiz, superList: superList }));
    }, [filter_id, filter_sortWay, chickiz, superList])

    const find_rank = useCallback(() => {
        if (filter_rank === '') {
            dispatch(findByFilter({ type: '', trait: '', sortWay: Number(filter_sortWay), myList: chickiz, superList: superList }))
            return
        }
        dispatch(findByRank({ rank: Number(filter_rank), myList: chickiz, superList: superList }));
    }, [filter_rank, filter_sortWay, chickiz, superList])

    const find_reset = useCallback(() => {
        let trash = { target: { value: '' } };
        let trash1 = { target: { value: 0 } };
        onChangeFilter_id(trash)
        onChangeFilter_rank(trash)
        onChangeFilter_sortWay(trash1)
        setRaritySelected(null)
        dispatch(resetRarityList({ myList: chickiz, superList: superList }));
    }, [chickiz, superList])

    const find_filter = (_raritySelected, _index) => {
        dispatch(findByFilter({ type: _raritySelected, trait: _index, sortWay: Number(filter_sortWay), myList: chickiz, superList: superList }))
    }

    const find_sortWay = (e) => {
        onChangeFilter_sortWay(e);
        dispatch(findByFilter({ type: '', trait: '', sortWay: Number(e.target.value), myList: chickiz, superList: superList }));
    }

    const rarityChange = (_rarity) => {
        setRaritySelected(_rarity)
    }

    const firstUpper = (str) => {
        if (str === null) {
            return null
        }
        return (str.charAt(0).toUpperCase() + str.slice(1))
    }

    const checkChecked = useCallback((_raritySelected, _index) => {
        const _bool = filter.find(a => a.type === _raritySelected)?.trait.includes(_index);
        return (_bool ? true : false)
    }, [filter])

    const getCheckedTraitNum = useCallback((_type) => {
        const _num = filter.find(a => a.type === _type)?.trait.length;
        return (_num ? _num : 0)
    }, [filter])

    useEffect(() => {
        find_reset();
    }, [isUser, superList])

    return (
        <>
            <div className="subBoard_small">
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
                        <Link href="/lab">
                            <span className="pageTitle">
                                치키연구소
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            치키도감
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon="필터 초기화" className="pageUtilIconBox" onClick={find_reset}>
                            <Image className="pageUtilIcon" src={resetIcon} alt="" />
                        </div>
                    </div>
                </div>
                <div className={RarityCSS.raritySmallWholeBox}>
                    <div className={RarityCSS.rarityFindBox}>
                        <div className={RarityCSS.rarityFindInputBox}>
                            <div className={RarityCSS.rarityFindIcon} onClick={find_id}>
                                <Image className="image100" src={numberIcon} alt="" />
                            </div>
                            <input className={RarityCSS.rarityFindInput}
                                value={filter_id} placeholder="번호"
                                onChange={onChangeFilter_id}
                                onKeyUp={find_id} />
                        </div>
                        <div className={RarityCSS.rarityFindInputBox}>
                            <div className={RarityCSS.rarityFindIcon} onClick={find_rank}>
                                <Image className="image100" src={rankingIcon} alt="" />
                            </div>
                            <input className={RarityCSS.rarityFindInput}
                                value={filter_rank} placeholder="랭킹"
                                onChange={onChangeFilter_rank}
                                onKeyUp={find_rank} />
                        </div>
                        <select className={RarityCSS.rarityFilter} value={filter_sortWay} onChange={find_sortWay} >
                            <option value={0} >랜덤 정렬</option>
                            <option value={1} >번호 순</option>
                            <option value={2} >랭킹 높은 순</option>
                            <option value={3} >랭킹 낮은 순</option>
                        </select>
                    </div>
                    <div className={RarityCSS.rarityMobileBox2}>
                        <div />
                        <div className={RarityCSS.rarityBigMyButton} onClick={() => {
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
                        <div className={RarityCSS.rarityBigMyButton} onClick={() => {
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
                    <div className={RarityCSS.rarityMobileBox}>
                        <span>
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
                        <span onClick={() => setMobileFilterOn(!mobileFilterOn)}>
                            필터 열기 &gt;
                        </span>
                    </div>
                    <div id={mobileFilterOn ? 'mobile_on' : 'mobile_off'} className={RarityCSS.rarityMobileBox_whole}
                        onClick={() => setMobileFilterOn(!mobileFilterOn)} />
                    <div id={mobileFilterOn ? 'mobile_on_grid' : 'mobile_off'} className={RarityCSS.raritySelectTable}>
                        {
                            raritySelected === null
                                ?
                                <>
                                    <div className={RarityCSS.raritySelectMobileController}>
                                        <span className={RarityCSS.raritySelectMobileControllerSpan}>
                                            FILTER
                                        </span>
                                        <div className={RarityCSS.raritySelectMobileControllerClose} onClick={() => setMobileFilterOn(!mobileFilterOn)}>
                                            <Image src={closeIcon} alt='close' />
                                        </div>
                                    </div>
                                    {
                                        metaIndex?.map((a, index) => {
                                            return (
                                                <div key={index} className={RarityCSS.raritySelectEachBox} onClick={() => rarityChange(index)}>
                                                    <div className={RarityCSS.raritySelectImage}>
                                                        <Image className='image100' src={rarityIcon[index]} alt='crunchpower' />
                                                    </div>
                                                    <span className={RarityCSS.raritySelectList}>
                                                        {a.type === 'cp' ? '바삭력' : firstUpper(a.type)}
                                                        {
                                                            getCheckedTraitNum(index) < 1
                                                                ?
                                                                null
                                                                :
                                                                <span className={RarityCSS.raritySelecctPickedNum}>
                                                                    {getCheckedTraitNum(index)}
                                                                </span>
                                                        }
                                                    </span>
                                                    <span className={RarityCSS.raritySelectPlus}>
                                                        +
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </>
                                :
                                <>
                                    <div className={RarityCSS.raritySelectMobileController}>
                                        <span className={RarityCSS.raritySelectMobileControllerSpan}>
                                            FILTER
                                        </span>
                                        <div className={RarityCSS.raritySelectMobileControllerClose} onClick={() => setMobileFilterOn(!mobileFilterOn)}>
                                            <Image src={closeIcon} alt='close' />
                                        </div>
                                    </div>
                                    <div className={RarityCSS.raritySelectedBox} onClick={() => rarityChange(null)}>
                                        <div className={RarityCSS.raritySelectImage}>
                                            <Image className='image100' src={rarityIcon[raritySelected]} alt='crunchpower' />
                                        </div>
                                        <span className={RarityCSS.raritySelectList}>
                                            {firstUpper(metaIndex[raritySelected].type === 'cp' ? '바삭력' : metaIndex[raritySelected].type)}
                                            {
                                                getCheckedTraitNum(raritySelected) < 1
                                                    ?
                                                    null
                                                    :
                                                    <span className={RarityCSS.raritySelecctPickedNum}>
                                                        {getCheckedTraitNum(raritySelected)}
                                                    </span>
                                            }
                                        </span>
                                        <span className={RarityCSS.raritySelectPlus}>
                                            -
                                        </span>
                                    </div>
                                    <div className={RarityCSS.raritySelectedDetailBoxWhole}>
                                        {
                                            metaIndex[raritySelected]?.trait?.map((a, index) => {
                                                return (
                                                    <label htmlFor={a} className={RarityCSS.raritySelectedDetailBoxEach} key={index} >
                                                        <input type='checkbox' id={a} checked={checkChecked(raritySelected, index)} onChange={() => find_filter(raritySelected, index)} />
                                                        <span>
                                                            {a} ({metaIndex[raritySelected].quan[index]})
                                                        </span>
                                                    </label>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default RaritySmall;