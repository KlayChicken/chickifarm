import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// Image
import questionIcon_white from "../../../src/image/utils/question_white.png";
import randomChickiz from '../../../src/image/utils/randomchickiz.png';
import refreshIcon_white from "../../../src/image/utils/reset_white.png";
import plusIcon_white from '../../../src/image/utils/plus.png'
import chickIcon from '../../../src/image/chick/chick.png';
import oilIcon from '../../../src/image/basak/oil.png';
import itemNotFound from "../../../src/image/utils/itemNotFound.png";

// page components
import Loading from "../../util/Loading";
import NoNFT from '../../nftGrid/NoNFT';
import KIP17 from '../../nftGrid/KIP17';

// modal
import ChickizModal from '../../modal/ChickizModal'
import MentorModal from '../../modal/MentorModal'

// store
import { getSuperList, makeSuperRequest } from '../../../store/modules/lab/makeSuper';
import { setRequestKey, setKlipModalBool } from '../../../store/modules/klipstore';
import { nftFromChain } from '../../../store/modules/nft';
import { setSmallModalBool, setConfirmState } from '../../../store/modules/modal';

// css
import classnames from "classnames";
import LabCSS from '../../../styles/lab.module.css';
import MyInfoCSS from '../../../styles/myinfo.module.css';
import MiningCSS from '../../../styles/mining.module.css';

// data
import miningRate from "../../../src/data/chickiz/miningRate";

// chain
import Miningcontract from "../../chain/contract/Miningcontract";
import KIP37contract from '../../chain/contract/KIP37contract';
import ContractAddress from '../../../src/data/contract/ContractAddress';

// wallet
import Wallet from "../../chain/wallet/Wallet";

