import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import CopyToClipboard from 'react-copy-to-clipboard';

import axios from 'axios';

import useInput from '../../hooks/useInput';

// util components
import caver from '../chain/CaverChrome';
import Wallet from '../chain/wallet/Wallet';

// page components
import SelectModal from '../modal/SelectModal';
import UtilModal from '../modal/UtilModal';

// data
import farmerRankList from '../../src/data/farm/FarmerRankList';

// images
import randomChickizLogo from "../../src/image/utils/randomchickiz.png";
import questionIcon_white from "../../src/image/utils/question_white.png";
import copyIcon from '../../src/image/utils/copy_white.png';

// store
import { login_kaikas, get_balance, getMyInfo, checkName, updateUinfo } from '../../store/modules/myInfo';
import { getUserInfo } from '../../store/modules/userInfo';
import { setSmallModalBool } from '../../store/modules/modal';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css'

function MyInfoSmall() {
    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const dispatch = useDispatch();
    const router = useRouter();
    const { account, myName,
        myIntro, myRepChickiz, myTwitter,
        myFarmSign, myRankNum } = useSelector((state) => state.myInfo);
    const { chickiz, sign } = useSelector((state) => state.nft);

    // userInfo
    const [nickname, onChangeNickname] = useInput(myName);
    const [twitter, onChangeTwitter] = useInput(myTwitter);
    const [intro, onChangeIntro] = useInput(myIntro);

    const [repChickiz, setRepChickiz] = useState(myRepChickiz);
    const [farmSign, setFarmSign] = useState(myFarmSign);

    // modal
    const [repModalBool, setRepModalBool] = useState(false);
    const [signModalBool, setSignModalBool] = useState(false);
    const [utilModalBool, setUtilModalBool] = useState(false);

    // checkName
    const [canChangeName, setCanChangeName] = useState(false);


    async function checkMyName() {
        try {
            const res = await dispatch(checkName(nickname)).unwrap();

            if (res.bool) {
                setCanChangeName(true)
            } else {
                setCanChangeName(false)
            }

            dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }))
        } catch (err) {
            console.log(err)
        }
    }


    async function updateUserInfo() {
        try {
            if (canChangeName || nickname === myName) {
                const sign = await Wallet.signMessage("updateUinfo")
                const res = await dispatch(updateUinfo(
                    {
                        account: account,
                        nickname: nickname,
                        twitter: twitter,
                        intro: intro,
                        repChickiz: repChickiz,
                        farmSign: farmSign,
                        sign: sign
                    }
                )).unwrap();
                dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }))
                setCanChangeName(false);
                dispatch(getMyInfo(account));
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: "????????? ?????? ????????? ???????????????.", modalTemplate: "justAlert" }))
            }
        } catch (err) {
            console.log(err)
        }
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
                    <Link href="/myInfo">
                        <span className="pageTitle">
                            ??? ??????
                        </span>
                    </Link>
                </div>
                <div className="pageUtilBox">
                    {/*
            <div className="pageUtilIconBox">
                <img className="pageUtilIcon" src={settingIcon} alt="??????"></img>
            </div>
            */}
                    <button className="pageUtilSubmit greenButton" onClick={() => updateUserInfo()}>
                        ????????????
                    </button>
                </div>
            </div>
            <div className="pageContentBox">
                <div className="userInfoWholeBox">
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ?????????
                        </span>
                        <input className={MyInfoCSS.userInfoInputForName} type="text" minLength={2} maxLength={12}
                            placeholder='????????? ??????' value={nickname} autoComplete="off" onChange={(e) => { onChangeNickname(e); setCanChangeName(false); }} />
                        <button className={classnames(MyInfoCSS.userInfoCheckButton, "purpleButton")} onClick={() => checkMyName()}>
                            ?????? ??????
                        </button>
                    </div>
                    <span className={MyInfoCSS.userInfoCaution}>
                        * ????????????, ?????? ??? ????????? ????????? ??? ????????????.<br />
                        * ????????? 2~8???, ????????? 3~12?????? ??????????????????.<br />
                        * ?????? ?????? ????????? ?????? ?????? ????????? ??????????????? ??????????????????.<br />
                        * ??????????????? ????????? ???????????? ?????? ?????? ????????? ??? ????????????.
                    </span>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ??????
                        </span>
                        <span className={MyInfoCSS.userInfoNotChange}>
                            {account}
                            <CopyToClipboard text={account}>
                                <div id="balloon_light" balloon="?????? ?????? ??????" className={classnames(MyInfoCSS.userInfoAddressCopy, "neonShine")}
                                    onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: `?????? ????????? ?????????????????????.`, modalTemplate: "justAlert" }))
                                    }}>
                                    <Image className='image100' src={copyIcon} alt="copy" />
                                </div>
                            </CopyToClipboard>
                        </span>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ?????????
                        </span>
                        <input className={MyInfoCSS.userInfoInput} type="text" minLength={2} maxLength={20} placeholder='@?????? ??????' value={twitter !== null ? twitter : ""} autoComplete="off" onChange={onChangeTwitter} />
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ?????????
                        </span>
                        <textarea className={MyInfoCSS.userInfoTextArea} type="text" minLength={0} maxLength={100} placeholder='100??? ??????' value={intro !== null ? intro : ""} autoComplete="off" onChange={onChangeIntro} />
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ?????? ?????????
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <div className={MyInfoCSS.userInfoRepChickiz}>
                                <Image width={64} height={64} className="image100" src={repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${repChickiz}.png`} alt="" />
                            </div>
                            <span className={MyInfoCSS.userInfoRepChickizSpan}>
                                {!repChickiz
                                    ?
                                    "????????? ?????????????"
                                    :
                                    `# ${repChickiz}`
                                }
                            </span>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => setRepModalBool(true)}>????????? ????????????</button>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ??? ??????
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <div className={MyInfoCSS.userInfoFarmSign}>
                                {farmSign === null
                                    ? null
                                    : <Image width={150} height={65} className="image100" src={`https://api.klaychicken.com/sign/image/${myFarmSign}.png`} alt="" />
                                }
                            </div>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => setSignModalBool(true)}>?????? ????????????</button>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            ??????
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <span className={classnames(MyInfoCSS.userInfoRankName, farmerRankList[myRankNum].class)}>
                                {farmerRankList[myRankNum].name}
                            </span>
                            <div id="balloon_light" balloon="?????? ?????? ??????" className={MyInfoCSS.myFarmSkinIconBox} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_white} alt="" /></div>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => router.push(`/farm/${account}`)} >??? ?????? ??????</button>
                    </div>
                </div>
            </div>
            {
                repModalBool
                    ?
                    <SelectModal setModalBool={setRepModalBool} setRepChickiz={setRepChickiz} chickiz={chickiz} modalTemplate="repChickiz" />
                    :
                    null
            }
            {
                signModalBool
                    ?
                    <SelectModal setModalBool={setSignModalBool} setFarmSign={setFarmSign} farmSign={sign} modalTemplate="farmSign" />
                    :
                    null
            }
            {
                utilModalBool
                    ?
                    <UtilModal setModalBool={setUtilModalBool} modalTemplate="farmQuestion" />
                    :
                    null
            }
        </>
    )
}

export default MyInfoSmall;