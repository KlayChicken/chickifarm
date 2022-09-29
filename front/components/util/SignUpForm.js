import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import useInput from '../../hooks/useInput';

// util components
import caver from '../chain/CaverChrome'
import Wallet from '../chain/wallet/Wallet';

// images
import signUpBack from '../../src/image/etc/signUpImage.png'

// stores
import { connectWallet, getMyInfo, getNetwork, checkName, signUp } from '../../store/modules/myInfo';
import { setSmallModalBool } from '../../store/modules/modal';

// page components
import LoginModal from '../modal/LoginModal';

// css
import classnames from 'classnames';
import UtilCSS from '../../styles/util.module.css';

function SignUpForm() {

    const { account, network } = useSelector((state) => state.myInfo);

    const dispatch = useDispatch();
    const router = useRouter();
    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const [chickenLove, setChickenLove] = useState(false);
    const [userName, onChangeUserName] = useInput("");

    // modal
    const [loginModalBool, setLoginModalBool] = useState(false);

    async function createUser() {
        if (chickenLove !== true) {
            dispatch(setSmallModalBool({ bool: true, msg: "아쉽지만 치킨을 사랑하지 않는 사람은 농장에 입주할 수 없어요.", modalTemplate: "justAlert" }));
            return;
        }
        try {
            const res = await dispatch(checkName(userName)).unwrap()
            if (!res.bool) {
                dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }));
                return
            } else {
                if (account === "") {
                    setLoginModalBool(true)
                    return
                }
                const res3 = await dispatch(getNetwork()).unwrap();
                if (res3.network !== 8217) {
                    dispatch(setSmallModalBool({ bool: true, msg: "네트워크를 메인넷으로 변경해주세요.", modalTemplate: "justAlert" }));
                    return;
                }
                const sign = await Wallet.signMessage("createUser");
                const res2 = await dispatch(signUp({ account: account, name: userName, sign: sign })).unwrap();
                dispatch(setSmallModalBool({ bool: true, msg: res2.msg, modalTemplate: "justAlert" }));
                dispatch(getMyInfo(account));
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className={UtilCSS.signUpPageWhole}>
                <div className={UtilCSS.signUpPageSmallBoxTransparent}>
                    <div className={UtilCSS.signUpWelcomeBox}>
                        <span className={UtilCSS.signUpPageWelcome}>
                            치키 농장에 처음으로 방문해주셨군요?
                        </span>
                        <span className={UtilCSS.signUpPageWelcome}>
                            농장에서 이용할 이름을 입력하고,
                        </span>
                        <span className={UtilCSS.signUpPageWelcome}>
                            우측의 입주신청서를 제출해주세요.
                        </span>
                    </div>
                </div>
                <div className={UtilCSS.signUpPageSmallBox}>
                    <span className={UtilCSS.signUpHeader}>
                        입주 신청서
                    </span>
                    <div className={UtilCSS.signUpCheckChickenLover}>
                        <span className={UtilCSS.signUpQuestion}>당신은 치킨을 사랑합니까?</span>
                        <div className={UtilCSS.signUpCheckWholeBox}>
                            <span className={UtilCSS.signUpTag}>
                                네
                            </span>
                            <input id="signUpCheckChickenLovers" className={UtilCSS.signUpCheck} type="checkbox" onChange={(e) => { setChickenLove(e.target.checked) }} />
                            <span className={UtilCSS.signUpTag}>
                                아니오
                            </span>
                            <input id="signUpCheckChickenLovers" className={UtilCSS.signUpCheck} type="checkbox" disabled={true} />

                        </div>
                    </div>
                    <div className={UtilCSS.signUpInputBox}>
                        <input id="signUpUserNameChange" className={UtilCSS.signUpInput} type="text" minLength={2} maxLength={12} placeholder='닉네임 입력' autoComplete="off" onChange={onChangeUserName} />
                        <span className={UtilCSS.signUpCaution}>
                            * 특수문자, 기호 및 공백은 사용할 수 없습니다.<br />
                            * 한글은 2~8자, 영문은 3~12자로 설정해주세요.
                        </span>
                        <button className={classnames(UtilCSS.signUpSubmit, "greenButton")} onClick={() => createUser()}>
                            제출하기
                        </button>

                    </div>
                </div>
                <div className={UtilCSS.signUpImage}>
                    <Image width={3440} height={2400} src={signUpBack} alt="" />
                </div>
            </div>
            {
                loginModalBool
                    ?
                    <LoginModal setModalBool={setLoginModalBool} />
                    :
                    null
            }
        </>
    );
}

export default SignUpForm;