function MakeSuperBig() {

    const dispatch = useDispatch();

    const [selected, setSelected] = useState(null);
    const [canSuper, setCanSuper] = useState(false);
    const [txLoading, setTxLoading] = useState(false);

    const { chickiz } = useSelector((state) => state.nft);
    const { isUser, account } = useSelector((state) => state.myInfo);
    const { oliveOil } = useSelector((state) => state.nft);
    const { confirmState } = useSelector((state) => state.modal);

    const getChickiz_single = async () => {
        const mining_con = new Miningcontract();
        const _info = await mining_con.getChickizInfo(Number(selected));
        if (Number(_info._cp) < 3) {
            setCanSuper(true);
        }
    }

    useEffect(() => {
        dispatch(getSuperList());
    }, [])

    useEffect(() => {
        setCanSuper(false);
        if (selected === null) return
        getChickiz_single()
    }, [selected])

    const make_super_ask = async () => {
        if (!isUser) {
            dispatch(setSmallModalBool({ bool: true, msg: '?????? ?????? ??? ?????? ????????? ???????????????.', modalTemplate: "justAlert" }))
            return
        }
        if (oliveOil < 1) {
            dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ????????? ???????????????. ????????? ????????? ???????????? ???????????? ??? ????????????.', modalTemplate: "justAlert" }))
            return
        }

        dispatch(setSmallModalBool({ bool: true, msg: '???????????? ??? ??????????????? ????????? ??????????????????,\n?????? ????????? ????????? ???????????? ?????? ???????????????.\n(?????? ????????? ?????? ???????????? ?????? ????????? ??? ????????????.)', modalTemplate: 'confirmAlert' }))
    }

    const make_super = async () => {
        try {
            setTxLoading(true)
            let res = {};
            const oilContract = new KIP37contract(ContractAddress.oil);
            if (await oilContract.getIsApprovedForAll(account, ContractAddress.mining)) {
                res.status = true;
            } else {
                res = await oilContract.setApprovalForAll(klipPopOn, klipPopOff, account, ContractAddress.mining, true)
            }
            if (res?.status === true) {
                const minecon = new Miningcontract();
                const res1 = await minecon.makeSuperChickiz(klipPopOn, klipPopOff, account, selected);
                if (res1?.status === true) {
                    const msg = await dispatch(makeSuperRequest({ id: selected })).unwrap();
                    if (msg.msg === '????????? ?????????????????????.') {
                        dispatch(setSmallModalBool({ bool: true, msg: '?????? ???????????? ????????? ??????????????????. 5??? ????????? ????????? ???????????? ????????????, ??????????????? ??????????????????.', modalTemplate: "justAlert" }))
                        dispatch(nftFromChain(account));
                        setSelected(null)
                        return
                    }
                    dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ????????? ?????????????????????.\n??????????????? ??????????????? ???????????? ????????? ??????????????????.\n(?????? ???????????? ?????? 5?????? ????????? ????????? ??? ????????????.)', modalTemplate: "justAlert" }))
                    dispatch(nftFromChain(account));
                    setSelected(null)
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: "?????? ????????? ????????? ?????????????????????. ?????? ??????????????????.", modalTemplate: "justAlert" }))
                }
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ????????? ?????????????????????. ?????? ??????????????????.', modalTemplate: "justAlert" }))
            }
            setTxLoading(false)
        } catch (err) {
            console.error(err);
            dispatch(setSmallModalBool({ bool: true, msg: '?????? ????????? ????????? ?????????????????????. ?????? ??????????????????.', modalTemplate: "justAlert" }))
            setTxLoading(false)
        }
    }

    useEffect(() => {
        if (!confirmState) return;
        dispatch(setConfirmState({ confirmState: false }))
        make_super()
    }, [confirmState])

    // klip
    const openDetails = ([trash, x]) => {
        if (txLoading) return
        setSelected(x);
    }

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    return (
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
                        ??????????????? ?????????
                    </span>
                </div>
                <div className="pageUtilBox">
                    <div id="balloon_light" balloon="??????????????? ????????? ??????" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/a4bf92347975485bafe8eb3dc346fc98')}>
                        <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                    </div>
                </div>
            </div>
            <div className={LabCSS.superBig_Whole}>
                <div className={LabCSS.superBig_GridBox_Whole}>
                    <div className={LabCSS.superBig_GridBox}>
                        {
                            chickiz.length === 0
                                ?
                                <NoNFT url='https://opensea.io/collection/chickiz' />
                                :
                                <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid4", "mobile_grid3")}>
                                    <KIP17 nft={chickiz} nftName="chickiz" url="https://api.klaychicken.com/v2small/" openDetails={openDetails} />
                                </div>
                        }
                    </div>
                </div>
                <div className={LabCSS.superBig_SuperBox}>
                    <div className={LabCSS.superBig_changeBox}>
                        <div className={LabCSS.superBig_chickizImageBox}>
                            <div className={LabCSS.superBig_chickizImage}>
                                <Image width={512} height={512} className='image100' src={selected !== null ? `https://api.klaychicken.com/v2/image/${selected}.png` : randomChickiz} alt={`chickiz`} />
                            </div>
                            <span className={LabCSS.superBig_chickizName}>
                                Chickiz #{selected !== null ? selected : '--'}
                            </span>
                        </div>
                        <div className={LabCSS.superBig_semo} />
                        <div className={LabCSS.superBig_chickizImageBox}>
                            <div className={LabCSS.superBig_chickizImage}>
                                <Image width={512} height={512} className='image100' src={selected !== null ? `https://api.klaychicken.com/v2super/${selected}.png` : randomChickiz} alt={`chickiz`} />
                            </div>
                            <span className={LabCSS.superBig_chickizName}>
                                Super #{selected !== null ? selected : '--'}
                            </span>
                        </div>
                    </div>
                    {
                        canSuper
                            ?
                            txLoading
                                ?
                                <button className={classnames(LabCSS.superBig_Button, 'grayButton')}>
                                    <div className={MiningCSS.miningSmall_ButtonLoading}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button className={classnames(LabCSS.superBig_Button, 'purpleButton')} onClick={make_super_ask}>??????????????? ????????????</button>
                            :
                            <button className={classnames(LabCSS.superBig_Button, 'grayButton')}>??????????????? ????????????</button>
                    }
                </div>
            </div>
        </div >
    );
}

export default MakeSuperBig;