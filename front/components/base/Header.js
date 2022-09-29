import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

// css
import classnames from 'classnames';
import hamburgerCSS from "../../styles/hamburger.module.css"
import BaseCSS from "../../styles/base.module.css"

// data
import farmerRankList from '../../src/data/farm/FarmerRankList';

// images
import settingImage from '../../src/image/utils/setting.png';
import walletChangeImage from '../../src/image/utils/walletChange.png';
import copyIcon from '../../src/image/utils/copy_white.png';
import logoutIcon from '../../src/image/utils/logout.png'
import plusImage from '../../src/image/utils/plus.png';
import klaychickenLogo from '../../src/image/logo/klaychicken_allwhite.png'
import randomChickizLogo from '../../src/image/utils/randomchickiz.png'
import chickizLogo from '../../src/image/logo/chickizLogo.png';
import chickLogo from '../../src/image/chick/chick.png';
import klaytnLogo from '../../src/image/logo/klaytnLogo.png';
import logo_white from '../../src/image/logo/logo_white.svg';
import kns_symbol from '../../src/image/etc/kns_symbol.png'

import website from '../../src/image/logo/newLogo/favicon_gray.svg';
import twitter from '../../src/image/logo/newLogo/twitter_gray.svg'
import discord from '../../src/image/logo/newLogo/discord_gray.svg'
import kakaoTalk from '../../src/image/logo/newLogo/kakaotalk_gray.svg'
import opensea from '../../src/image/logo/newLogo/opensea_gray.svg'
import github from '../../src/image/logo/newLogo/github_gray.svg'

import notificationIcon from '../../src/image/utils/notification.png';

// store
import { connectWallet, getBalance, getMyInfo, getNetwork, resetMyInfo } from '../../store/modules/myInfo';
import { nftFromServer, nftFromChain, resetMyNFT } from '../../store/modules/nft';
import { resetOtherNFT, getOtherNFTBalances } from '../../store/modules/otherNft';
import { refreshNoti, refreshNotiNum, getNotificationNum } from '../../store/modules/etc';
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';

// page components
import NotificationModal from '../modal/NotificationModal';
import LoginModal from '../modal/LoginModal';
import KlipQRModal from '../modal/KlipQRModal';

import Wallet from '../chain/wallet/Wallet';
import Kaikas from '../chain/wallet/Kaikas';
import Klip from '../chain/wallet/Klip';
import KNScontract from '../chain/contract/KNScontract';

