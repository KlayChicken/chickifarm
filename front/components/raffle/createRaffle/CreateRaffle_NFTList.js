import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';

import Loading from '../../util/Loading';

// page Components
import RaffleKIP17 from '../../nftGrid/RaffleKIP17';

// store
import { getOtherNFTList } from '../../../store/modules/otherNft';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../../styles/myinfo.module.css'

function CreateRaffle_NFTList({ setRaffleNft }) {
    const dispatch = useDispatch();

    const { account } = useSelector((state) => state.myInfo)
    const { otherNFTBalances, otherNFTBalances_loading,
        otherNFT_onStage,
        otherNFTList,
        otherNFTList_loading, } = useSelector((state) => state.otherNft);

    const [nowNFTList, setNowNFTList] = useState([]);

    // loading
    const [wholeLoading, setWholeLoading] = useState(false);

    useEffect(() => {
        if (otherNFT_onStage === null) return
        const nowNFT = otherNFTList.filter((project) => project.name === otherNFT_onStage)[0]
        setNowNFTList(nowNFT);
    }, [otherNFT_onStage, otherNFTList])

    async function clickProject(projectName) {
        if (projectName === otherNFT_onStage || otherNFTList_loading) return
        setWholeLoading(true);
        await dispatch(getOtherNFTList({ account: account, projectName: projectName })).unwrap();
        setWholeLoading(false);
    }

    function setRaffleNftDetails(list, meta, index) {
        setRaffleNft(list.address, list.list[index], list.name, meta)
    }

    return (
        <>
            <div className={MyInfoCSS.myInfoOtherNFTBox}>
                <div className={MyInfoCSS.myInfoOtherNFTListBox}>
                    {
                        otherNFTBalances_loading
                            ?
                            <div className={MyInfoCSS.myInfoNFTLoadingBox}>
                                <div className={MyInfoCSS.myInfoNFTLoadingSemiBox}>
                                    <div className={MyInfoCSS.myInfoNFTLoading}>
                                        <Loading />
                                    </div>
                                    <span className={MyInfoCSS.myInfoNFTLoadingSpan}>
                                        loading...
                                    </span>
                                </div>
                            </div>
                            :
                            <>
                                {
                                    otherNFTBalances.map((a, index) => {
                                        return (
                                            <div className={a.name !== otherNFT_onStage ? MyInfoCSS.myInfoOtherNFTList : classnames(MyInfoCSS.myInfoOtherNFTList, MyInfoCSS.myInfoOtherNFTList_selected)}
                                                key={index} onClick={() => clickProject(a.name)}>
                                                <div className={MyInfoCSS.myInfoOtherNFTListImageBox}>
                                                    <Image width={256} height={256} src={`/image/otherProject/${a.name}.png`} />
                                                </div>
                                                <span className={MyInfoCSS.myInfoOtherNFTListSpan1}>
                                                    {a.name}
                                                </span>
                                                <span className={MyInfoCSS.myInfoOtherNFTListSpan2}>
                                                    {a.balance}개
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </>
                    }
                </div>
                <div className={MyInfoCSS.myInfoOtherNFTGridBox}>
                    {
                        otherNFTList_loading && wholeLoading
                            ?
                            <div className={MyInfoCSS.myInfoNFTLoadingBox}>
                                <div className={MyInfoCSS.myInfoNFTLoadingSemiBox}>
                                    <div className={MyInfoCSS.myInfoNFTLoading}>
                                        <Loading />
                                    </div>
                                    <span className={MyInfoCSS.myInfoNFTLoadingSpan}>
                                        loading...
                                    </span>
                                </div>
                            </div>
                            :
                            otherNFT_onStage === null
                                ?
                                <div className={MyInfoCSS.myInfoOtherNFT_null}>
                                    <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                        좌측의 프로젝트를 클릭해
                                    </span>
                                    <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                        래플을 생성할 <b id="yellow">NFT</b>를 선택하세요.
                                    </span>
                                    <button className={classnames(MyInfoCSS.myInfoOtherNFT_nullButton, "purpleButton")}
                                        onClick={() => window.open('https://klayproject.notion.site/Verified-NFT-LIST-25142c052d2044128cf3a91e298c9a7c')}>
                                        지원 프로젝트 목록 보기
                                    </button>
                                </div>
                                :
                                <>
                                    <div className={classnames(MyInfoCSS.myInfoOtherNFTGrid, "grid3", "mobile_grid3")}>
                                        <RaffleKIP17 list={nowNFTList} nftName={otherNFT_onStage} setRaffleNft={setRaffleNftDetails} />
                                    </div>
                                    {
                                        otherNFTList_loading
                                            ?
                                            <div className={MyInfoCSS.myInfoNFTSemiLoadingBox}>
                                                <div className={MyInfoCSS.myInfoNFTLoading}>
                                                    <Loading />
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                </>
                    }
                </div>
            </div>
        </>
    )
}

export default CreateRaffle_NFTList;