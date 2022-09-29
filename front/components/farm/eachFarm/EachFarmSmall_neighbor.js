import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// images
import randomChickizLogo from "../../../src/image/utils/randomchickiz.png";
import findImage from '../../../src/image/utils/find_gray.png';
import itemNotFound from "../../../src/image/utils/itemNotFound.png"

// store
import { getUserNeighborFollowing } from '../../../store/modules/neighbor/userNeighborFollowing';
import { getUserNeighborFollowers } from '../../../store/modules/neighbor/userNeighborFollowers';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function EachFarmSmall_neighbor() {

    const router = useRouter();
    const { address } = router.query;

    const dispatch = useDispatch();
    const userNeighborFollowing = useSelector((state) => state.userNeighborFollowing[address])
    const userNeighborFollowers = useSelector((state) => state.userNeighborFollowers[address])

    const [scrollRef1, inView1, entry1] = useInView();
    const [scrollRef2, inView2, entry2] = useInView();

    useEffect(() => {
        if (address === undefined) return;
        if (inView1 || userNeighborFollowing?.start === undefined) {
            dispatch(getUserNeighborFollowing({ targetAddress: address }))
        }
    }, [inView1, address])

    useEffect(() => {
        if (address === undefined) return;
        if (inView2 || userNeighborFollowers?.start === undefined) {
            dispatch(getUserNeighborFollowers({ targetAddress: address }))
        }
    }, [inView2, address])

    return (
        <div className={FarmCSS.eachFarmFarmerDetailBox}>
            <div className={FarmCSS.eachFarmFarmerNeighborBox}>
                <div className={FarmCSS.eachFarmFarmerNeighborEach}>
                    <span className={FarmCSS.eachFarmFarmerNeighborTitle}>
                        {userNeighborFollowing?.followingNum} Following
                    </span>
                    <div className={FarmCSS.eachFarmFarmerNeighborBodyBox}>
                        {
                            userNeighborFollowing?.followingNum === 0
                                ?
                                <div className="noNFTBox">
                                    <div className="noNFT">
                                        <Image className="image100" src={itemNotFound} alt="" />
                                    </div>
                                </div>
                                :
                                userNeighborFollowing?.followingList.map((a, index) => {
                                    return (
                                        <div key={index} className={FarmCSS.eachFarmFarmerNeighborBodyEachBox} onClick={() => { router.push(`/farm/${a.address}`); }}
                                            ref={(userNeighborFollowing?.followingList.length - 1 === index && userNeighborFollowing?.followingList.length < userNeighborFollowing?.followingNum)
                                                ? scrollRef1 : null}>
                                            <div className={FarmCSS.eachFarmFarmerNeighborBodyEachImageBox}>
                                                <Image width={128} height={128} className="image100" src={a.repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${a.repChickiz}.png`} alt="" />
                                            </div>
                                            <div className={FarmCSS.eachFarmFarmerNeighborBodyEachDetailBox}>
                                                <span className={FarmCSS.eachFarmFarmerNeighborBodyEachDetailName}>{a.name}</span>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
                <div className={FarmCSS.eachFarmFarmerNeighborEach}>
                    <span className={FarmCSS.eachFarmFarmerNeighborTitle}>
                        {userNeighborFollowers?.followersNum} Followers
                    </span>
                    <div className={FarmCSS.eachFarmFarmerNeighborBodyBox}>
                        {
                            userNeighborFollowers?.followersNum === 0
                                ?
                                <div className="noNFTBox">
                                    <div className="noNFT">
                                        <Image className="image100" src={itemNotFound} alt="" />
                                    </div>
                                </div>
                                :
                                userNeighborFollowers?.followersList.map((a, index) => {
                                    return (
                                        <div key={index} className={FarmCSS.eachFarmFarmerNeighborBodyEachBox} onClick={() => router.push(`/farm/${a.address}`)}
                                            ref={(userNeighborFollowers?.followersList.length - 1 === index && userNeighborFollowers?.followersList.length < userNeighborFollowers?.followersNum)
                                                ? scrollRef2 : null}>
                                            <div className={FarmCSS.eachFarmFarmerNeighborBodyEachImageBox}>
                                                <Image width={128} height={128} className="image100" src={a.repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${a.repChickiz}.png`} alt="" />
                                            </div>
                                            <div className={FarmCSS.eachFarmFarmerNeighborBodyEachDetailBox}>
                                                <span className={FarmCSS.eachFarmFarmerNeighborBodyEachDetailName}>{a.name}</span>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EachFarmSmall_neighbor;