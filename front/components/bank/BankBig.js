import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// page components
import useInput from "../../hooks/useInput";
import Loading from "../util/Loading";

// Image
import swapIcon from '../../src/image/utils/swap.png'
import questionIcon_white from "../../src/image/utils/question_white.png";
import plusIcon_white from '../../src/image/utils/plus.png'
import klaytnlogo from '../../src/image/logo/klaytnLogo.png';
import chickLogo from '../../src/image/chick/chick.png';

// store
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { setSmallModalBool, setConfirmState } from '../../store/modules/modal';
import { getBalance } from '../../store/modules/myInfo'

// css
import classnames from 'classnames';
import BankCSS from '../../styles/bank.module.css';
import MiningCSS from '../../styles/mining.module.css';

// chain
import ContractAddress from "../../src/data/contract/ContractAddress";
import Bankcontract from "../chain/contract/Bankcontract";
import Chickcontract from "../chain/contract/Chickcontract";
import Wallet from "../chain/wallet/Wallet";

function BankBig() {

    const dispatch = useDispatch();

    const { isUser, account, balance, chickBalance } = useSelector((state) => state.myInfo);
    const { confirmState } = useSelector((state) => state.modal);

    const [mode, setMode] = useState(0)
    const [loading_cal, setLoading_cal] = useState(false)
    const [txLoading, setTxLoading] = useState(false);
    /*
        swapExactKlayForChick : 0,
        swapKlayForExactChick : 1,
        swapExactChickForKlay : 2,
        swapChickForExactKlay : 3
    */
    const [klayInput, onChangeKlayInput] = useInput('')
    const [chickInput, onChangeChickInput] = useInput('')

    // get in and out
    const getChickOut = async (_v) => {
        // mode 0
        if (_v === '') {
            onChangeChickInput({ target: { value: '' } })
            return
        }
        if (Number(_v) === 0) {
            onChangeChickInput({ target: { value: 0 } })
            return
        }

        let lastV = Number(_v)

        if (Number(_v) > 200) {
            dispatch(setSmallModalBool({ bool: true, msg: '한번에 최대 200 KLAY 까지만 스왑할 수 있습니다.', modalTemplate: "justAlert" }))
            lastV = 200;
        }
        if (Math.floor(lastV * 10000) < lastV * 10000) {
            lastV = (Math.floor(Number(_v) * 10000) / 10000)
        }

        onChangeKlayInput({ target: { value: lastV } })

        try {
            setLoading_cal(true)
            const bankCon = new Bankcontract();
            const out = await bankCon.getAmountOut(lastV, 1);

            if (out === 'error') {
                dispatch(setSmallModalBool({ bool: true, msg: '오류가 발생했습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))

                onChangeChickInput({ target: { value: '' } })
                onChangeKlayInput({ target: { value: '' } })

                return
            }


            onChangeChickInput({ target: { value: out } })
            setLoading_cal(false)
        } catch (err) {
            console.error(err);
            setLoading_cal(false)
        }
    }

    const getKlayIn = async (_v) => {
        // mode 1
        if (_v === '') {
            onChangeKlayInput({ target: { value: '' } })
            return
        }
        if (Number(_v) === 0) {
            onChangeKlayInput({ target: { value: 0 } })
            return
        }

        let lastV = Number(_v)

        if (Number(_v) > 10000) {
            dispatch(setSmallModalBool({ bool: true, msg: '한번에 최대 10000 CHICK 까지만 스왑할 수 있습니다.', modalTemplate: "justAlert" }))
            lastV = 10000;
        }
        if (Math.floor(lastV * 10000) < lastV * 10000) {
            lastV = (Math.floor(Number(_v) * 10000) / 10000)
        }

        onChangeChickInput({ target: { value: lastV } })

        try {
            setLoading_cal(true)
            const bankCon = new Bankcontract();
            const _in = await bankCon.getAmountIn(lastV, 2);
            if (_in === 'error') {
                dispatch(setSmallModalBool({ bool: true, msg: '오류가 발생했습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))

                onChangeChickInput({ target: { value: '' } })
                onChangeKlayInput({ target: { value: '' } })

                return
            }

            onChangeKlayInput({ target: { value: _in } })
            setLoading_cal(false)
        } catch (err) {
            console.error(err);
            setLoading_cal(false)
        }
    }

    const getKlayOut = async (_v) => {
        // mode 2
        if (_v === '') {
            onChangeKlayInput({ target: { value: '' } })
            return
        }
        if (Number(_v) === 0) {
            onChangeKlayInput({ target: { value: 0 } })
            return
        }

        let lastV = Number(_v)

        if (Number(_v) > 10000) {
            dispatch(setSmallModalBool({ bool: true, msg: '한번에 최대 10000 CHICK 까지만 스왑할 수 있습니다.', modalTemplate: "justAlert" }))
            lastV = 10000;
        }
        if (Math.floor(lastV * 10000) < lastV * 10000) {
            lastV = (Math.floor(Number(_v) * 10000) / 10000)
        }

        onChangeChickInput({ target: { value: lastV } })

        try {
            setLoading_cal(true)
            const bankCon = new Bankcontract();
            const out = await bankCon.getAmountOut(lastV, 2);

            if (out === 'error') {
                dispatch(setSmallModalBool({ bool: true, msg: '오류가 발생했습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))

                onChangeChickInput({ target: { value: '' } })
                onChangeKlayInput({ target: { value: '' } })

                return
            }

            onChangeKlayInput({ target: { value: out } })
            setLoading_cal(false)
        } catch (err) {
            console.error(err);
            setLoading_cal(false)
        }
    }

    const getChickIn = async (_v) => {
        // mode 3
        if (_v === '') {
            onChangeChickInput({ target: { value: '' } })
            return
        }
        if (Number(_v) === 0) {
            onChangeChickInput({ target: { value: 0 } })
            return
        }

        let lastV = Number(_v)

        if (Number(_v) > 200) {
            dispatch(setSmallModalBool({ bool: true, msg: '한번에 최대 200 KLAY 까지만 스왑할 수 있습니다.', modalTemplate: "justAlert" }))
            lastV = 200;
        }
        if (Math.floor(lastV * 10000) < lastV * 10000) {
            lastV = (Math.floor(Number(_v) * 10000) / 10000)
        }

        onChangeKlayInput({ target: { value: lastV } })

        try {
            setLoading_cal(true)
            const bankCon = new Bankcontract();
            const _in = await bankCon.getAmountIn(lastV, 1);
            if (_in === 'error') {
                dispatch(setSmallModalBool({ bool: true, msg: '오류가 발생했습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))

                onChangeChickInput({ target: { value: '' } })
                onChangeKlayInput({ target: { value: '' } })

                return
            }

            onChangeChickInput({ target: { value: _in } })
            setLoading_cal(false)
        } catch (err) {
            console.error(err);
            setLoading_cal(false)
        }

    }

    useEffect(() => {
        if (account !== '') {
            dispatch(getBalance(account))
        }
    }, [account])

    useEffect(() => {
        switch (mode) {
            case 0:
                getChickOut(klayInput)
                break;
            case 1:
                getKlayIn(chickInput)
                break;
            case 2:
                getKlayOut(chickInput)
                break;
            case 3:
                getChickIn(klayInput)
                break;
            default:
                bresk;
        }
    }, [mode])

    useEffect(() => {
        if (mode === 0) {
            getChickOut(klayInput)
        } else if (mode === 3) {
            getChickIn(klayInput)
        }
    }, [klayInput])

    useEffect(() => {
        if (mode === 1) {
            getKlayIn(chickInput)
        } else if (mode === 2) {
            getKlayOut(chickInput)
        }
    }, [chickInput])

    // utils
    const changeModeButton = () => {
        switch (mode) {
            case 0:
                setMode(3);
                break;
            case 1:
                setMode(2);
                break;
            case 2:
                setMode(1);
                break;
            case 3:
                setMode(0);
                break;
            default:
                break;
        }
    }

    const getMin = (_out) => {
        return (Math.floor(_out * 9900) / 10000)
    }

    const getMax = (_in) => {
        return (Math.ceil(_in * 10100) / 10000)
    }

    // transaction

    const sendSwapCheck = async () => {
        if (!isUser) {
            dispatch(setSmallModalBool({ bool: true, msg: '지갑 연결 및 농장 가입이 필요합니다.', modalTemplate: "justAlert" }))
            return
        }

        if (isNaN(klayInput) || isNaN(chickInput) || klayInput <= 0 || chickInput <= 0) {
            dispatch(setSmallModalBool({ bool: true, msg: '올바른 수를 입력해주세요.', modalTemplate: "justAlert" }))
            return
        }

        if (mode === 0 || mode === 1) {
            if (klayInput > balance && balance !== -1) {
                dispatch(setSmallModalBool({ bool: true, msg: '보유한 KLAY가 부족합니다.', modalTemplate: "justAlert" }))
                return
            }
        } else if (mode === 2 || mode === 3) {
            if (chickInput > chickBalance) {
                dispatch(setSmallModalBool({ bool: true, msg: '보유한 $CHICK이 부족합니다.', modalTemplate: "justAlert" }))
                return
            }
        }

        dispatch(setSmallModalBool({ bool: true, msg: '이용방법 및 주의사항을 충분히 읽어보았으며,\n스왑을 진행하는 데에 동의합니다.', modalTemplate: 'confirmAlert' }))
    }

    const sendSwap = async () => {
        try {
            setTxLoading(true);

            let res = {};
            const chickContract = new Chickcontract();

            if ((await chickContract.getAllowance(account, ContractAddress.bank)).toString() !== '0') {
                res.status = true;
            } else {
                res = await chickContract.approve(klipPopOn, klipPopOff, account, ContractAddress.bank)
            }


            if (res?.status === true) {
                const bankCon = new Bankcontract();
                let res1 = {};
                switch (mode) {
                    case 0:
                        res1 = await bankCon.swapExactKlayForChick(klipPopOn, klipPopOff, account, klayInput, getMin(chickInput));
                        break;
                    case 1:
                        res1 = await bankCon.swapKlayForExactChick(klipPopOn, klipPopOff, account, getMax(klayInput), chickInput);
                        break;
                    case 2:
                        res1 = await bankCon.swapExactChickForKlay(klipPopOn, klipPopOff, account, chickInput, getMin(klayInput));
                        break;
                    case 3:
                        res1 = await bankCon.swapChickForExactKlay(klipPopOn, klipPopOff, account, getMax(chickInput), klayInput);
                        break;
                    default:
                        res1.status = false;
                        break;
                }

                if (res1?.status === true) {
                    dispatch(setSmallModalBool({ bool: true, msg: '스왑이 완료되었습니다.', modalTemplate: "justAlert" }))
                    onChangeKlayInput({ target: { value: '' } })
                    onChangeChickInput({ target: { value: '' } })
                    dispatch(getBalance(account));
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: "스왑에 실패하였습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
                }

            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '스왑에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
            }

            setTxLoading(false);
        } catch (err) {
            console.error(err);
            dispatch(setSmallModalBool({ bool: true, msg: '스왑에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
            setTxLoading(false);
        }
    }

    useEffect(() => {
        if (!confirmState) return;
        dispatch(setConfirmState({ confirmState: false }))
        sendSwap()
    }, [confirmState])

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    return (
        <div className="subBoard_big">
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
                        은행
                    </span>
                </div>
                <div className="pageUtilBox">
                    <div id="balloon_light" balloon="$CHICK 추가하기" className="pageUtilIconBox" onClick={() => Wallet.addToken()}>
                        <Image className="pageUtilIcon" src={plusIcon_white} alt="" />
                    </div>
                    <div id="balloon_light" balloon="은행 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/f295871f7043435d8efae1dc5bd52836')}>
                        <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                    </div>
                </div>
            </div>
            <div className={BankCSS.bank_whole}>
                <div className={BankCSS.bank_swap_whole}>
                    <div className={BankCSS.bank_swap_left}>
                        <div className={BankCSS.bank_swap_setting}>
                            슬리피지
                            <div className={BankCSS.bank_swap_slippage_selected}>
                                1%
                            </div>
                        </div>
                        <div className={BankCSS.bank_swap_asset}>
                            <span className={BankCSS.bank_swap_asset_header}>
                                From
                                {
                                    mode === 1 || mode === 3
                                        ?
                                        <span className={BankCSS.bank_swap_predict}>
                                            estimated
                                        </span>
                                        :
                                        null
                                }
                            </span>
                            {
                                mode === 0 || mode === 1
                                    ?
                                    <>
                                        <span className={BankCSS.bank_swap_asset_content}>
                                            <input className={BankCSS.bank_swap_input} type='number' placeholder='0' onChange={onChangeKlayInput} value={klayInput} onFocus={() => setMode(0)} />
                                            <div className={BankCSS.bank_swap_asset_each}>
                                                <div className={BankCSS.bank_swap_asset_image}>
                                                    <Image className='image100' src={klaytnlogo} />
                                                </div>
                                                KLAY
                                            </div>
                                        </span>
                                        <span className={BankCSS.bank_swap_asset_footer}>
                                            보유 {Math.floor(balance * 100) / 100}
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span className={BankCSS.bank_swap_asset_content}>
                                            <input className={BankCSS.bank_swap_input} type='number' placeholder='0' onChange={onChangeChickInput} value={chickInput} onFocus={() => setMode(2)} />
                                            <div className={BankCSS.bank_swap_asset_each}>
                                                <div className={BankCSS.bank_swap_asset_image}>
                                                    <Image className='image100' src={chickLogo} />
                                                </div>
                                                CHICK
                                            </div>
                                        </span>
                                        <span className={BankCSS.bank_swap_asset_footer}>
                                            보유 {Math.floor(chickBalance * 100) / 100}
                                        </span>
                                    </>
                            }
                        </div>
                        <div className={BankCSS.bank_swap_change} id='balloon_dark' balloon='위아래 바꾸기' onClick={changeModeButton}>
                            <Image className='image100' src={swapIcon} alt='change' />
                        </div>
                        <div className={BankCSS.bank_swap_asset}>
                            <span className={BankCSS.bank_swap_asset_header}>
                                To
                                {
                                    mode === 0 || mode === 2
                                        ?
                                        <span className={BankCSS.bank_swap_predict}>
                                            estimated
                                        </span>
                                        :
                                        null
                                }
                            </span>
                            {
                                mode === 2 || mode === 3
                                    ?
                                    <>
                                        <span className={BankCSS.bank_swap_asset_content}>
                                            <input className={BankCSS.bank_swap_input} type='number' placeholder='0' onChange={onChangeKlayInput} value={klayInput} onFocus={() => setMode(3)} />
                                            <div className={BankCSS.bank_swap_asset_each}>
                                                <div className={BankCSS.bank_swap_asset_image}>
                                                    <Image className='image100' src={klaytnlogo} />
                                                </div>
                                                KLAY
                                            </div>
                                        </span>
                                        <span className={BankCSS.bank_swap_asset_footer}>
                                            보유 {Math.floor(balance * 100) / 100}
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span className={BankCSS.bank_swap_asset_content}>
                                            <input className={BankCSS.bank_swap_input} type='number' placeholder='0' onChange={onChangeChickInput} value={chickInput} onFocus={() => setMode(1)} />
                                            <div className={BankCSS.bank_swap_asset_each}>
                                                <div className={BankCSS.bank_swap_asset_image}>
                                                    <Image className='image100' src={chickLogo} />
                                                </div>
                                                CHICK
                                            </div>
                                        </span>
                                        <span className={BankCSS.bank_swap_asset_footer}>
                                            보유 {Math.floor(chickBalance * 100) / 100}
                                        </span>
                                    </>
                            }
                        </div>
                        {
                            txLoading
                                ?
                                <button className={classnames(BankCSS.bank_swap_button, 'grayButton')}>
                                    <div className={MiningCSS.miningSmall_ButtonLoading}>
                                        <Loading />
                                    </div>
                                </button>
                                :
                                <button onClick={sendSwapCheck} className={classnames(BankCSS.bank_swap_button, 'purpleButton')}>
                                    스왑하기
                                </button>
                        }
                    </div>
                    <div className={BankCSS.bank_swap_right}>
                        <div className={BankCSS.bank_swap_setting}>
                            예상내역
                        </div>
                        {/* <div className={BankCSS.bank_swap_poolBox}>
                            <span>
                                풀 상태
                            </span>
                            <div className={BankCSS.bank_swap_poolDiagram}>
                                <div className={BankCSS.bank_swap_poolDiagramEach}>
                                    <span className={BankCSS.bank_swap_poolDiagramHeader}>
                                        <div className={BankCSS.bank_swap_poolDiagramToken}>
                                            <Image className='image100' src={klaytnlogo} />
                                        </div>
                                        KLAY
                                    </span>
                                    <span className={BankCSS.bank_swap_poolDiagramStat}>
                                        10000
                                    </span>
                                </div>
                                <div className={BankCSS.bank_swap_poolDiagramEach}>
                                    <span className={BankCSS.bank_swap_poolDiagramHeader}>
                                        <div className={BankCSS.bank_swap_poolDiagramToken}>
                                            <Image className='image100' src={chickLogo} />
                                        </div>
                                        CHICK
                                    </span>
                                    <span className={BankCSS.bank_swap_poolDiagramStat}>
                                        500000
                                    </span>
                                </div>
                            </div>
                        </div> */}
                        <div className={BankCSS.bank_swap_predictBox}>
                            <span className={BankCSS.bank_swap_predictTitle}>
                                교환 비율
                            </span>
                            <span className={BankCSS.bank_swap_predictValue}>
                                1 KLAY <b id='notoSans'>≈</b> {
                                    Math.round(chickInput / klayInput * 10000) / 10000
                                        ? Math.round(chickInput / klayInput * 10000) / 10000
                                        : '--'
                                } CHICK
                            </span>
                            <span className={BankCSS.bank_swap_predictValue}>
                                1 CHICK <b id='notoSans'>≈</b> {
                                    Math.round(klayInput / chickInput * 10000) / 10000
                                        ? Math.round(klayInput / chickInput * 10000) / 10000
                                        : '--'
                                } KLAY
                            </span>
                        </div>
                        <div className={BankCSS.bank_swap_predictBox}>
                            <span className={BankCSS.bank_swap_predictTitle}>
                                {
                                    mode === 0 || mode === 2
                                        ?
                                        '최소 수령 수량'
                                        :
                                        '최대 전송 수량'
                                }
                            </span>
                            <span className={BankCSS.bank_swap_predictValue}>
                                {
                                    {
                                        0:
                                            getMin(chickInput) + ' CHICK'
                                        ,
                                        1:
                                            getMax(klayInput) + ' KLAY'
                                        ,
                                        2:
                                            getMin(klayInput) + ' KLAY'
                                        ,
                                        3:
                                            getMax(chickInput) + ' CHICK'

                                    }[mode]
                                }
                            </span>
                            <span className={BankCSS.bank_swap_predictValue}>
                                슬리피지 1% 적용
                            </span>
                        </div>
                        <div className={BankCSS.bank_swap_predictCaution}>
                            * 위의 값은 예상치로 실제 값과는 오차가 존재할 수 있습니다.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default BankBig;