import Link from 'next/link';
import Image from 'next/image';

// images
import errorImage from '../../src/image/utils/errorChickiz.png';

// css
import classnames from 'classnames';
import UtilCSS from '../../styles/util.module.css';

function Error() {

    return (
        <>
            <div className="mainBoard error_mobile">
                <div className="subBoard_whole">
                    <div className={UtilCSS.errorPageWhole}>
                        <div className={UtilCSS.errorImageBox}>
                            <Image className="image100" src={errorImage} alt="" />
                        </div>
                        <div className={UtilCSS.errorPageDescBox}>
                            <span className={UtilCSS.errorPageDesc}>
                                앗, 여기는 아무것도 없네요.
                            </span>
                            <span className={UtilCSS.errorPageDesc2}>
                                주소를 잘못 입력하신 것이 아닌지 확인해주세요.<br />
                                계속 오류가 발생한다면, 좌측하단의 링크를 통해 <br />
                                오픈채팅방 관리자에게 말씀해주세요:)
                            </span>
                            <Link href="/">
                                <button className={classnames(UtilCSS.errorGoHome, "purpleButton")}>
                                    홈으로 이동하기
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Error;