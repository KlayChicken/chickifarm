import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// css
import MiningCSS from '../../../styles/mining.module.css';
import LabCSS from '../../../styles/lab.module.css';

// Image
import plusIcon from '../../../src/image/utils/plus_black.png';

function MakeSuperSmall() {
    const { oliveOil } = useSelector((state) => state.nft);

    return (
        <>
            <div className="subBoard_small">
                <div className={MiningCSS.miningSmall_whole}>
                    <div className={MiningCSS.miningSmall_boxSmall}>
                        <div className={MiningCSS.miningSmall_boxTitle}>
                            보유 올리브 오일
                        </div>
                        <div className={MiningCSS.miningSmall_boxContent}>
                            {oliveOil}개
                            <Link href='/chickStore'>
                                <div className={MiningCSS.miningSmall_boxContent_icon} id='balloon_dark' balloon='구매하러 가기'>
                                    <Image src={plusIcon} alt='올리브 오일 구매' />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={LabCSS.superSmall_caution_whole}>
                        <span className={LabCSS.superSmall_caution_title}>
                            이용방법 및 주의사항
                        </span>
                        <div className={LabCSS.superSmall_caution_content}>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈를 만드는 데에는 올리브 오일 하나가 필요합니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈 변신 시 해당 치키즈에 쌓여있는 $CHICK이 자동 채굴됩니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 첫 변신 시 2번의 트랜잭션이 발생합니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈로 변신하면 외형이 변화합니다. 외형 변화에는 최대 5분의 시간이 소요될 수 있습니다. 오픈씨, 팔라 등의 거래소에서는 메타데이터 리프레시(정보 새로고침) 버튼을 클릭해야 이미지가 변환됩니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈로 변신하면 다시 기본치키즈로 돌아올 수는 없습니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈는 기본치키즈의 3배 채굴량을 가지며, 그 값은 바삭력에 따라 상이합니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈는 기름 충전이 필요하지 않습니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 슈퍼치키즈는 멘토를 장착할 수 없습니다. (이미 멘토 장착이 되어있다면 슈퍼치키즈 변신 이후 해제 가능합니다.)
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 이미 변신한 슈퍼치키즈는 '슈퍼치키즈 변신하기'를 또 이용할 수 없습니다.
                            </span>
                            <span className={LabCSS.superSmall_caution_each}>
                                * 자세한 내용은 <b id='hyperBlue' onClick={() => window.open('https://klayproject.notion.site/a4bf92347975485bafe8eb3dc346fc98')}>(가이드)</b>를 참고해주세요.
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default MakeSuperSmall;