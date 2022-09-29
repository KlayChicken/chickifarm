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
                dispatch(setSmallModalBool({ bool: true, msg: "닉네임 중복 확인이 필요합니다.", modalTemplate: "justAlert" }))
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
                            내 정보
                        </span>
                    </Link>
                </div>
                <div className="pageUtilBox">
                    {/*
            <div className="pageUtilIconBox">
                <img className="pageUtilIcon" src={settingIcon} alt="설정"></img>
            </div>
            */}
                    <button className="pageUtilSubmit greenButton" onClick={() => updateUserInfo()}>
                        저장하기
                    </button>
                </div>
            </div>
            <div className="pageContentBox">
                <div className="userInfoWholeBox">
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            닉네임
                        </span>
                        <input className={MyInfoCSS.userInfoInputForName} type="text" minLength={2} maxLength={12}
                            placeholder='닉네임 입력' value={nickname} autoComplete="off" onChange={(e) => { onChangeNickname(e); setCanChangeName(false); }} />
                        <button className={classnames(MyInfoCSS.userInfoCheckButton, "purpleButton")} onClick={() => checkMyName()}>
                            중복 확인
                        </button>
                    </div>
                    <span className={MyInfoCSS.userInfoCaution}>
                        * 특수문자, 기호 및 공백은 사용할 수 없습니다.<br />
                        * 한글은 2~8자, 영문은 3~12자로 설정해주세요.<br />
                        * 중복 확인 버튼을 통해 이용 가능한 닉네임인지 확인해주세요.<br />
                        * 미풍양속을 해하는 닉네임은 예고 없이 변경될 수 있습니다.
                    </span>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            주소
                        </span>
                        <span className={MyInfoCSS.userInfoNotChange}>
                            {account}
                            <CopyToClipboard text={account}>
                                <div id="balloon_light" balloon="지갑 주소 복사" className={classnames(MyInfoCSS.userInfoAddressCopy, "neonShine")}
                                    onClick={function () {
                                        dispatch(setSmallModalBool({ bool: true, msg: `지갑 주소가 복사되었습니다.`, modalTemplate: "justAlert" }))
                                    }}>
                                    <Image className='image100' src={copyIcon} alt="copy" />
                                </div>
                            </CopyToClipboard>
                        </span>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            트위터
                        </span>
                        <input className={MyInfoCSS.userInfoInput} type="text" minLength={2} maxLength={20} placeholder='@뒤에 입력' value={twitter !== null ? twitter : ""} autoComplete="off" onChange={onChangeTwitter} />
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            소개글
                        </span>
                        <textarea className={MyInfoCSS.userInfoTextArea} type="text" minLength={0} maxLength={100} placeholder='100자 이내' value={intro !== null ? intro : ""} autoComplete="off" onChange={onChangeIntro} />
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            대표 치키즈
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <div className={MyInfoCSS.userInfoRepChickiz}>
                                <Image width={64} height={64} className="image100" src={repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${repChickiz}.png`} alt="" />
                            </div>
                            <span className={MyInfoCSS.userInfoRepChickizSpan}>
                                {!repChickiz
                                    ?
                                    "당신의 치키즈는?"
                                    :
                                    `# ${repChickiz}`
                                }
                            </span>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => setRepModalBool(true)}>치키즈 선택하기</button>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            내 팻말
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <div className={MyInfoCSS.userInfoFarmSign}>
                                {farmSign === null
                                    ? null
                                    : <Image width={150} height={65} className="image100" src={`https://api.klaychicken.com/sign/image/${myFarmSign}.png`} alt="" />
                                }
                            </div>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => setSignModalBool(true)}>팻말 선택하기</button>
                    </div>
                    <div className="pageContentSub">
                        <span className={MyInfoCSS.userInfoTag}>
                            직급
                        </span>
                        <div className={MyInfoCSS.userInfoRepChickizBox}>
                            <span className={classnames(MyInfoCSS.userInfoRankName, farmerRankList[myRankNum].class)}>
                                {farmerRankList[myRankNum].name}
                            </span>
                            <div id="balloon_light" balloon="직급 상세 보기" className={MyInfoCSS.myFarmSkinIconBox} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_white} alt="" /></div>
                        </div>
                        <button className={classnames(MyInfoCSS.userInfoRepButton, "purpleButton")} onClick={() => router.push(`/farm/${account}`)} >내 농장 가기</button>
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