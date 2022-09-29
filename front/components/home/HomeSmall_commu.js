import { useState } from 'react';
import Image from 'next/image'

// page components
import UtilModal from '../modal/UtilModal';

// sns logo
import twitterIcon from "../../src/image/logo/snsLogo/color/twitter.png";
import discordIcon from "../../src/image/logo/snsLogo/color/discord.png";
import kakaoIcon from "../../src/image/logo/snsLogo/color/kakao.png";
import eventIcon from "../../src/image/utils/event.png";
import archiveIcon from "../../src/image/utils/archive.png";
import chickenIcon from "../../src/image/utils/delchicken.png";
import guideIcon from '../../src/image/utils/guide.png';

// styles
import HomeCSS from '../../styles/Home.module.css';

function HomeSmall_commu() {

    // modal
    const [utilModalBool, setUtilModalBool] = useState(false);

    return (
        <div className={HomeCSS.homeCommunicationBox}>
            <span className={HomeCSS.homeUtilBoxSubtitle}>
                링크 모음
            </span>
            <div className={HomeCSS.homeCommunication}>
                <div className={HomeCSS.homeCommunicationGrid}>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://klayproject.notion.site/60b5cbae6f9b49acabbe301e2865c42b")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={guideIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            가이드
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://twitter.com/klaychicken")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={twitterIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            트위터
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://discord.gg/75xeBYMe9x")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={discordIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            디스코드
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://open.kakao.com/o/gWolPXzd")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={kakaoIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            오픈톡방1
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://open.kakao.com/o/gPaBIrTd")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={kakaoIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            오픈톡방2
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://klayproject.notion.site/EVENT-LIST-6979934b35cb444295148eff2de7abfb")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={eventIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            이벤트
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => window.open("https://klayproject.notion.site/e7fa92559df341e1be652c5166df9ffc")}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={archiveIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            자료실
                        </span>
                    </div>
                    <div className={HomeCSS.homeCommunicationGridEachBox} onClick={() => setUtilModalBool(true)}>
                        <div className={HomeCSS.homeComuIconBox}>
                            <Image className="image100" src={chickenIcon} alt="" />
                        </div>
                        <span className={HomeCSS.homeComuIconTag}>
                            치킨추첨기
                        </span>
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
    )
}

export default HomeSmall_commu;