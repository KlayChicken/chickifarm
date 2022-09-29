import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// css
import StoreCSS from '../../styles/chickStore.module.css';
import LabCSS from '../../styles/lab.module.css';

// Image
import plusIcon from '../../src/image/utils/plus_black.png';

function BankSmall() {
    return (
        <>
            <div className="subBoard_small">
                <div className={StoreCSS.storeSmall_whole}>
                    <div className={StoreCSS.storeSmall_cautionBox}>
                        <div className={StoreCSS.storeSmall_caution_whole}>
                            <span className={LabCSS.superSmall_caution_title}>
                                이용방법 및 주의사항
                            </span>
                            <div className={LabCSS.superSmall_caution_content}>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 은행에서는 $CHICK을 KLAY로 또는 KLAY를 $CHICK으로 스왑하실 수 있습니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 첫 스왑 시 2번의 트랜잭션이 발생합니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 스왑 시 0.3%의 수수료가 발생됩니다. 수수료는 교환 풀에 재투자됩니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 가격 변동으로 인해 사용자가 예상하지 못한 가격으로 스왑이 될 수 있습니다.<br />(단, 슬리피지는 1%로 고정되어 있기 때문에 우측의 예상내역에 있는 ‘최소 수령 수량’ 보다 적게 수령하거나, ‘최대 전송 수량’ 보다 많이 전송하지는 않습니다.)
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 스왑의 내역은 모두 블록체인에 저장되기 때문에, 취소 및 되돌리기가 불가능합니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 한 번에 최대 200 KLAY 또는 10000 $CHICK 까지만 스왑이 가능합니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 카이카스 지갑의 오류로 클레이 잔고가 -1로 표기될 때가 있습니다. 잔고가 -1로 표기되더라도 트랜잭션은 정상적으로 진행됩니다.
                                </span>
                                <span className={LabCSS.superSmall_caution_each}>
                                    * 더 자세한 내용은 <b id='hyperBlue' onClick={() => window.open('https://klayproject.notion.site/f295871f7043435d8efae1dc5bd52836')}>은행 가이드</b>를 참고해주세요.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default BankSmall;