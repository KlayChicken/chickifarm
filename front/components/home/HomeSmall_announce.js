import { useSelector } from "react-redux"

// styles
import HomeCSS from '../../styles/Home.module.css';

function HomeSmall_announce() {

    const { announceList } = useSelector((state) => state.etc)

    return (
        <div className={HomeCSS.homeAnnouncementBox}>
            <span className={HomeCSS.homeUtilBoxSubtitle}>
                패치노트
            </span>
            <div className={HomeCSS.homeAnnouncement}>
                {
                    announceList.map((a, index) => {
                        return (
                            <span key={index} className={HomeCSS.homeAnnouncementEach} onClick={() => window.open(a.link)}>
                                {a.title}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default HomeSmall_announce;