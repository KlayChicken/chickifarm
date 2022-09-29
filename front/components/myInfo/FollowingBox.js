import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// images
import itemNotFound from "../../src/image/utils/itemNotFound.png";
import randomChickizLogo from '../../src/image/utils/randomchickiz.png';

// store
import { getMyNeighborFollowing } from '../../store/modules/neighbor/myNeighbor';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css';

function FollowingBox() {

    const router = useRouter();
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.myInfo)
    const { start_following, myFollowingNum, myFollowingList } = useSelector((state) => state.myNeighbor)

    const [scrollRef, inView, entry] = useInView();

    // neighbor

    useEffect(() => {
        if (inView || start_following === 0) {
            dispatch(getMyNeighborFollowing({ targetAddress: account, myAddress: account }));
        }
    }, [inView])


    return (
        <>
            <span className={MyInfoCSS.myInfoNFTTitle}>
                {myFollowingNum} Following
            </span>
            <div className={MyInfoCSS.myInfoNFTGridBox}>
                {
                    myFollowingList.length < 1
                        ?
                        <div className="noNFTBox">
                            <div className="noNFT">
                                <Image className="image100" src={itemNotFound} alt="" />
                            </div>
                        </div>
                        :
                        <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid3", "mobile_grid2")}>
                            {
                                myFollowingList.map((a, index) => {
                                    return (
                                        <div key={index} className={MyInfoCSS.myInfoNeighborEachBox} onClick={() => { router.push(`/farm/${a.address}`); }}
                                            ref={(myFollowingList.length - 1 === index && myFollowingList.length < myFollowingNum)
                                                ? scrollRef : null}>
                                            <div className={MyInfoCSS.myInfoNeighborEachImageBox}>
                                                <Image width={256} height={256} priority={true} className="image100" src={a.repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${a.repChickiz}.png`} alt="" />
                                            </div>
                                            <div className={MyInfoCSS.myInfoNeigborEachDetailBox}>
                                                <span className={MyInfoCSS.myInfoNeigborEachDetailName}>{a.name}</span>
                                                {
                                                    a.iFollow === 1
                                                        ?
                                                        <span className={classnames(MyInfoCSS.myInfoNeighborEachDetailStatus, MyInfoCSS.myInfoNeighborEachDetailGreen)}>
                                                            이웃
                                                        </span>
                                                        :
                                                        <span className={classnames(MyInfoCSS.myInfoNeighborEachDetailStatus, MyInfoCSS.myInfoNeighborEachDetailRed)}>
                                                            이웃 X
                                                        </span>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                }
            </div>
        </>
    )
}

export default FollowingBox;