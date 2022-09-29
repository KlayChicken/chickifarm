import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

import statIcon_white from '../../src/image/utils/stat_white.png';
import statIcon_yellow from '../../src/image/utils/stat_yellow.png';
import rankingIcon_white from '../../src/image/utils/ranking_white.png';
import rankingIcon_yellow from '../../src/image/utils/ranking_yellow.png';
import congratImg from '../../src/image/chickiball/nbCongrat.png';
import failImg from '../../src/image/chickiball/nbFail.png';

// page components
import ChickiBall_Ranking from '../../components/land/chickiball/ChickiBall_Ranking';
import ChickiBall_Game from '../../components/land/chickiball/ChickiBall_Game';
import ChickiBall_Record from '../../components/land/chickiball/ChickiBall_Record';
import ChickiBallModal from '../../components/modal/ChickiBallModal';

// css
import classnames from 'classnames';
import LandCSS from '../../styles/land.module.css';

function ChickiBall() {

    // mobile
    const [mobileDisplay, setMobileDisplay] = useState(2);

    // modal
    const [congratModalBool, setCongratModalBool] = useState(false);
    const [failModalBool, setFailModalBool] = useState(false);
    const [chickiballModalBool, setChickiballModalBool] = useState(false);

    useEffect(() => {
        const isFirst = localStorage.getItem("chickiball_first")
        if (isFirst !== 'false') {
            setChickiballModalBool(true);
        }
    }, [])

    function congratModalOn() {
        if (congratModalBool) return;
        setCongratModalBool(true);
        setTimeout(() => setCongratModalBool(false), 3000);
    }

    function failModalOn() {
        if (failModalBool) return;
        setFailModalBool(true);
        setTimeout(() => setFailModalBool(false), 3000);
    }

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 치키볼"
                description="네 자리 숫자 치키볼을 찾아보세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/land/chickiball',
                    title: '치키볼',
                    description: "네 자리 숫자 치키볼을 찾아보세요.",
                }}
            />
            <div className={LandCSS.nbMobileHeader}>
                <div className={LandCSS.nbMobileIconBox} onClick={() => setMobileDisplay(1)}>
                    <div className={LandCSS.nbMobileIcon}>
                        <Image className="image100" src={mobileDisplay === 1 ? rankingIcon_yellow : rankingIcon_white} alt="" />
                    </div>
                </div>
                <span className={mobileDisplay === 2 ? LandCSS.nbMobileTitle_selected : LandCSS.nbMobileTitle} onClick={() => setMobileDisplay(2)}>
                    치키볼
                </span>
                <div className={LandCSS.nbMobileIconBox} onClick={() => setMobileDisplay(3)}>
                    <div className={LandCSS.nbMobileIcon}>
                        <Image className="image100" src={mobileDisplay === 3 ? statIcon_yellow : statIcon_white} alt="" />
                    </div>
                </div>
            </div>
            <div className={classnames("mainBoard", "chickiball_mobile")}>
                <div className="subBoard_3" id={mobileDisplay === 1 ? "mobile_on" : "mobile_off"}>
                    <ChickiBall_Ranking />
                </div>
                <div className="subBoard_small" id={mobileDisplay === 2 ? "mobile_on" : "mobile_off"}>
                    <ChickiBall_Game setMobileDisplay={setMobileDisplay} congratModalOn={congratModalOn} failModalOn={failModalOn} />
                </div >
                <div className="subBoard_3" id={mobileDisplay === 3 ? "mobile_on" : "mobile_off"}>
                    <ChickiBall_Record setMobileDisplay={setMobileDisplay} />
                </div>
                {
                    chickiballModalBool
                        ?
                        <ChickiBallModal setModalBool={setChickiballModalBool} modalTemplate="howToPlay" />
                        :
                        null
                }
            </div >
            {
                congratModalBool &&
                <div className={LandCSS.nbEndModal}>
                    <Image priority={true} className="image100" src={congratImg} alt="" />
                </div>
            }
            {
                failModalBool &&
                <div className={LandCSS.nbEndModal}>
                    <Image priority={true} className="image100" src={failImg} alt="" />
                </div>
            }
        </>
    );
}



export default ChickiBall;