import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// css
import classnames from 'classnames';
import StoreCSS from '../../styles/chickStore.module.css';
import LabCSS from '../../styles/lab.module.css';
import MiningCSS from '../../styles/mining.module.css';
import RaffleCSS from '../../styles/raffle.module.css';

// Image
import questionIcon_black from '../../src/image/utils/question_black.png';
import chickLogo from '../../src/image/chick/chick.png'

// page components
import Loading from '../util/Loading';
import useInput from '../../hooks/useInput';

// data
import products from '../../src/data/chickStore/products';

// chain
import caver from '../chain/CaverChrome';
import Chickcontract from '../chain/contract/Chickcontract';
import ChickStorecontract from "../chain/contract/ChickStorecontract";
import ContractAddress from "../../src/data/contract/ContractAddress";

// store
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { getBalance } from '../../store/modules/myInfo'
import { setSmallModalBool, setConfirmState } from '../../store/modules/modal';
import { nftFromChain } from '../../store/modules/nft';

function ChickStoreSmall({ selectedItemId, setSelectedItemId }) {

    const dispatch = useDispatch();

    const [buyQuan, onChangeBuyQuan] = useInput('');
    const [txLoading, setTxLoading] = useState(false);

    const { isUser, account, chickBalance } = useSelector((state) => state.myInfo);

    const getType = useCallback((_id) => {
        let type;
        switch (products[_id].type) {
            case 0:
                type = '채굴 아이템';
                break;
            case 1:
                type = '장식품';
                break;
            case 2:
                type = '팻말';
                break;
            case 3:
                type = '기타';
                break;
            default:
                type = '기타';
                break;
        }
        return type;
    }, [selectedItemId])

    const buy = async () => {
        if (!isUser) {
            dispatch(setSmallModalBool({ bool: true, msg: '지갑 연결 및 농장 가입이 필요합니다.', modalTemplate: "justAlert" }))
            return
        }
        if (!(buyQuan !== '' && buyQuan % 1 === 0 && 0 < buyQuan && buyQuan <= 200)) {
            dispatch(setSmallModalBool({ bool: true, msg: '올바른 수량을 입력해주세요 (1 ~ 200개).', modalTemplate: "justAlert" }))
            return
        }
        if (chickBalance < caver.utils.convertFromPeb(products[selectedItemId].price, 'KLAY') * buyQuan) {
            dispatch(setSmallModalBool({ bool: true, msg: '보유한 $CHICK이 부족합니다.', modalTemplate: "justAlert" }))
            return
        }

        try {
            setTxLoading(true)

            let res = {};
            const chickContract = new Chickcontract();

            if ((await chickContract.getAllowance(account, ContractAddress.chickStore)).toString() !== '0') {
                res.status = true;
            } else {
                res = await chickContract.approve(klipPopOn, klipPopOff, account, ContractAddress.chickStore)
            }

            if (res?.status === true) {
                const storeCon = new ChickStorecontract();
                const res1 = await storeCon.buyProduct(klipPopOn, klipPopOff, account, selectedItemId, buyQuan);
                if (res1?.status === true) {
                    dispatch(setSmallModalBool({ bool: true, msg: '구매가 완료되었습니다.', modalTemplate: "justAlert" }))
                    dispatch(getBalance(account));
                    dispatch(nftFromChain(account));
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: "구매에 실패하였습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
                }
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '구매에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
            }
            setTxLoading(false)


        } catch (err) {
            console.error(err)
            dispatch(setSmallModalBool({ bool: true, msg: '구매에 실패하였습니다. 다시 시도해주세요.', modalTemplate: "justAlert" }))
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
        <>
            <div className="subBoard_small">
                <div className={StoreCSS.storeSmall_whole}>
                    {

                        selectedItemId === null
                            ?
                            <div className={StoreCSS.storeSmall_cautionBox}>
                                <div className={StoreCSS.storeSmall_caution_whole}>
                                    <span className={LabCSS.superSmall_caution_title}>
                                        이용방법 및 주의사항
                                    </span>
                                    <div className={LabCSS.superSmall_caution_content}>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 상점에서는 치키농장에서 사용할 수 있는 아이템을 구매하실 수 있습니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 첫 구매 시 2번의 트랜잭션이 발생합니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 상점에서 구매한 아이템은 환불이 불가능합니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 상점에서 이용되는 재화는 $CHICK으로 <Link href='/bank'><b id='hyperBlue'>은행</b></Link> 또는 <Link href='/lab'><b id='hyperBlue'>치키연구소</b></Link>에서 획득가능합니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 채굴 아이템은 치키즈의 채굴에 관련된 아이템입니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 장식품과 팻말은 농장을 꾸미는 데에 사용할 수 있는 아이템입니다.
                                        </span>
                                        <span className={LabCSS.superSmall_caution_each}>
                                            * 더 자세한 내용은 <b id='hyperBlue' onClick={() => window.open('https://klayproject.notion.site/92bbab7c392a436092bf5a4a347bfe42')}>상점 가이드</b>를 참고해주세요.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <div className='pageHeader'>
                                    <div className="pageTitleBox">
                                        <span className={RaffleCSS.rafflePageTitle} onClick={() => setSelectedItemId(null)}>
                                            &lt; 뒤로 가기
                                        </span>
                                    </div>
                                </div>
                                <div className={StoreCSS.storeSmall_itemWhole}>
                                    <div className={RaffleCSS.raffleDetailHeader}>
                                        <div className={RaffleCSS.raffleDetailImgBox_width}>
                                            <img className='maxImage100' src={`/image/chickStore/${selectedItemId}.png`} />
                                        </div>
                                        <div className={RaffleCSS.raffleDetailHead}>
                                            <span className={RaffleCSS.raffleDetailCollection}>
                                                {getType(selectedItemId)}
                                            </span>
                                            <span className={RaffleCSS.raffleDetailName}>
                                                {products[selectedItemId].name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={StoreCSS.storeSmall_itemInfo}>
                                        <div className={StoreCSS.storeSmall_itemDesc}>
                                            <span className={RaffleCSS.raffleInfoTitle}>
                                                설명
                                            </span>
                                            <div className={StoreCSS.storeSmall_itemDescEach}>
                                                {products[selectedItemId].desc}
                                            </div>
                                        </div>
                                        <div className={RaffleCSS.raffleInfo}>
                                            <span className={RaffleCSS.raffleInfoTitle}>
                                                가격
                                            </span>
                                            <span className={RaffleCSS.raffleInfoInfo}>
                                                <div className={RaffleCSS.raffleInfoPayment}>
                                                    <Image className='image100' src={chickLogo}
                                                        alt={'CHICK'} />
                                                </div>
                                                {caver.utils.convertFromPeb(products[selectedItemId].price, 'KLAY')}
                                            </span>
                                        </div>
                                        <div className={RaffleCSS.raffleInfo}>
                                            <span className={RaffleCSS.raffleInfoTitle}>
                                                컨트랙트
                                            </span>
                                            <span className={RaffleCSS.raffleInfoInfo}>
                                                <b id='hyperBlue' onClick={() => window.open(`https://www.klaytnfinder.io/nft/${products[selectedItemId].contract}`)}>{products[selectedItemId].contract.substring(0, 4) + '....' + products[selectedItemId].contract.substring(38, 42)}</b>&nbsp;({products[selectedItemId].contract_type})
                                            </span>
                                        </div>
                                        <div className={RaffleCSS.raffleInfo}>
                                            <span className={RaffleCSS.raffleInfoTitle}>
                                                토큰 번호
                                            </span>
                                            <span className={RaffleCSS.raffleInfoInfo}>
                                                {products[selectedItemId].tokenId}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={StoreCSS.storeSmall_itemBuy}>
                                        <div className={StoreCSS.storeSmall_itemBuyQuan} >
                                            <div className={StoreCSS.storeSmall_itemBuyQuanInputWhole}>
                                                <input className={RaffleCSS.raffleInputBox} type='number' placeholder="1 ~ 200개"
                                                    onChange={onChangeBuyQuan}
                                                    value={buyQuan}
                                                    min={1} max={200} />
                                                <div id='balloon_light' balloon='한 번 구매에 200개까지' className={RaffleCSS.raffleInfoHelpIcon}>
                                                    <Image className='image100' src={questionIcon_black} alt='help' />
                                                </div>
                                            </div>
                                            <span className={RaffleCSS.raffleInfoFooterPriceBox}>
                                                총 {caver.utils.convertFromPeb(products[selectedItemId].price, 'KLAY') * buyQuan} CHICK
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
                                                <button onClick={buy} className={classnames(StoreCSS.storeSmall_buyButton, 'purpleButton')}>구매하기</button>
                                        }
                                    </div>
                                </div>
                            </>

                    }
                </div>
            </div >
        </>
    );
}

export default ChickStoreSmall;