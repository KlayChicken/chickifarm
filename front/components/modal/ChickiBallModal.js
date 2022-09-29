import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classnames from 'classnames';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import discordIcon from "../../src/image/logo/snsLogo/color/discord.png";
import kakaoIcon from "../../src/image/logo/snsLogo/color/kakao.png";

// css
import modalCSS from '../../styles/modal.module.css';

function ChickiBallModal(props) {

    const [modalTemplate, setModalTemplate] = useState(null);

    const router = useRouter();

    useEffect(() => {
        setModalTemplate(props.modalTemplate)
    }, [props.modalTemplate])

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => props.setModalBool(false)}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.modalContent}>
                    {
                        {
                            "howToPlay":
                                <>
                                    <div className={modalCSS.chickiballHowToPlayBox}>
                                        <span className={modalCSS.chickiballHowToPlayTitle}>
                                            '치키볼'은 7번의 시도 안에 네 자리 숫자를 찾는 게임입니다.
                                        </span>
                                        <div className={modalCSS.chickiballExBox}>
                                            <span className={modalCSS.chickiballExTitle}>
                                                Ex) 정답이 '1234'일 때
                                            </span>
                                            <span className={modalCSS.chickiballExSpan}>
                                                - 위치와 숫자가 맞으면 Strike
                                            </span>
                                            <div className={modalCSS.chickiballExImage}>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    1
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    5
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    6
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    7
                                                </span>
                                                <span className={modalCSS.chickiballExImageResult1}>
                                                    1S
                                                </span>
                                            </div>
                                            <span className={modalCSS.chickiballExSpan}>
                                                - 숫자만 맞고 위치가 틀리면 Ball
                                            </span>
                                            <div className={modalCSS.chickiballExImage}>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    4
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    5
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    6
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    7
                                                </span>
                                                <span className={modalCSS.chickiballExImageResult2}>
                                                    1B
                                                </span>
                                            </div>
                                            <span className={modalCSS.chickiballExSpan}>
                                                - 모두 틀리면 Out 입니다.
                                            </span>
                                            <div className={modalCSS.chickiballExImage}>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    5
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    6
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    7
                                                </span>
                                                <span className={modalCSS.chickiballExImageTry}>
                                                    8
                                                </span>
                                                <span className={modalCSS.chickiballExImageResult3}>
                                                    OUT
                                                </span>
                                            </div>
                                        </div>
                                        <span className={modalCSS.chickiballHowToPlayFooter}>
                                            치키볼은 매일 한 번만 할 수 있습니다. 행운을 빕니다!
                                        </span>
                                    </div>
                                </>,
                            "howToRecord":
                                <div className={modalCSS.chickiballHTRBox}>
                                    <div className={modalCSS.chickiballHTRTitle}>
                                        Q: 기록을 남기려면 어떻게 해야하나요?
                                    </div>
                                    <div className={modalCSS.chickiballHTRDes}>
                                        <span className={modalCSS.chickiballDesSpan}> 1️⃣ Kaikas / Klip(모바일) 지갑을 연결하세요.</span>
                                        <span className={modalCSS.chickiballDesSpan}>2️⃣ 입주신청서를 작성하여 농장을 개설하세요.</span>
                                        <span className={modalCSS.chickiballDesSpan}> 3️⃣ 이제 치키볼을 플레이한 기록이 저장됩니다!</span>
                                        <span className={modalCSS.chickiballDesSpan}> 4️⃣ 높은 점수를 획득하고 랭킹에 도전하세요 😎</span>
                                    </div>
                                    <div className={modalCSS.chickiballHTRFooter}>
                                        <span className={modalCSS.chickiballDesSpan}><a href="https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi?hl=ko" target="_blank" rel="noreferrer"> * PC: <span className={modalCSS.linkDes}>Kaikas 다운로드 바로가기</span></a></span>
                                        <span className={modalCSS.chickiballDesSpan}><a href="https://klipwallet.com/" target="_blank" rel="noreferrer"> * 모바일: <span className={modalCSS.linkDes}>Klip 실행 바로가기</span></a></span>
                                        <button className={classnames(modalCSS.chickiballHTRButton, modalCSS.greenButton)}
                                            onClick={() => router.push('/signUp')}>지갑 연결하기</button>
                                    </div>
                                </div>,
                            "findBug":
                                <>
                                    <div className={modalCSS.bugBox}>
                                        <div className={modalCSS.chickiballHTRTitle}>
                                            Contact Us
                                        </div>
                                        <div className={modalCSS.chickiballFAQ}>
                                            <div className={modalCSS.chickiballFAQBox}>
                                                <div className={modalCSS.chickiballFAQEach} onClick={() => window.open("https://discord.gg/75xeBYMe9x")}>
                                                    <Image className="image100" src={discordIcon} alt="" />
                                                </div>
                                                <div className={modalCSS.chickiballFAQEach} onClick={() => window.open("https://open.kakao.com/o/gWolPXzd")}>
                                                    <Image className="image100" src={kakaoIcon} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={modalCSS.chickiballHTRFooter}>
                                            <span className={modalCSS.chickiballDesSpan}>E-mail: klaychicken@gmail.com</span>
                                        </div>
                                    </div>
                                </>,
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default ChickiBallModal;