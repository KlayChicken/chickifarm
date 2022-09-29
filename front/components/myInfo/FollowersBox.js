import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// images
import itemNotFound from "../../src/image/utils/itemNotFound.png";
import randomChickizLogo from '../../src/image/utils/randomchickiz.png';

// store
import { getMyNeighborFollowers } from '../../store/modules/neighbor/myNeighbor';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css';

function FollowersBox() {

    const router = useRouter();
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.myInfo)
    const { start_followers, myFollowersNum, myFollowersList } = useSelector((state) => state.myNeighbor)

    const [scrollRef, inView, entry] = useInView();

    // neighbor

    useEffect(() => {
        if (inView || start_followers === 0) {
            dispatch(getMyNeighborFollowers({ targetAddress: account, myAddress: account }));
        }
    }, [inView])


    return (
        <>
            <span className={MyInfoCSS.myInfoNFTTitle}>
                {myFollowersNum} Followers
            </span>
            <div className={MyInfoCSS.myInfoNFTGridBox}>
                {
                    myFollowersList.length < 1
                        ?
                        <div className="noNFTBox">
                            <div className="noNFT">
                                <Image className="image100" src={itemNotFound} alt="" />
                            </div>
                        </div>
                        :
                        <div className={classnames(MyInfoCSS.myInfoNFTGrid, "grid3", "mobile_grid2")}>
                            {
                                myFollowersList.map((a, index) => {
                                    return (
                                        <div key={index} className={MyInfoCSS.myInfoNeighborEachBox} onClick={() => { router.push(`/farm/${a.address}`); }}
                                            ref={(myFollowersList.length - 1 === index && myFollowersList.length < myFollowersNum)
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

export default FollowersBox;