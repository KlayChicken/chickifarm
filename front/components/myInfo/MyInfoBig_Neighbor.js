// page scomponents
import FollowingBox from './FollowingBox';
import FollowersBox from './FollowersBox';

import MyInfoCSS from '../../styles/myinfo.module.css';

function MyInfoBig_Neighbor() {

    return (
        <>
            <div className={MyInfoCSS.myInfoNeighborBox}>
                <FollowingBox />
            </div>
            <div className={MyInfoCSS.myInfoNeighborBox}>
                <FollowersBox />
            </div>
        </>
    )
}

export default MyInfoBig_Neighbor;