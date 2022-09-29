import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo';

// page components
import UtilModal from '../../components/modal/UtilModal';

// css
import classnames from 'classnames';
import landCSS from '../../styles/land.module.css';
import labCSS from '../../styles/lab.module.css';

// images
import chickiball from '../../src/image/land/chickiball.png';
import discord from '../../src/image/land/discordGame.png';
import roulette from '../../src/image/land/roulette.png';

import chickiRoulette from '../../src/image/land/chickiroulette.png';
import chickiRouletteGray from '../../src/image/land/chickirouletteGray.png';

// store
import { setSmallModalBool } from '../../store/modules/modal';

function LandPage() {
    const dispatch = useDispatch();

    // modal
    const [utilModalBool, setUtilModalBool] = useState(false);

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 치키랜드"
                description="환상의 나라 치키랜드로 오세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/land',
                    title: '치키농장 :: 치키랜드',
                    description: "환상의 나라 치키랜드로 오세요.",
                }}
            />
            <div className="mainBoard land_mobile">
                <div className="subBoard_whole">
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
                            <span className="pageTitle">
                                치키랜드
                            </span>
                        </div>
                    </div>
                    <div className={labCSS.chickDiv}>
                        <Link href="/land/chickiball">
                            <div className={labCSS.chickBox}>
                                <div className={labCSS.chickImage}>
                                    <Image className="image100" src={chickiball} alt="mine" />
                                </div>
                                <div className={labCSS.chickDetail}>
                                    <div className={labCSS.chickName_pink}>
                                        치키볼
                                    </div>
                                    <span className={labCSS.chickDesc}>
                                        내 치키즈는 홈런왕!<br />
                                        그 시절 추억의 숫자야구
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div className={labCSS.chickBox} onClick={() => window.open('https://discord.gg/vHD2mZzB8c')}>
                            <div className={labCSS.chickImage}>
                                <Image className="image100" src={discord} alt="chickiDex" />
                            </div>
                            <div className={labCSS.chickDetail}>
                                <div className={labCSS.chickName_indigo}>
                                    디스코드 미니게임
                                </div>
                                <span className={labCSS.chickDesc}>
                                    게임만 하면 상품이?<br />
                                    치킨과 NFT가 내손에!
                                </span>
                            </div>
                        </div>
                        <div className={labCSS.chickBox} onClick={() => setUtilModalBool(true)}>
                            <div className={labCSS.chickImage}>
                                <Image className="image100" src={roulette} alt="makeSuper" />
                            </div>
                            <div className={labCSS.chickDetail}>
                                <div className={labCSS.chickName_yellow}>
                                    치킨 추첨기
                                </div>
                                <span className={labCSS.chickDesc}>
                                    치킨은 쉽고 선택은 어렵다..<br />
                                    오늘밤 나를 위한 치킨은?
                                </span>
                            </div>
                        </div>
                        <div className={classnames(labCSS.chickBox, labCSS.chickBox_gray)}
                            onClick={() => dispatch(setSmallModalBool({ bool: true, msg: "준비중입니다.", modalTemplate: "justAlert" }))}>
                            <div className={labCSS.chickImage}>
                                <Image className="image100" src={chickiRouletteGray} alt="eatChickiz" />
                            </div>
                            <div className={labCSS.chickDetail}>
                                <div className={labCSS.chickName_Gray}>
                                    치키 룰렛
                                </div>
                                <span className={labCSS.chickDesc}>
                                    오늘 나의 운세는...<br />
                                    룰렛을 돌려 상품을 노리자!
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    utilModalBool
                        ?
                        <UtilModal setModalBool={setUtilModalBool} modalTemplate="roulette" />
                        :
                        null
                }
            </div>
        </>
    )
}

export default LandPage;