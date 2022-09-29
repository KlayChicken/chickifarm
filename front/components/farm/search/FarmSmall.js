import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'
import useInput from '../../../hooks/useInput';

// images
import questionIcon_white from "../../../src/image/utils/question_white.png"
import resetIcon_white from '../../../src/image/utils/reset_white.png'
import findImage from '../../../src/image/utils/find_gray.png'

// data
import farmerRankList from '../../../src/data/farm/FarmerRankList';

// page component
import FarmSurf from './FarmSurf';
import UtilModal from '../../modal/UtilModal';

// store
import { getFarmList, getNeighborFarmList, getRndFarmList, resetFilter } from '../../../store/modules/farm/farmSearch';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function FarmSmall() {

    const dispatch = useDispatch();

    const { isUser, account } = useSelector((state) => state.myInfo)
    const { page, userArray, endNum, sortWay, searchWord,
        onlyNeighbor, filterFarmSign, filterFarmerRank } = useSelector((state) => state.farmSearch)

    useEffect(() => {
        getFarmFirst()
    }, [account])

    const [_filtersortWay, onChangeFilterSortWay] = useInput(sortWay)
    const [_filterSearchWord, onChangeFilterSearchWord] = useInput(searchWord)
    const [_filterFarmerRank, onChangeFilterFarmerRank] = useInput(filterFarmerRank);
    const [_filterFarmSign, onChangeFilterFarmSign] = useInput(filterFarmSign);
    const [_filterNeighbor, setFilterNeighbor] = useState(onlyNeighbor)

    // modal
    const [utilModalBool, setUtilModalBool] = useState(false);

    async function getFarm() {
        if (isUser && _filterNeighbor) {
            dispatch(getNeighborFarmList({
                page: 1,
                sortWay: _filtersortWay,
                searchWord: _filterSearchWord,
                farmSign: _filterFarmSign,
                farmerRank: _filterFarmerRank,
                account: account,
            }))
        } else {
            dispatch(getFarmList({
                page: 1,
                sortWay: _filtersortWay,
                searchWord: _filterSearchWord,
                farmSign: _filterFarmSign,
                farmerRank: _filterFarmerRank,
            }))
        }
    }

    async function getFarmFirst() {
        if (isUser && _filterNeighbor) {
            dispatch(getNeighborFarmList({
                page: page,
                sortWay: _filtersortWay,
                searchWord: _filterSearchWord,
                farmSign: _filterFarmSign,
                farmerRank: _filterFarmerRank,
                account: account,
            }))
        } else {
            dispatch(getFarmList({
                page: page,
                sortWay: _filtersortWay,
                searchWord: _filterSearchWord,
                farmSign: _filterFarmSign,
                farmerRank: _filterFarmerRank,
            }))
        }
    }

    async function filterReset() {
        let trash = { target: { value: '' } };
        let trash1 = { target: { value: 3 } };
        onChangeFilterSortWay(trash1);
        onChangeFilterSearchWord(trash);
        setFilterNeighbor(false);
        onChangeFilterFarmerRank(trash);
        onChangeFilterFarmSign(trash);
        dispatch(resetFilter())
        dispatch(getRndFarmList())
    }
    return (
        <>
            <div className="subBoard_small">
                <div className={FarmCSS.farmFindHeader}>
                    <div className={FarmCSS.farmFindTotalSelectBox}>
                        <span className={FarmCSS.farmFindTotal}>
                            농가수: {endNum}
                        </span>
                        <select className={FarmCSS.farmFindSelect} value={_filtersortWay} onChange={onChangeFilterSortWay}>
                            <option className={FarmCSS.farmFindOption} value={0} >최근 업데이트 순</option>
                            <option className={FarmCSS.farmFindOption} value={1} >치키즈 보유 순</option>
                            <option className={FarmCSS.farmFindOption} value={2} >치키즈 보유 역순</option>
                            <option className={FarmCSS.farmFindOption} value={3} >농장 좋아요 순</option>
                            <option className={FarmCSS.farmFindOption} value={4} >농장 좋아요 역순</option>
                        </select>
                    </div>
                    <div className={FarmCSS.farmFindInputBoxWhole}>
                        <div className={FarmCSS.farmFindInputBox}>
                            <div className={FarmCSS.farmFindIcon} onClick={() => getFarm()}>
                                <Image className="image100" src={findImage} alt="" />
                            </div>
                            <input className={FarmCSS.farmFindInput} value={_filterSearchWord} placeholder="닉네임 혹은 지갑주소 검색" onChange={onChangeFilterSearchWord}
                                onKeyUp={() => {
                                    if (window.event.keyCode === 13) {
                                        getFarm();
                                    }
                                }}>
                            </input>
                        </div>
                        <button className="pageUtilSubmit greenButton" onClick={() => getFarm()}>
                            검색하기
                        </button>
                    </div>
                </div>
                <div className={FarmCSS.farmFindBody}>
                    <div className={FarmCSS.farmFindFilterBox}>
                        <div className={FarmCSS.farmFindFilterCheckWhole}>
                            <div className={FarmCSS.farmFindFilterCheckBox}>
                                <span className={FarmCSS.farmFindFilterCheckTitle}>
                                    이웃농장만 보기
                                </span>
                                <input type="checkbox" disabled={isUser ? 0 : 1} checked={_filterNeighbor} className={FarmCSS.farmFindFilterCheck} onChange={(e) => setFilterNeighbor(e.target.checked)} />
                            </div>
                            <div className={FarmCSS.farmFindFilterCheckBox}>
                                <span className={FarmCSS.farmFindFilterCheckTitle}>
                                    필터 초기화
                                </span>
                                <div className={classnames(FarmCSS.farmFindFilterReset, "neonShine")} onClick={() => filterReset()}>
                                    <Image className="image100" src={resetIcon_white} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={FarmCSS.farmFindFilterRange}>
                            <span className={FarmCSS.farmFindFilterRangeTitle}>
                                농장 직급
                            </span>
                            <div className={FarmCSS.farmFindFilterRangeBox}>
                                <select className={FarmCSS.farmFindFilterSelect2} value={_filterFarmerRank} onChange={onChangeFilterFarmerRank}>
                                    <option className={FarmCSS.farmFindOption} value={''}>전체</option>
                                    {
                                        farmerRankList.map((a, index) => {
                                            return (
                                                <option key={index} className={FarmCSS.farmFindOption} value={index} >{a.name} </option>
                                            )
                                        })
                                    }
                                </select>
                                <div id="balloon_light" balloon="직급 상세 보기" className={FarmCSS.myFarmSkinIconBox} onClick={() => setUtilModalBool(true)}><Image className="image100" src={questionIcon_white} alt="" /></div>
                            </div>
                        </div>
                        <div className={FarmCSS.farmFindFilterRange}>
                            <span className={FarmCSS.farmFindFilterRangeTitle}>
                                농장 팻말
                            </span>
                            <select className={FarmCSS.farmFindFilterSelect} value={_filterFarmSign} onChange={onChangeFilterFarmSign}>
                                <option className={FarmCSS.farmFindOption} value={''}>전체</option>
                                <option className={FarmCSS.farmFindOption} value={0} >태초의 10인</option>
                                <option className={FarmCSS.farmFindOption} value={1} >여명의 20인</option>
                                <option className={FarmCSS.farmFindOption} value={2} >황혼의 30인</option>
                                <option className={FarmCSS.farmFindOption} value={3} >인기만점 10인</option>
                                <option className={FarmCSS.farmFindOption} value={4} >행운의 77인</option>
                                <option className={FarmCSS.farmFindOption} value={5} >행복한 농장</option>
                                <option className={FarmCSS.farmFindOption} value={6} >조용한 농장</option>
                                <option className={FarmCSS.farmFindOption} value={7} >슬픈 농장</option>
                            </select>
                        </div>
                        <div className={FarmCSS.farmFindFilterRange}>
                            <span className={FarmCSS.farmFindFilterRangeTitle}>
                                치키 길드
                            </span>
                            <select className={FarmCSS.farmFindFilterSelect} disabled>
                                <option className={FarmCSS.farmFindOption} value={null}>COMING SOON...</option>
                            </select>
                        </div>
                    </div>
                    <hr className={FarmCSS.farmFindCenterLine} />
                    <FarmSurf />
                </div>
            </div >
            {
                utilModalBool
                    ?
                    <UtilModal setModalBool={setUtilModalBool} modalTemplate="farmQuestion" />
                    :
                    null
            }
        </>
    )
}

export default FarmSmall;