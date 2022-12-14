import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// Image
import questionIcon_white from "../../../src/image/utils/question_white.png";
import refreshIcon_white from "../../../src/image/utils/reset_white.png";
import plusIcon_white from '../../../src/image/utils/plus.png'
import chickIcon from '../../../src/image/chick/chick.png';
import oilIcon from '../../../src/image/basak/oil.png';
import itemNotFound from "../../../src/image/utils/itemNotFound.png";

// page components
import Loading from "../../util/Loading";

// modal
import ChickizModal from '../../modal/ChickizModal'
import MentorModal from '../../modal/MentorModal'

// store
import { getChickizInfo, sortMining, addSelected, refreshSelected, selectMine, selectCharge } from '../../../store/modules/lab/mining';
import { setRequestKey, setKlipModalBool } from '../../../store/modules/klipstore';
import { nftFromChain } from '../../../store/modules/nft';
import { setSmallModalBool, setConfirmState } from '../../../store/modules/modal';
import { getBalance } from '../../../store/modules/myInfo'

// css
import MiningCSS from '../../../styles/mining.module.css';
import RaffleCSS from '../../../styles/raffle.module.css';

// data
import miningRate from "../../../src/data/chickiz/miningRate";

// chain
import caver from '../../chain/CaverChrome';
import Miningcontract from "../../chain/contract/Miningcontract";

// wallet
import Wallet from "../../chain/wallet/Wallet";

