import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// page components
import Loading from "../../util/Loading";

// image
import plusIcon from '../../../src/image/utils/plus_black.png'

// css
import classnames from 'classnames'
import MiningCSS from '../../../styles/mining.module.css';

// chain
import caver from '../../chain/CaverChrome';
import Miningcontract from '../../chain/contract/Miningcontract';
import KIP37contract from '../../chain/contract/KIP37contract';
import ContractAddress from '../../../src/data/contract/ContractAddress';

// store
import { setRequestKey, setKlipModalBool } from '../../../store/modules/klipstore';
import { getBalance } from '../../../store/modules/myInfo'
import { setSmallModalBool, setConfirmState } from '../../../store/modules/modal';
import { nftFromChain } from '../../../store/modules/nft';

function MiningSmall(props) {

    const dispatch = useDispatch();

    const {
        sortBy, info, loading_info, selected
    } = useSelector((state) => state.mining);
    const { account } = useSelector((state) => state.myInfo);
    const { oil } = useSelector((state) => state.nft);

    const [tabNum, setTabNum] = useState(0);

    // loading
    const [txLoading, setTxLoading] = useState(false);

    const getMiningTotal = (_mine) => {
        if (_mine === undefined) {
            return 0
        } else {
            return (Math.floor(Number(caver.utils.fromPeb(_mine.toString(), 'KLAY')) * 100) / 100) // 소숫점 둘째자리까지
        }
    }

    const getMinableTotal = useCallback(() => {
        let total = 0;
        for (let i = 0; i < selected.length; i++) {
            const _minable = info.filter(x => x.id === selected[i])[0].minable;
            total += getMiningTotal(_minable);
        }
        return Math.floor(total * 100) / 100;
    }, [info, selected])

    const calculateOilTime = (_oilCharged, _cp) => {
        const _time = Number(_oilCharged) + 2592000 - props.now;
        if (_cp > 2) return '-'
        if (_time < 0) return 0
        return (_time)
    }

    const mine = async () => {
        if (selected.length < 1) {
            dispatch(setSmallModalBool({ bool: true, msg: '채굴할 치키즈를 선택해주세요.', modalTemplate: "justAlert" }))
            return;
        }

        for (let i = 0; i < selected.length; i++) {
            const _minable = info.filter(x => x.id === selected[i])[0].minable;
            if (getMiningTotal(_minable) <= 1) {
                dispatch(setSmallModalBool({ bool: true, msg: '채굴 가능 토큰이 1$CHICK 미만인\n치키즈는 채굴할 수 없습니다.', modalTemplate: "justAlert" }))
                return
            }
        }

        try {
            setTxLoading(true)
            const minecon = new Miningcontract();
            const res1 = await minecon.mine(klipPopOn, klipPopOff, account, selected);
            if (res1?.status === true) {
                dispatch(setSmallModalBool({ bool: true, msg: '채굴이 완료되었습니다.', modalTemplate: "justAlert" }));
                dispatch(getBalance(account));
                props.refresh();
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: "채굴에 실패하였습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
            }
            setTxLoading(false)
        } catch (err) {
            console.error(err)
            dispatch(setSmallModalBool({ bool: true, msg: '채굴에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))

            setTxLoading(false)
        }
    }

    const charge = async () => {
        if (selected.length < 1) {
            dispatch(setSmallModalBool({ bool: true, msg: '충전할 치키즈를 선택해주세요.', modalTemplate: "justAlert" }))
            return;
        }

        for (let i = 0; i < selected.length; i++) {
            const arr = info.filter(x => x.id === selected[i])[0];
            if (calculateOilTime(arr.oilCharged, arr.cp) !== 0) {
                dispatch(setSmallModalBool({ bool: true, msg: '기름 시간이 남은 치키즈는 또는 슈퍼치키즈는\n기름을 충전할 수 없습니다.', modalTemplate: "justAlert" }))
                return
            }
        }

        if (selected.length > oil) {
            dispatch(setSmallModalBool({ bool: true, msg: '보유한 기름이 부족합니다.', modalTemplate: "justAlert" }))
            return
        }

        try {
            setTxLoading(true)
            let res = {};
            const oilContract = new KIP37contract(ContractAddress.oil);
            if (await oilContract.getIsApprovedForAll(account, ContractAddress.mining)) {
                res.status = true;
            } else {
                res = await oilContract.setApprovalForAll(klipPopOn, klipPopOff, account, ContractAddress.mining, true)
            }
            if (res?.status === true) {
                const minecon = new Miningcontract();
                const res1 = await minecon.charge(klipPopOn, klipPopOff, account, selected);
                if (res1?.status === true) {
                    dispatch(setSmallModalBool({ bool: true, msg: '기름 충전이 완료되었습니다.', modalTemplate: "justAlert" }))
                    props.refresh();
                    dispatch(getBalance(account));
                    dispatch(nftFromChain(account));
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: "기름 충전에 실패하였습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
                }
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '기름 충전에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
            }
            setTxLoading(false)
        } catch (err) {
            console.error(err);
            dispatch(setSmallModalBool({ bool: true, msg: '기름 충전에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
            setTxLoading(false)
        }
    }

    // klip
    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    return (
        <div className="subBoard_small">
            <div className={MiningCSS.miningSmall_whole}>
                <div className={MiningCSS.miningSmall_boxSelected}>
                    <div className={MiningCSS.miningSmall_boxTitle}>
                        선택된 치키즈<br /><br />
                        ({selected.length}개)
                    </div>
                    <div className={MiningCSS.miningSmall_boxContent}>
                        <div className={MiningCSS.miningSmall_selectedGrid}>
                            {
                                selected.map((x, index) => {
                                    return (
                                        <>
                                            <div className={MiningCSS.miningSmall_selectedGridEach} key={x}>
                                                <Image className='image100' width={256} height={256} src={`https://api.klaychicken.com/v2small/${x}.png`} alt={x} />
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={MiningCSS.miningSmall_boxSmall}>
                    <div className={MiningCSS.miningSmall_boxTitle}>
                        보유 기름 수
                    </div>
                    <div className={MiningCSS.miningSmall_boxContent}>
                        {oil}개
                        <Link href='/chickStore'>
                            <div className={MiningCSS.miningSmall_boxContent_icon} id='balloon_dark' balloon='기름 구매하러 가기'>
                                <Image src={plusIcon} alt='기름 구매' />
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={MiningCSS.miningSmall_tab}>
                    <div className={tabNum === 0 ? classnames(MiningCSS.miningSmall_tabEach, MiningCSS.miningSmall_tabEachSelected) : MiningCSS.miningSmall_tabEach} onClick={() => setTabNum(0)}>
                        채굴하기
                    </div>
                    <div className={tabNum === 1 ? classnames(MiningCSS.miningSmall_tabEach, MiningCSS.miningSmall_tabEachSelected) : MiningCSS.miningSmall_tabEach} onClick={() => setTabNum(1)}>
                        충전하기
                    </div>
                    <div className={MiningCSS.miningSmall_tabEach} onClick={() => window.open('https://klayproject.notion.site/8a2894ec853d44699b1c843fa9f430b0')}>
                        가이드 보기
                    </div>
                </div>
                <div className={MiningCSS.miningSmall_boxAction}>
                    {
                        {
                            0:
                                <>
                                    <div className={MiningCSS.miningSmall_desc}>
                                        <span>
                                            * 한번에 최대 20개까지 선택 가능합니다.
                                        </span>
                                        <span>
                                            * 중복 채굴 방지를 위해 채굴 가능 토큰이 <br />
                                            &nbsp;&nbsp;&nbsp;1$CHICK 이상인 치키즈만 채굴 가능합니다.
                                        </span>
                                        <span>
                                            * 자세한 내용은 가이드 보기를 참고하세요.
                                        </span>
                                    </div>
                                    <div className={MiningCSS.miningSmall_prediction}>
                                        <span>
                                            총 예상 채굴량:
                                        </span>
                                        <span>
                                            약 {getMinableTotal()} CHICK
                                        </span>
                                    </div>
                                    {
                                        txLoading
                                            ?
                                            <button className={classnames(MiningCSS.miningSmall_Button, 'grayButton')}>
                                                <div className={MiningCSS.miningSmall_ButtonLoading}>
                                                    <Loading />
                                                </div>
                                            </button>
                                            :
                                            <button onClick={mine} className={classnames(MiningCSS.miningSmall_Button, 'purpleButton')}>채굴하기</button>
                                    }
                                </>,
                            1:
                                <>
                                    <div className={MiningCSS.miningSmall_desc}>
                                        <span>
                                            * 첫 충전 시에는 2번의 트랜잭션이 발생합니다.
                                        </span>
                                        <span>
                                            * 기름의 남은 시간이 없어야 충전할 수 있습니다.
                                        </span>
                                        <span>
                                            * 치키즈 한 개당 하나의 기름이 필요합니다.
                                        </span>
                                        <span>
                                            * 자세한 내용은 가이드 보기를 참고하세요.
                                        </span>
                                    </div>
                                    <div className={MiningCSS.miningSmall_prediction}>
                                        <span>
                                            소요 기름 수:
                                        </span>
                                        <span>
                                            {selected.length} 개
                                        </span>
                                    </div>
                                    {
                                        txLoading
                                            ?
                                            <button className={classnames(MiningCSS.miningSmall_Button, 'grayButton')}>
                                                <div className={MiningCSS.miningSmall_ButtonLoading}>
                                                    <Loading />
                                                </div>
                                            </button>
                                            :
                                            <button onClick={charge} className={classnames(MiningCSS.miningSmall_Button, 'purpleButton')}>충전하기</button>
                                    }
                                </>
                        }[tabNum]
                    }
                </div>
            </div>
        </div>
    );
}

export default MiningSmall;