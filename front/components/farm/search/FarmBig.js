import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'

import itemNotFound from '../../../src/image/utils/itemNotFound.png'
import heartIcon_white from '../../../src/image/utils/heart_white.png'
import randomChickizLogo from '../../../src/image/utils/randomchickiz.png'
import { getFarmList, getNeighborFarmList } from '../../../store/modules/farm/farmSearch'

import farmerRankList from '../../../src/data/farm/FarmerRankList';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function FarmBig() {

    const dispatch = useDispatch();
    const { isUser, account } = useSelector((state) => state.myInfo)
    const { userArray, page, endNum, sortWay, searchWord,
        onlyNeighbor, filterFarmSign, filterFarmerRank } = useSelector((state) => state.farmSearch)

    async function Left() {
        if (page <= 1) return;
        changePage(page - 1)
    }

    async function Right() {
        if (page >= Math.ceil(endNum / 8)) return;
        changePage(page + 1)
    }

    async function changePage(newNum) {
        if (isUser && onlyNeighbor) {
            dispatch(getNeighborFarmList({
                page: newNum,
                sortWay: sortWay,
                searchWord: searchWord,
                farmSign: filterFarmSign,
                farmerRank: filterFarmerRank,
                account: account,
            }))
        } else {
            dispatch(getFarmList({
                page: newNum,
                sortWay: sortWay,
                searchWord: searchWord,
                farmSign: filterFarmSign,
                farmerRank: filterFarmerRank,
            }))
        }
    }

    return (
        <div className="subBoard_big">
            <div className="pageHeaderBox">
                <div className="pageTitleBox">
                    <Link href="/">
                        <span className="pageTitle">
                            HOME
                        </span>
                    </Link>
                    <span className="pageTitleArrow">
                        &gt;
                    </span>
                    <span className="pageTitle">
                        치키농장
                    </span>
                </div>
                <div className="pageUtilBox">
                    <Link href={isUser ? `/farm/${account}` : '/signUp'}>
                        <button className="pageUtilSubmit greenButton">
                            내 농장 가기
                        </button>
                    </Link>
                </div>
            </div>
            <div className="pageContentBox">
                {
                    userArray.length < 1
                        ?
                        <div className="noNFTBox">
                            <div className='noNFT'>
                                <Image className="image100" src={itemNotFound} alt="" />
                                <div className="noNFTDescBox">
                                    <span className="noNFTDesc">
                                        검색 결과가 없습니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            <div className={FarmCSS.farmFindListBox}>
                                <div className={FarmCSS.farmFindListGrid}>
                                    {
                                        userArray.map((a, index) => {
                                            return (
                                                <Link className={FarmCSS.farmFindEachBox} href={`/farm/${a.address}`} key={index}>
                                                    <div key={index} className={FarmCSS.farmerListBox}>
                                                        {
                                                            a.farmSign === null
                                                                ?
                                                                null
                                                                :
                                                                <div className={FarmCSS.farmerInfoSignImage}>
                                                                    <Image width={300} height={130} priority={true} src={`https://api.klaychicken.com/sign/image/${a.farmSign}.png`} alt="" />
                                                                </div>
                                                        }
                                                        <div className={FarmCSS.farmerImage}>
                                                            <Image className="image100" priority={true} width="256" height="256" src={a.repChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2small/${a.repChickiz}.png`} alt="" />
                                                        </div>
                                                        <div className={FarmCSS.farmerInfoBox}>
                                                            <div className={FarmCSS.farmerInfoTopBox}>
                                                                <span className={FarmCSS.farmerInfoName}>
                                                                    {a.name}
                                                                </span>
                                                                <span className={FarmCSS.farmerInfoAddress}>
                                                                    {a.address.substring(0, 7)} ......
                                                                </span>
                                                            </div>
                                                            <div className={FarmCSS.farmerInfoBottomBox}>
                                                                <span className={classnames(FarmCSS.farmerInfoRank, farmerRankList[a.rankNum].class)}>
                                                                    {farmerRankList[a.rankNum].name}
                                                                </span>
                                                                <span className={FarmCSS.farmerInfoChickizQuan}>
                                                                    {a.chickizQuan === null ? 0 : a.chickizQuan} 치키
                                                                </span>
                                                                <span className={FarmCSS.farmerInfoLoveQuan}>
                                                                    <div className={FarmCSS.farmerInfoLoveImg}>
                                                                        <Image src={heartIcon_white} alt="" />
                                                                    </div>
                                                                    <span>
                                                                        {a.farmLove === null ? 0 : a.farmLove}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className={FarmCSS.paginationFooter}>
                                <div className={FarmCSS.paginationArrowBox} onClick={() => Left()}>
                                    {
                                        page <= 1
                                            ?
                                            null
                                            :
                                            <div className={FarmCSS.paginationLeftArrowBox}>
                                            </div>
                                    }
                                </div>
                                <span className={FarmCSS.paginationNumber}>
                                    {page}
                                </span>
                                <div className={FarmCSS.paginationArrowBox} onClick={() => Right()}>
                                    {
                                        page >= Math.ceil(endNum / 8)
                                            ?
                                            null
                                            :
                                            <div className={FarmCSS.paginationRightArrowBox}>
                                            </div>
                                    }
                                </div>
                            </div>
                        </>
                }
            </div>
        </div >
    )
}

export default FarmBig;