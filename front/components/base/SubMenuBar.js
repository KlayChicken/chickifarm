import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

//image
import homeIcon from '../../src/image/utils/home_white.png';
import myInfoIcon from '../../src/image/utils/infoBook_white.png';
import myFarmIcon from '../../src/image/utils/fence_white.png';
import notificationIcon from '../../src/image/utils/notification.png';
import raffleIcon from '../../src/image/utils/raffle_white.png';

// page components
import NotificationModal from '../modal/NotificationModal';

// css
import classnames from 'classnames';
import BaseCSS from "../../styles/base.module.css"

function SubMenuBar() {

    const dispatch = useDispatch();

    const { account, isUser } = useSelector((state) => state.myInfo);
    const {
        notificationList,
        notiGuestBookNum,
        notiNeighborNum,
        notiLoveNum,
        notiAnnounceNum
    } = useSelector((state) => state.etc);
    const notificationsLength = 5;

    // modal
    const [notificationModalBool, setNotificationModalBool] = useState(false);

    return (
        <>
            <div className={BaseCSS.subMenuBar}>
                <Link href="/">
                    <div className={classnames(BaseCSS.subMenuBox, "neonShine")}>
                        <div className={BaseCSS.subMenuIcon}>
                            <Image className="image100" src={homeIcon} alt="home icon" />
                        </div>
                        <span className={BaseCSS.subMenuSpan}>홈</span>
                    </div>
                </Link>
                <Link href="/myInfo">
                    <div className={classnames(BaseCSS.subMenuBox, "neonShine")}>
                        <div className={BaseCSS.subMenuIcon}>
                            <Image className="image100" src={myInfoIcon} alt="my info icon" />
                        </div>
                        <span className={BaseCSS.subMenuSpan}>내정보</span>
                    </div>
                </Link>
                <Link href={isUser ? `/farm/${account}` : `/signUp`}>
                    <div className={classnames(BaseCSS.subMenuBox, "neonShine")}>
                        <div className={BaseCSS.subMenuIcon}>
                            <Image className="image100" src={myFarmIcon} alt="my farm icon" />
                        </div>
                        <span className={BaseCSS.subMenuSpan}>내농장</span>
                    </div>
                </Link>
                <Link href='/raffle/myRaffle'>
                    <div className={classnames(BaseCSS.subMenuBox, "neonShine")}>
                        <div className={BaseCSS.subMenuIcon}>
                            <Image className="image100" src={raffleIcon} alt="my farm icon" />
                        </div>
                        <span className={BaseCSS.subMenuSpan}>내래플</span>
                    </div>
                </Link>
                <div className={classnames(BaseCSS.subMenuBox, "neonShine")} onClick={() => { if (isUser) { setNotificationModalBool(true) } }}>
                    <div className={BaseCSS.subMenuIcon}>
                        <Image className="image100" src={notificationIcon} alt="my farm icon" />
                    </div>
                    <span className={BaseCSS.subMenuSpan}>알림</span>
                    {
                        notiGuestBookNum + notiNeighborNum + notiLoveNum + notiAnnounceNum > 0
                            ?
                            <div className={BaseCSS.notificationDot}>
                                {
                                    notiGuestBookNum + notiNeighborNum + notiLoveNum + notiAnnounceNum >= 20
                                        ? "20+"
                                        : notiGuestBookNum + notiNeighborNum + notiLoveNum + notiAnnounceNum
                                }
                            </div>
                            :
                            null
                    }
                </div>
            </div>
            {
                notificationModalBool
                    ?
                    <NotificationModal setModalBool={setNotificationModalBool} modalTemplate="notifications" />
                    :
                    null
            }
        </>
    );
}

export default SubMenuBar;