function MiningBig(props) {

    const dispatch = useDispatch();
    const {
        sortBy, info, loading_info, selected
    } = useSelector((state) => state.mining);
    const { chickiz } = useSelector((state) => state.nft);
    const { account } = useSelector((state) => state.myInfo);

    // modal
    // chickiz
    const [chickizModalBool, setChickizModalBool] = useState(false);
    const [selectedChickiz, setSelectedChickiz] = useState(null);
    const openDetails_Chickiz = useCallback((_id) => {
        setSelectedChickiz(_id)
        setChickizModalBool(true)
    }, [selectedChickiz])
    // mentor
    const [mentorModalBool, setMentorModalBool] = useState(false);
    const openDetails_Mentor = useCallback((_id) => {
        setSelectedChickiz(_id)
        setMentorModalBool(true)
    }, [selectedChickiz])

    useEffect(() => {
        props.refresh();
    }, [chickiz.length])

    const getMiningAmount = (cp, mentor) => {

        let base;
        let result;

        if (cp < 3) {
            base = miningRate.basic[cp];
        } else {
            base = miningRate.basic[cp - 3];
        }

        if (cp < 3) {
            if (mentor > 899) {
                result = base * 2;
            } else if (mentor > 0) {
                result = base * 1.2;
            } else {
                result = base;
            }
        } else {
            result = base * 3;
        }

        return result
    }

    const getMiningTotal = (_mine) => {
        if (_mine === undefined) {
            return 0
        } else {
            return (Math.floor(Number(caver.utils.fromPeb(_mine.toString(), 'KLAY')) * 100) / 100) // ????????? ??????????????????
        }
    }

    // oil time calculate
    const calculateOilTime = (_oilCharged, _cp) => {
        const _time = Number(_oilCharged) + 2592000 - props.now;
        if (_cp > 2) return '-'
        if (_time < 0) return 0
        return (_time)
    }

    const secondToTime = (_time) => {
        if (_time === '-') return '-'
        const d = Math.floor(_time / 86400)
        const h = Math.floor(_time / 3600) % 24
        let m = Math.ceil(_time / 60) % 60
        if (d === 29 && h === 23 && m === 0) m = 59
        return `${d}??? ${h}?????? ${m}??? ??????`
    }

    // selected
    const singleSelect = (_id) => {
        dispatch(addSelected({ id: _id }))
    }

    const singleSelectedOrNot = (_id) => {
        return selected.includes(_id)
    }

    // unequip
    const unequipMentor = async (_id) => {
        const minecon = new Miningcontract();
        const res1 = await minecon.unEquipMentor(klipPopOn, klipPopOff, account, _id);
        if (res1?.status === true) {
            props.refresh();
            dispatch(setSmallModalBool({ bool: true, msg: "?????? ????????? ?????????????????????.", modalTemplate: "justAlert" }))
            dispatch(nftFromChain(account));
            dispatch(getBalance(account));
        } else {
            dispatch(setSmallModalBool({ bool: true, msg: "????????? ?????????????????????. ?????? ??????????????????.", modalTemplate: "justAlert" }))
        }
    }

    // klip

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

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
                        <Link href="/lab">
                            <span className="pageTitle">
                                ???????????????
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            ????????????
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon="$CHICK ????????????" className="pageUtilIconBox" onClick={() => Wallet.addToken()}>
                            <Image className="pageUtilIcon" src={plusIcon_white} alt="" />
                        </div>
                        <div id="balloon_light" balloon="????????? ????????????" className="pageUtilIconBox" onClick={() => props.refresh()}>
                            <Image className="pageUtilIcon" src={refreshIcon_white} alt="" />
                        </div>
                        <div id="balloon_light" balloon="?????? ????????? ??????" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/8a2894ec853d44699b1c843fa9f430b0')}>
                            <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                        </div>
                    </div>
                </div>
                <div className={MiningCSS.miningBig_whole}>
                    <div className={MiningCSS.miningBig_header}>
                        <div className={MiningCSS.miningBig_headerEach}>
                            <div className={MiningCSS.miningHeaderIcon} id='balloon_light' balloon='?????? ?????? ??????' onClick={() => dispatch(selectMine())}>
                                <Image className='image100' src={chickIcon} />
                            </div>
                            <div className={MiningCSS.miningHeaderIcon} id='balloon_light' balloon='?????? ?????? ??????' onClick={() => dispatch(selectCharge())}>
                                <Image className='image100' src={oilIcon} />
                            </div>
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 0 ? 1 : 0 }))}>
                            ????????? ??????
                            {
                                sortBy === 0
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    sortBy === 1
                                        ?
                                        <div className={MiningCSS.miningSemo_asc} />
                                        :
                                        null
                            }
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 2 ? 3 : 2 }))}>
                            ??????
                            {
                                sortBy === 2
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    sortBy === 3
                                        ?
                                        <div className={MiningCSS.miningSemo_asc} />
                                        :
                                        null
                            }
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 4 ? 1 : 4 }))}>
                            ??????
                            {
                                sortBy === 4
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    null
                            }
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 5 ? 1 : 5 }))}>
                            ??????
                            {
                                sortBy === 5
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    null
                            }
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 6 ? 7 : 6 }))}>
                            ?????????
                            {
                                sortBy === 6
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    sortBy === 7
                                        ?
                                        <div className={MiningCSS.miningSemo_asc} />
                                        :
                                        null
                            }
                        </div>
                        <div className={MiningCSS.miningBig_headerEach} onClick={() => dispatch(sortMining({ sortBy: sortBy === 8 ? 9 : 8 }))}>
                            ?????? ?????? ??????
                            {
                                sortBy === 8
                                    ?
                                    <div className={MiningCSS.miningSemo_desc} />
                                    :
                                    sortBy === 9
                                        ?
                                        <div className={MiningCSS.miningSemo_asc} />
                                        :
                                        null
                            }
                        </div>
                    </div>
                    <div className={MiningCSS.miningBig_body}>
                        {
                            loading_info
                                ?
                                <div className={MiningCSS.miningBig_no}>
                                    <div className="noNFTBox">
                                        <div className={RaffleCSS.raffleWholeLoading}>
                                            <div className={RaffleCSS.raffleWholeLoadingBox}>
                                                <Loading />
                                            </div>
                                            <span className={RaffleCSS.raffleWholeLoadingSpan}>
                                                loading...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                info.length < 1
                                    ?
                                    <div className={MiningCSS.miningBig_no}>
                                        <div className="noNFTBox">
                                            <div className="noNFT">
                                                <Image className="image100" src={itemNotFound} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={MiningCSS.miningBig_table}>
                                        {
                                            info.map((x, index) => {
                                                return (
                                                    <div className={MiningCSS.miningBig_tableEach} key={x.id}>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            <label htmlFor={x.id} className={MiningCSS.miningBig_checkbox} key={index} >
                                                                <input type='checkbox' id={x.id} checked={singleSelectedOrNot(x.id)} onChange={() => singleSelect(x.id)} />
                                                            </label>
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            <div className={MiningCSS.miningBig_table_id_picture_div} id='balloon_light' balloon='????????? ????????? ??????'
                                                                onClick={() => openDetails_Chickiz(x.id)}>
                                                                <div className={MiningCSS.miningBig_table_id_picture}>
                                                                    <Image className='image100' width={128} height={128}
                                                                        src={
                                                                            x.cp > 2
                                                                                ?
                                                                                `https://api.klaychicken.com/v2small/${x.id}.png`
                                                                                :
                                                                                `https://api.klaychicken.com/v2small/${x.id}.png`
                                                                        } />
                                                                </div>
                                                                <span>
                                                                    #{x.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            <span id={calculateOilTime(x.oilCharged, x.cp) === '-' ? `balloon_light` : null} balloon='?????? - ???????????? ?????? x'>
                                                                {secondToTime(calculateOilTime(x.oilCharged, x.cp))}
                                                            </span>
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            {
                                                                x.mentor > 0
                                                                    ?
                                                                    x.mentorKind === 0
                                                                        ?
                                                                        <div className={MiningCSS.miningBig_table_mentor_picture} id='balloon_light' balloon={`#${x.mentor} / ???????????? ??????`}
                                                                            onClick={() => unequipMentor(x.id)}>
                                                                            <Image className='image100' width={128} height={128} src={`https://api.klaychicken.com/v1/bone/image/${x.mentor}.png`} />
                                                                        </div>
                                                                        :
                                                                        <div className={MiningCSS.miningBig_table_mentor_picture} id='balloon_light' balloon={`#${x.mentor} / ???????????? ??????`}
                                                                            onClick={() => unequipMentor(x.id)}>
                                                                            <Image className='image100' width={128} height={128} src={`https://api.klaychicken.com/v1/sunsal/image/${x.mentor}.png`} />
                                                                        </div>
                                                                    :
                                                                    <span className={MiningCSS.miningBig_table_mentor_picture} id='balloon_light' balloon='???????????? ?????? ??????'
                                                                        onClick={() => {
                                                                            if (x.cp > 2) {
                                                                                dispatch(setSmallModalBool({ bool: true, msg: '?????????????????? ????????? ????????? ??? ????????????.', modalTemplate: "justAlert" }))
                                                                            } else {
                                                                                openDetails_Mentor(x.id)
                                                                            }
                                                                        }}>
                                                                        X
                                                                    </span>
                                                            }
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            {x.cp < 3 ? 'X' : 'O'}
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            <div className={MiningCSS.miningBig_tableEach_Token} id='balloon_light'
                                                                balloon={
                                                                    x.cp > 2
                                                                        ?
                                                                        `?????? ${miningRate.basic[x.cp - 3]} + ?????? 200%`
                                                                        :
                                                                        `?????? ${miningRate.basic[x.cp]} + ?????? ${x.mentor > 899 ? '100%' : x.mentor > 0 ? '20%' : '0%'}`
                                                                }>
                                                                <div className={MiningCSS.miningBig_tableEach_Chick}>
                                                                    <Image className='image100' src={chickIcon} />
                                                                </div>
                                                                {getMiningAmount(x.cp, x.mentor)} / ???
                                                            </div>
                                                        </div>
                                                        <div className={MiningCSS.miningBig_tableEach_Each}>
                                                            <div className={MiningCSS.miningBig_tableEach_Token}>
                                                                <div className={MiningCSS.miningBig_tableEach_Chick}>
                                                                    <Image className='image100' src={chickIcon} />
                                                                </div>
                                                                {getMiningTotal(x.minable)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                        }
                    </div>
                </div>
            </div >
            {
                chickizModalBool
                    ?
                    <ChickizModal tokenId={selectedChickiz} setModalBool={setChickizModalBool} />
                    :
                    null
            }
            {
                mentorModalBool
                    ?
                    <MentorModal tokenId={selectedChickiz} setModalBool={setMentorModalBool} refresh={props.refresh} />
                    :
                    null
            }
        </>
    );
}

export default MiningBig;