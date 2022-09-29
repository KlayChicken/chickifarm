import { useDispatch } from 'react-redux';
import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo';

// page components
import SmallModal from '../../components/modal/SmallModal'

// css
import classnames from 'classnames';
import labCSS from '../../styles/lab.module.css';

// images
import chickiDex from '../../src/image/chick/chickiDex.png';
import eatChickiz from '../../src/image/chick/eatChickiz.png';
import eatChickizGray from '../../src/image/chick/eatChickizGray.png';
import makeSuper from '../../src/image/chick/makeSuper.png';
import makeSuperGray from '../../src/image/chick/makeSuperGray.png';
import mineChickiz from '../../src/image/chick/mineChickiz.png';

// store
import { setSmallModalBool } from '../../store/modules/modal';

function Chick() {
    const dispatch = useDispatch();

    return (
        <>
            <NextSeo
                title='ChickiFarm :: 치키연구소'
                description='치키즈와 $CHICK을 활용해보세요.'
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/lab',
                    title: '치키농장 :: 치키연구소',
                    description: '치키즈와 $CHICK을 활용해보세요.'
                }}
            />
            <div className="mainBoard lab_index_mobile">
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
                                치키연구소
                            </span>
                        </div>
                    </div>
                    <div className={labCSS.chickDiv}>
                        <Link href="/lab/mining">
                            <div className={labCSS.chickBox}>
                                <div className={labCSS.chickImage}>
                                    <Image className="image100" src={mineChickiz} alt="mine" />
                                </div>
                                <div className={labCSS.chickDetail}>
                                    <div className={labCSS.chickName_pink}>
                                        채굴하기
                                    </div>
                                    <span className={labCSS.chickDesc}>
                                        채굴채굴 치키즈 열일을 한다~<br />
                                        치키즈를 튀겨보자!
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <Link href="/rarity">
                            <div className={labCSS.chickBox}>
                                <div className={labCSS.chickImage}>
                                    <Image className="image100" src={chickiDex} alt="chickiDex" />
                                </div>
                                <div className={labCSS.chickDetail}>
                                    <div className={labCSS.chickName_indigo}>
                                        치키도감
                                    </div>
                                    <span className={labCSS.chickDesc}>
                                        치키즈의 모든 것은 이곳에!<br />
                                        모든 치키즈를 보는 백과사전
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <Link href="/lab/makeSuper">
                            <div className={labCSS.chickBox}>
                                <div className={labCSS.chickImage}>
                                    <Image className="image100" src={makeSuper} alt="makeSuper" />
                                </div>
                                <div className={labCSS.chickDetail}>
                                    <div className={labCSS.chickName_yellow}>
                                        슈퍼치키즈 만들기
                                    </div>
                                    <span className={labCSS.chickDesc}>
                                        내 안의 야수가 깨어난다..<br />
                                        슈퍼치키즈가 탄생되는 공방
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div className={classnames(labCSS.chickBox, labCSS.chickBox_gray)}
                            onClick={() => dispatch(setSmallModalBool({ bool: true, msg: "준비중입니다.", modalTemplate: "justAlert" }))}>
                            <div className={labCSS.chickImage}>
                                <Image className="image100" src={eatChickizGray} alt="eatChickiz" />
                            </div>
                            <div className={labCSS.chickDetail}>
                                <div className={labCSS.chickName_Gray}>
                                    치키즈 먹기
                                </div>
                                <span className={labCSS.chickDesc}>
                                    오늘의 메뉴는 치키즈..?<br />
                                    내 치키즈를 요리하는 소각장
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chick;