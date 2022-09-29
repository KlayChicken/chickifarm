import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import classnames from 'classnames';

import Wallet from '../chain/wallet/Wallet';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import klipLogo from "../../src/image/utils/klip.svg";
import klaytnLogo from "../../src/image/utils/klaytnLogo.png";

// store
import { connectWallet, getBalance, getMyInfo, getNetwork, resetMyInfo } from '../../store/modules/myInfo';
import { resetOtherNFT, getOtherNFTBalances } from '../../store/modules/otherNft';
import { nftFromServer, nftFromChain, resetMyNFT } from '../../store/modules/nft';
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { setSmallModalBool } from '../../store/modules/modal';

// css
import modalCSS from '../../styles/modal.module.css';

function LoginModal(props) {

    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const dispatch = useDispatch();

    const login = useCallback(async () => {
        try {
            const res1 = await dispatch(connectWallet({ klipPopOn: klipPopOn, klipPopOff: klipPopOff })).unwrap();
            if (res1.account === "") return
            const res2 = await dispatch(getNetwork()).unwrap();

            if (res2.network === 8217) {
                dispatch(getBalance(res1.account))
                dispatch(getMyInfo(res1.account))
                dispatch(nftFromServer(res1.account))
                dispatch(nftFromChain(res1.account))
                dispatch(getOtherNFTBalances(res1.account));
            } else {
                dispatch(resetMyInfo())
                dispatch(resetMyNFT())
                dispatch(resetOtherNFT());
                dispatch(setSmallModalBool({ bool: true, msg: '네트워크를 메인넷으로 변경해주세요.', modalTemplate: "justAlert" }));
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

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => props.setModalBool(false)}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.loginModalTitleBox}>
                    <span className={modalCSS.loginModalTitle}>Connect Wallet</span>
                </div>
                <div className={modalCSS.loginModalBtnBox}>
                    <button className={modalCSS.loginModalBtn} onClick={async function () {
                        sessionStorage.setItem('wallet_kind', 'Kaikas')
                        login();
                        props.setModalBool(false)
                    }}>
                        <div className={modalCSS.loginBtnBox}>
                            <div className={modalCSS.loginKaikasBtnDiv}>
                                <Image className={classnames("image100", modalCSS.loginBtnImage)} src={klaytnLogo} alt="klaytn" />
                            </div>
                            <span className={modalCSS.loginBtnDes}>Kaikas 지갑 연결</span>
                        </div>
                    </button>
                    <button className={modalCSS.loginModalBtn} onClick={function () {
                        sessionStorage.setItem('wallet_kind', 'Klip')
                        login();
                        props.setModalBool(false);
                    }}>
                        <div className={modalCSS.loginBtnBox}>
                            <div className={modalCSS.loginKlipBtnDiv}>
                                <Image className={classnames("image100", modalCSS.loginBtnImage)} src={klipLogo} alt="klip" width={200} height={100} />
                            </div>
                            <span className={modalCSS.loginBtnDes}>카카오톡으로 Klip 지갑 연결</span>
                        </div>
                    </button>
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default LoginModal;