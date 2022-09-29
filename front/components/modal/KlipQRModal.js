import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import classnames from 'classnames';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import klipLogo from "../../src/image/utils/klip.svg";

import Rarrow from "../../src/image/utils/right_arrow.svg";
import kakaoLogo from "../../src/image/utils/kakaoLogo.svg";
import kakaoEtc from "../../src/image/utils/kakaoEtc.svg";
import kakaoScan from "../../src/image/utils/kakaoScan.svg";

// store
import { setKlipModalBool } from '../../store/modules/klipstore';

// css
import modalCSS from '../../styles/modal.module.css';

// etc
import { useQRCode } from 'next-qrcode';

function KlipQRModal() {

    const dispatch = useDispatch();
    const { Canvas } = useQRCode();

    const { klipRequestKey } = useSelector((state) => state.klipstore);

    return (
        <>
            <div className={modalCSS.QRmodal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => dispatch(setKlipModalBool({ kmo: false }))}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.klipTQBox}>
                    <div className={modalCSS.klipTitleBox}>
                        <div className={modalCSS.klipTitleDiv}>
                            <Image className={classnames("image100", modalCSS.klipTitleImg)} src={klipLogo} alt="klip" width={200} height={100} />
                        </div>
                        <span className={modalCSS.klipTitleSpan}>카카오톡으로 Klip 지갑 연결</span>
                    </div>
                    <div className={modalCSS.klipQrBox}>
                        <Canvas text={`https://klipwallet.com/?target=/a2a?request_key=${klipRequestKey}`} width="10rem" />
                    </div>
                    <div className={modalCSS.klipDesBox}>
                        <div className={modalCSS.klipDesISBox}>
                            <div className={modalCSS.klipDesIconBox}>
                                <Image src={kakaoLogo} className={classnames("image100", modalCSS.klipDesImg)} />
                            </div>
                            <span className={modalCSS.klipDesSpan}>카카오톡 실행</span>
                        </div>
                        <div className={modalCSS.klipArrowBox}>
                            <Image src={Rarrow} className={classnames("image100", modalCSS.klipArrowImg)} />
                        </div>
                        <div className={modalCSS.klipDesISBox}>
                            <div className={modalCSS.klipDesIconBox}>
                                <Image src={kakaoEtc} className={classnames("image100", modalCSS.klipDesImg)} />
                            </div>
                            <span className={modalCSS.klipDesSpan}>우측 하단 더보기</span>
                        </div>
                        <div className={modalCSS.klipArrowBox}>
                            <Image src={Rarrow} className={classnames("image100", modalCSS.klipArrowImg)} />
                        </div>
                        <div className={modalCSS.klipDesISBox}>
                            <div className={modalCSS.klipDesIconBox}>
                                <Image src={kakaoScan} className={classnames("image100", modalCSS.klipDesImg)} />
                            </div>
                            <span className={modalCSS.klipDesSpan}>QR 스캔하기</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => dispatch(setKlipModalBool({ kmo: false }))} />
        </>
    );
}

export default KlipQRModal;