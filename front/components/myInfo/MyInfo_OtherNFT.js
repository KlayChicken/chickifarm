import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';

import Loading from '../util/Loading';

// data
import OtherNFTProjectList from '../../src/data/contract/OtherNFTProjectList';

// page Components
import OtherKIP17 from '../nftGrid/OtherKIP17';
import OtherNftModal from '../modal/OtherNftModal';

// store
import { resetOtherNFT, getOtherNFTList } from '../../store/modules/otherNft';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css'

function MyInfo_OtherNFT() {
    const dispatch = useDispatch();

    const { account } = useSelector((state) => state.myInfo)
    const { otherNFTBalances, otherNFTBalances_loading,
        otherNFT_onStage,
        otherNFTList,
        otherNFTList_loading, } = useSelector((state) => state.otherNft);

    const [nowNFTList, setNowNFTList] = useState([]);

    // loading
    const [wholeLoading, setWholeLoading] = useState(false);

    // modal
    const [nftModalBool, setNftModalBool] = useState(false);

    const [tokenId, setTokenId] = useState(null);
    const [nftMeta, setNftMeta] = useState({});
    const [nftAddress, setNftAddress] = useState("");

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

    function openDetails(list, meta, index) {
        setNftMeta(meta);
        setTokenId(list.list[index])
        setNftAddress(list.address)
        setNftModalBool(true);
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
                            otherNFTBalances.map((a, index) => {
                                if (a.name === 'Chickiz' || a.name === 'KlayChicken V1' || a.name === 'KlayChicken Sunsal') return
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
                            otherNFT_onStage === null || otherNFT_onStage === 'Chickiz' || otherNFT_onStage === 'KlayChicken V1' || otherNFT_onStage === 'KlayChicken Sunsal'
                                ?
                                <div className={MyInfoCSS.myInfoOtherNFT_null}>
                                    <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                        좌측의 프로젝트를 클릭해
                                    </span>
                                    <span className={MyInfoCSS.myInfoOtherNFT_nullSpan}>
                                        보유한 NFT를 확인하세요.
                                    </span>
                                    <button className={classnames(MyInfoCSS.myInfoOtherNFT_nullButton, "purpleButton")}
                                        onClick={() => window.open('https://klayproject.notion.site/Verified-NFT-LIST-25142c052d2044128cf3a91e298c9a7c')}>
                                        지원 프로젝트 목록 보기
                                    </button>
                                </div>
                                :
                                <>
                                    <div className={classnames(MyInfoCSS.myInfoOtherNFTGrid, "grid3", "mobile_grid3")}>
                                        <OtherKIP17 list={nowNFTList} nftName={otherNFT_onStage} openDetails={openDetails} />
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
            {
                nftModalBool
                    ?
                    <OtherNftModal projectName={nowNFTList.name} projectAddress={nftAddress}
                        tokenId={tokenId} meta={nftMeta}
                        twitterUrl={nowNFTList.twitter} discordUrl={nowNFTList.discord}
                        setModalBool={setNftModalBool} />
                    :
                    null
            }
        </>
    )
}

export default MyInfo_OtherNFT;