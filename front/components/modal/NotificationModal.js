import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import classnames from 'classnames';
import moment from 'moment';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import randomChickiz from '../../src/image/utils/randomchickiz.png';

// stores
import { getAnnounce, getNotification_guestBook, getNotification_neighbor, getNotification_love, refreshNotiNum } from '../../store/modules/etc'
import { updateLastCheck } from '../../store/modules/myInfo'

// css
import modalCSS from '../../styles/modal.module.css';

function NotificationModal(props) {

    const dispatch = useDispatch();
    const router = useRouter();
    const {
        announceList,

        notificationList_guestBook,
        start_notiGuestBook,
        notiGuestBookTotal,

        notificationList_neighbor,
        start_notiNeighbor,
        notiNeighborTotal,

        notificationList_love,
        start_notiLove,
        notiLoveTotal,

        notiGuestBookNum,
        notiNeighborNum,
        notiLoveNum,
        notiAnnounceNum
    } = useSelector((state) => state.etc);
    const { isUser, account, lastCheck } = useSelector((state) => state.myInfo);

    // template
    const [modalTemplate, setModalTemplate] = useState(null);

    // tab
    const [tabNum, setTabNum] = useState(1);

    // view

    const [scrollRef1, inView1, entry1] = useInView();
    const [scrollRef2, inView2, entry2] = useInView();
    const [scrollRef3, inView3, entry3] = useInView();

    useEffect(() => {
        if (inView1 || start_notiGuestBook === 0) {
            dispatch(getNotification_guestBook(account));
        }
    }, [inView1])

    useEffect(() => {
        if (inView2 || start_notiNeighbor === 0) {
            dispatch(getNotification_neighbor(account));
        }
    }, [inView2])

    useEffect(() => {
        if (inView3 || start_notiLove === 0) {
            dispatch(getNotification_love(account));
        }
    }, [inView3])

    useEffect(() => {
        dispatch(getAnnounce());
        setModalTemplate(props.modalTemplate);
    }, [props.modalTemplate])

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => { props.setModalBool(false); { props.setModalBool(false); dispatch(updateLastCheck(account)); }; dispatch(refreshNotiNum()); }}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.modalContent}>
                    {
                        {
                            "notifications":
                                <div className={modalCSS.notificationBox}>
                                    <div className={modalCSS.notificationHeader}>
                                        <div className={modalCSS.notificationsTab}>
                                            <div className={tabNum === 1 ? modalCSS.notificationsTabEach_selected : modalCSS.notificationsTabEach}
                                                onClick={() => setTabNum(1)}>
                                                <span>
                                                    방명록
                                                </span>
                                                {
                                                    notiGuestBookNum > 0
                                                        ?
                                                        <div className={modalCSS.notificationAlarmOn} />
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className={tabNum === 2 ? modalCSS.notificationsTabEach_selected : modalCSS.notificationsTabEach}
                                                onClick={() => setTabNum(2)}>
                                                <span>
                                                    이웃
                                                </span>
                                                {
                                                    notiNeighborNum > 0
                                                        ?
                                                        <div className={modalCSS.notificationAlarmOn} />
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className={tabNum === 3 ? modalCSS.notificationsTabEach_selected : modalCSS.notificationsTabEach}
                                                onClick={() => setTabNum(3)}>
                                                <span>
                                                    좋아요
                                                </span>
                                                {
                                                    notiLoveNum > 0
                                                        ?
                                                        <div className={modalCSS.notificationAlarmOn} />
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className={tabNum === 4 ? modalCSS.notificationsTabEach_selected : modalCSS.notificationsTabEach}
                                                onClick={() => setTabNum(4)}>
                                                <span>
                                                    공지
                                                </span>
                                                {
                                                    notiAnnounceNum > 0
                                                        ?
                                                        <div className={modalCSS.notificationAlarmOn} />
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        <span className={modalCSS.notificationHeaderLastCheck}>
                                            마지막 확인: {moment(lastCheck).format('MM-DD')}
                                        </span>
                                    </div>
                                    {
                                        {
                                            1:
                                                <div className={modalCSS.notificationsDiv}>
                                                    {
                                                        notificationList_guestBook.map(function (a, index) {
                                                            return (
                                                                <div key={index} className={a.writetime >= lastCheck ? modalCSS.notifications_guestBook_blue : modalCSS.notifications_guestBook}
                                                                    onClick={() => router.push(`/farm/${account}`)}
                                                                    ref={(notificationList_guestBook.length - 1 === index && notificationList_guestBook.length < notiGuestBookTotal)
                                                                        ? scrollRef1 : null}>
                                                                    <div className={modalCSS.notification_repChickiz}>
                                                                        <Image width={128} height={128} src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} />
                                                                    </div>
                                                                    <div className={modalCSS.notification_guestBookContent}>
                                                                        <span className={modalCSS.notification_guestBookMain}>{a.name + "님이 방명록을 남기셨습니다."}</span>
                                                                        <span className={modalCSS.notification_guestBookText}>{a.mainText.length > 20 ? a.mainText.substring(0, 30) + "..." : a.mainText}</span>
                                                                    </div>
                                                                    <span className={modalCSS.notificationsTime}>{moment(a.writetime).format('YY-MM-DD HH:mm')}</span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>,
                                            2:
                                                <div className={modalCSS.notificationsDiv}>
                                                    {
                                                        notificationList_neighbor.map(function (a, index) {
                                                            return (
                                                                <div key={index} className={a.neighborTime >= lastCheck ? modalCSS.notifications_likeNeighbor_blue : modalCSS.notifications_likeNeighbor}
                                                                    onClick={() => router.push(`/farm/${a.fromAddress}`)}
                                                                    ref={(notificationList_neighbor.length - 1 === index && notificationList_neighbor.length < notiNeighborTotal)
                                                                        ? scrollRef2 : null}>
                                                                    <div className={modalCSS.notification_repChickiz}>
                                                                        <Image width={128} height={128} src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} />
                                                                    </div>
                                                                    <span className={modalCSS.notifications_likeNeighborContent}>{a.name + "님이 새로운 이웃이 되었습니다."}</span>
                                                                    <span className={modalCSS.notificationsTime}>{moment(a.neighborTime).format('YY-MM-DD HH:mm')}</span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>,
                                            3:
                                                <div className={modalCSS.notificationsDiv}>
                                                    {
                                                        notificationList_love.map(function (a, index) {
                                                            return (
                                                                <div key={index} className={a.loveTime >= lastCheck ? modalCSS.notifications_likeNeighbor_blue : modalCSS.notifications_likeNeighbor}
                                                                    onClick={() => router.push(`/farm/${a.fromAddress}`)}
                                                                    ref={(notificationList_love.length - 1 === index && notificationList_love.length < notiLoveTotal)
                                                                        ? scrollRef3 : null}>
                                                                    <div className={modalCSS.notification_repChickiz}>
                                                                        <Image width={128} height={128} src={a.repChickiz === null ? randomChickiz : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} />
                                                                    </div>
                                                                    <span className={modalCSS.notifications_likeNeighborContent}>{a.name + "님이 좋아요를 누르셨습니다."}</span>
                                                                    <span className={modalCSS.notificationsTime}>{moment(a.loveTime).format('YY-MM-DD HH:mm')}</span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>,
                                            4:
                                                <div className={modalCSS.notificationsDiv}>
                                                    {
                                                        announceList.map(function (a, index) {
                                                            return (
                                                                <div key={index} className={a.created >= lastCheck ? modalCSS.notifications_announce_blue : modalCSS.notifications_announce} onClick={() => window.open(a.link)}>
                                                                    <span className={modalCSS.notifications_announceContent}>{a.title}</span>
                                                                    <span className={modalCSS.notificationsTime}>{moment(a.created).format('YY-MM-DD HH:mm')}</span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                        }[tabNum]
                                    }
                                </div>
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => { props.setModalBool(false); dispatch(updateLastCheck(account)); dispatch(refreshNotiNum()); }} />
        </>
    );
}

export default NotificationModal;