function Header() {

    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const dispatch = useDispatch();
    const router = useRouter();
    const { isUser, isFirst, account, balance, myName, myRepChickiz, myRankNum, chickBalance } = useSelector((state) => state.myInfo);
    const { chickiz } = useSelector((state) => state.nft);
    const {
        notiGuestBookNum,
        notiNeighborNum,
        notiLoveNum,
        notiAnnounceNum
    } = useSelector((state) => state.etc);
    const { klipQRModalBool } = useSelector((state) => state.klipstore);

    // modal
    const [notificationModalBool, setNotificationModalBool] = useState(false);
    const [loginModalBool, setLoginModalBool] = useState(false);

    useEffect(() => {
        const walletKind = sessionStorage.getItem('wallet_kind')

        if (walletKind === 'Kaikas') {
            login()
        }

        if (Kaikas.installed) {
            klaytn.on("networkChanged", () => window.location.reload());
        }

        if (Kaikas.installed && (walletKind === 'Kaikas' || walletKind === null)) {
            klaytn.on("accountsChanged", () => login());
        }
    }, [])

    useEffect(() => {
        if (isUser) {
            dispatch(refreshNoti())
            dispatch(refreshNotiNum())
            dispatch(getNotificationNum(account))
        }
    }, [isUser, account])

    // connect wallet but first visitor, then go to signUp
    useEffect(() => {
        if (isFirst && account !== "") router.push('/signUp');
    }, [isFirst])

    const login = useCallback(async () => {
        try {
            dispatch(resetOtherNFT());
            const res1 = await dispatch(connectWallet({ klipPopOn: klipPopOn, klipPopOff: klipPopOff })).unwrap();
            if (res1.account === "") return
            const res2 = await dispatch(getNetwork()).unwrap();

            if (res2.network === 8217) {
                dispatch(getBalance(res1.account));
                dispatch(getMyInfo(res1.account));
                dispatch(nftFromServer(res1.account));
                dispatch(nftFromChain(res1.account));
                dispatch(getOtherNFTBalances(res1.account));
            } else {
                dispatch(resetMyInfo());
                dispatch(resetMyNFT());
                dispatch(resetOtherNFT());
                alert('네트워크를 메인넷으로 변경해주세요.');
            }

        } catch (err) {
            console.error(err)
        }
    }, [])

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    // mobile menu
    const [mobileMenuBool, setMobileMenuBool] = useState(false);
    const [mobileMenuAnimateBool, setMobileAnimateMenuBool] = useState(false);

    function mobileMenuOnOff() {
        if (mobileMenuBool) {
            if (mobileMenuAnimateBool) return
            setMobileMenuBool(false);
            setMobileAnimateMenuBool(true);
            setTimeout(() => setMobileAnimateMenuBool(false), 500);
        } else {
            if (mobileMenuAnimateBool) return
            setMobileMenuBool(true);
            setMobileAnimateMenuBool(true);
            setTimeout(() => setMobileAnimateMenuBool(false), 500);
        }
    }

    // kns
    const [isKNS, setIsKNS] = useState(false)
    const [knsDomain, setKnsDomain] = useState('')

    useEffect(() => {
        if (account === "") return
        checkKNS()
    }, [account])

    async function checkKNS() {
        const KNSCon = new KNScontract();
        const _domain = await KNSCon.getDomain(account);
        if (_domain === "") {
            setIsKNS(false);
            setKnsDomain('')
        } else {
            setIsKNS(true);
            setKnsDomain(_domain);
        }
    }

    return (
        <>
            <div className={BaseCSS.header}>
                <div className={BaseCSS.headerUserInfo}>
                    {
                        account === ""
                            ?
                            <>
                                <div className={BaseCSS.userInfoLogoBoxBox}>
                                    <div className={BaseCSS.userInfoLogoBox}>
                                        <Link href="/">
                                            <a>
                                                <Image className="image100" src={klaychickenLogo} alt="" />
                                            </a>
                                        </Link>
                                    </div>
                                    <span className={BaseCSS.userInfoLogoTitle}>
                                        ChickiFarm
                                    </span>
                                </div>
                                <button className={classnames(BaseCSS.userInfoConnectButton, "greenButton")} onClick={() => setLoginModalBool(true)}>Connect Wallet</button>
                                <div className={mobileMenuBool ? classnames({ [hamburgerCSS.menuTrigger]: true, [hamburgerCSS.menuOn]: true })
                                    : hamburgerCSS.menuTrigger} onClick={mobileMenuOnOff}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </>
                            :
                            <>
                                <div className={BaseCSS.userInfoImageBox}>
                                    <Link href="/myInfo">
                                        <a>
                                            <Image width={128} height={128} className={BaseCSS.userInfoImage} src={!myRepChickiz ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${myRepChickiz}.png`} alt="" />
                                        </a>
                                    </Link>
                                </div>
                                <div className={BaseCSS.userInfoDetailsBox}>
                                    <span className={BaseCSS.userInfoAddress}>
                                        {
                                            isKNS
                                                ?
                                                <div id='balloon_light' balloon='파인더에서 보기' className={BaseCSS.userInfoKNSBox}
                                                    onClick={() => window.open(`https://klaytnfinder.io/account/${knsDomain}`)}>
                                                    <div className={BaseCSS.userInfoKNS}>
                                                        <Image className='image100' src={kns_symbol} alt='' />
                                                    </div>
                                                    {knsDomain}
                                                </div>
                                                : account
                                        }
                                    </span>
                                    <div className={BaseCSS.userInfoDetails}>
                                        <span className={BaseCSS.userInfoName}>
                                            {!myName ? "No name" : myName}
                                        </span>
                                        <div className={BaseCSS.userInfoDetails_detail}>
                                            <span className={classnames(BaseCSS.userInfoRank, farmerRankList[myRankNum].class)}>
                                                {farmerRankList[myRankNum].name}
                                            </span>
                                            <div id="balloon_light" balloon="지갑 연결 끊기" className={classnames(BaseCSS.headerUserInfoSettingBox, "neonShine")}
                                                onClick={() => { Wallet.logout() }}>
                                                <Image className="image100" src={logoutIcon} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={BaseCSS.headerNotification} onClick={() => setNotificationModalBool(true)}>
                                    <Image src={notificationIcon} alt="알림" />
                                    {
                                        notiGuestBookNum + notiNeighborNum + notiLoveNum + notiAnnounceNum > 0
                                            ?
                                            <span className={BaseCSS.headerNotification_redDot}>!</span>
                                            :
                                            null
                                    }
                                </div>
                                <div className={mobileMenuBool ? classnames({ [hamburgerCSS.menuTrigger]: true, [hamburgerCSS.menuOn]: true })
                                    : hamburgerCSS.menuTrigger} onClick={mobileMenuOnOff}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                {
                                    notificationModalBool
                                        ?
                                        <NotificationModal setModalBool={setNotificationModalBool} modalTemplate="notifications" />
                                        :
                                        null
                                }
                            </>
                    }
                </div>
                <div className={BaseCSS.headerUserWealthBox}>
                    <div className={BaseCSS.headerUserWealth}>
                        <div className={BaseCSS.headerUserWealthSymbol}>
                            <div className={BaseCSS.userInfoImage}>
                                <Image className="image100" src={chickizLogo} alt="" />
                            </div>
                        </div>
                        <div className={BaseCSS.headerUserWealthValueBox}>
                            <span className={BaseCSS.headerUserWealthValue}>
                                {chickiz.length}
                            </span>
                            <div className={classnames(BaseCSS.headerUserWealthPlus, "neonShine")}>
                                <Image className="image100" src={plusImage} alt="" onClick={() => window.open("https://opensea.io/collection/chickiz")} />
                            </div>
                        </div>
                    </div>
                    <div className={BaseCSS.headerUserWealth}>
                        <div className={BaseCSS.headerUserWealthSymbol}>
                            <div className={BaseCSS.userInfoImage}>
                                <Image className="image100" src={chickLogo} alt="" />
                            </div>
                        </div>
                        <div className={BaseCSS.headerUserWealthValueBox}>
                            <span className={BaseCSS.headerUserWealthValue}>
                                {Math.floor(chickBalance * 100) / 100}
                            </span>
                            <Link href='/bank'>
                                <div className={classnames(BaseCSS.headerUserWealthPlus, "neonShine")}>
                                    <Image className="image100" src={plusImage} alt="" />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={BaseCSS.headerUserWealth}>
                        <div className={BaseCSS.headerUserWealthSymbol}>
                            <div className={BaseCSS.userInfoImage}>
                                <Image className="image100" src={klaytnLogo} alt="" />
                            </div>
                        </div>
                        <div className={BaseCSS.headerUserWealthValueBox}>
                            <span className={BaseCSS.headerUserWealthValue}>
                                {Math.floor(balance * 100) / 100}
                            </span>
                            <div className={classnames(BaseCSS.headerUserWealthPlus, "neonShine")}>
                                <Image className="image100" src={plusImage} alt="" onClick={() => window.open("https://klayproject.notion.site/Klay-44fe188b0f4843018ff7600a250fac9d")} />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    mobileMenuBool
                        ?
                        <>
                            <div className={hamburgerCSS.menuWholeBox}>
                                <div className={hamburgerCSS.topLogo}>
                                    <div className={hamburgerCSS.topLogoIcon}>
                                        <Image src={logo_white} alt="klaychicken logo" />
                                    </div>
                                    <span className={hamburgerCSS.menuLetter}>
                                        ChickiFarm
                                    </span>
                                </div>
                                <Link href="/">
                                    <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                        HOME
                                    </span>
                                </Link>
                                {
                                    account !== ""
                                        ?
                                        <>
                                            <Link href="/farm">
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    치키농장
                                                </span>
                                            </Link>
                                            <Link href="/land">
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    치키랜드
                                                </span>
                                            </Link>
                                            <Link href={`/raffle`}>
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    래플
                                                </span>
                                            </Link>
                                            <Link href="/myInfo">
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    내정보
                                                </span>
                                            </Link>
                                            <Link href={isUser ? `/farm/${account}` : `/signUp`}>
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    내농장
                                                </span>
                                            </Link>
                                            <span className={hamburgerCSS.menuEach} onClick={() => {
                                                mobileMenuOnOff();
                                                Wallet.logout();
                                            }}>
                                                Disconnect Wallet
                                            </span>
                                        </>
                                        :
                                        <>
                                            <Link href="/farm">
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    치키농장
                                                </span>
                                            </Link>
                                            <Link href="/land">
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    치키랜드
                                                </span>
                                            </Link>
                                            <Link href={`/raffle`}>
                                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                                    래플
                                                </span>
                                            </Link>
                                            <span className={hamburgerCSS.menuEach} onClick={() => {
                                                setLoginModalBool(true);
                                                mobileMenuOnOff();
                                            }}>
                                                Connect Wallet
                                            </span>
                                        </>
                                }
                                {/* 
                            <Link href="/land">
                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                    은행
                                </span>
                            </Link>
                            <Link href="/land">
                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                    상점
                                </span>
                            </Link>
                            <Link href="/land">
                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                    미술관
                                </span>
                            </Link>
                            <Link href="/land">
                                <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                    치키학교
                                </span>
                            </Link> */}
                                <div className={hamburgerCSS.menuLink}>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://klaychicken.com')}>
                                        <Image src={website} alt="klaychicken logo" />
                                    </div>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://twitter.com/klaychicken')}>
                                        <Image src={twitter} alt="twitter logo" />
                                    </div>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://discord.com/invite/75xeBYMe9x')}>
                                        <Image src={discord} alt="discord logo" />
                                    </div>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://open.kakao.com/o/gWolPXzd')}>
                                        <Image src={kakaoTalk} alt="kakao logo" />
                                    </div>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://opensea.io/collection/chickiz')}>
                                        <Image src={opensea} alt="opensea logo" />
                                    </div>
                                    <div className={hamburgerCSS.menuIcon} onClick={() => window.open('https://github.com/klaychicken')}>
                                        <Image className="image100" src={github} alt="github logo" />
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        null
                }
                {
                    !mobileMenuBool && mobileMenuAnimateBool
                        ?
                        <div className={hamburgerCSS.menuWholeBoxGone}>
                            <div className={hamburgerCSS.topLogo}>
                                <div className={hamburgerCSS.topLogoIcon}>
                                    <Image src={logo_white} alt="klaychicken logo" />
                                </div>
                                <span className={hamburgerCSS.menuLetter}>
                                    ChickiFarm
                                </span>
                            </div>
                            <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                HOME
                            </span>
                            {
                                isUser
                                    ?
                                    <>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            치키농장
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            치키랜드
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            래플
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            내정보
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            내농장
                                        </span>
                                        <span className={hamburgerCSS.menuEach} >
                                            Disconnect Wallet
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            치키농장
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            치키랜드
                                        </span>
                                        <span className={hamburgerCSS.menuEach} onClick={mobileMenuOnOff}>
                                            래플
                                        </span>
                                        <span className={hamburgerCSS.menuEach} >
                                            Connect Wallet
                                        </span>
                                    </>
                            }
                            <div className={hamburgerCSS.menuLink}>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={website} alt="klaychicken logo" />
                                </div>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={twitter} alt="klaychicken logo" />
                                </div>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={discord} alt="klaychicken logo" />
                                </div>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={kakaoTalk} alt="klaychicken logo" />
                                </div>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={opensea} alt="klaychicken logo" />
                                </div>
                                <div className={hamburgerCSS.menuIcon}>
                                    <Image src={github} alt="klaychicken logo" />
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div >
            {
                loginModalBool
                    ?
                    <LoginModal setModalBool={setLoginModalBool} />
                    :
                    null
            }
            {
                klipQRModalBool
                    ?
                    <KlipQRModal />
                    :
                    null
            }
        </>
    );
}

export default Header;
