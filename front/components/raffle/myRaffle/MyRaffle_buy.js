import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';

// page components
import RaffleListShow from '../search/RaffleListShow';
import useInput from '../../../hooks/useInput';

// css
import RaffleCSS from '../../../styles/raffle.module.css';
import classnames from 'classnames';

// data
import OtherNFTProjectList from '../../../src/data/contract/OtherNFTProjectList';

// image
import refreshIcon from '../../../src/image/utils/reset_white.png'

// store
import {
    getMyRaffleList_buy_live_first, getMyRaffleList_buy_live_more,
    getMyRaffleList_buy_end_first, getMyRaffleList_buy_end_more,
    getMyRaffleList_buy_win_first, getMyRaffleList_buy_win_more
} from '../../../store/modules/raffle/myRaffle';

function MyRaffle_buy({ setSelectedRaffleId }) {

    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.myInfo);
    const {
        myRaffleList_buy_live, getDone_buy_live, loading_buy_live, loading_buy_live_more,
        myRaffleList_buy_end, getDone_buy_end, loading_buy_end, loading_buy_end_more,
        myRaffleList_buy_win, getDone_buy_win, loading_buy_win, loading_buy_win_more,
    } = useSelector((state) => state.myRaffle);

    const [statusBtn, setStatusBtn] = useState(0);

    //const [_filterRaffleCollection, onChangeFilterRaffleCollection] = useInput(0);

    //const [raffleList_live, setRaffleList_live] = useState([]);
    //
    //useEffect(() => {
    //    if (Number(_filterRaffleCollection) === 0) {
    //        setRaffleList_live(myRaffleList_buy_live)
    //    } else {
    //        const _myRaffleList_buy_live = myRaffleList_buy_live;
    //        const array = _myRaffleList_buy_live.filter((a) => a.collection === _filterRaffleCollection)
    //        setRaffleList_live(array)
    //    }
    //}, [_filterRaffleCollection, myRaffleList_buy_live])

    const buy_live_first = useCallback(() => {
        dispatch(getMyRaffleList_buy_live_first({ account: account }));
    }, [])

    const buy_end_first = useCallback(() => {
        dispatch(getMyRaffleList_buy_end_first({ account: account }));
    }, [])

    const buy_win_first = useCallback(() => {
        dispatch(getMyRaffleList_buy_win_first({ account: account }));
    }, [])

    const buy_live_more = useCallback(() => {
        dispatch(getMyRaffleList_buy_live_more({ account: account }));
    }, [])

    const buy_end_more = useCallback(() => {
        dispatch(getMyRaffleList_buy_end_more({ account: account }));
    }, [])

    const buy_win_more = useCallback(() => {
        dispatch(getMyRaffleList_buy_win_more({ account: account }));
    }, [])

    const refresh = () => {
        //document.querySelector(`.${RaffleCSS.myRaffleWholeBox}`).scrollTop = 0;
        switch (statusBtn) {
            case 0:
                buy_live_first();
                break;
            case 1:
                buy_end_first();
                break;
            case 2:
                buy_win_first();
                break;
            default:
                return
        }
    }

    return (
        <>
            <div className={RaffleCSS.myRaffleHeader}>
                <div className={RaffleCSS.myRaffleStatusBtnBox}>
                    <button className={statusBtn === 0 ? classnames(RaffleCSS.myRaffleStatusBtn, RaffleCSS.myRaffleStatusBtnSelected) : RaffleCSS.myRaffleStatusBtn}
                        onClick={() => setStatusBtn(0)}>
                        LIVE
                    </button>
                    <button className={statusBtn === 1 ? classnames(RaffleCSS.myRaffleStatusBtn, RaffleCSS.myRaffleStatusBtnSelected) : RaffleCSS.myRaffleStatusBtn}
                        onClick={() => setStatusBtn(1)}>
                        END
                    </button>
                    <button className={statusBtn === 2 ? classnames(RaffleCSS.myRaffleStatusBtn, RaffleCSS.myRaffleStatusBtnSelected) : RaffleCSS.myRaffleStatusBtn}
                        onClick={() => setStatusBtn(2)}>
                        당첨된 래플
                    </button>
                </div>
                <div id='balloon_light' balloon='리스트 새로고침' className={classnames(RaffleCSS.myRaffleResetButton, "neonShine")} onClick={refresh}>
                    <Image className='image100' src={refreshIcon} alt='새로고침' />
                </div>
                {
                    /*
                <select className={RaffleCSS.myRaffleSelect} value={_filterRaffleCollection} onChange={onChangeFilterRaffleCollection}>
                    <option className={RaffleCSS.raffleFindOption2} value={0}>전체</option>
                    {
                        OtherNFTProjectList.map((a, index) => {
                            return (
                                <option key={index} className={RaffleCSS.raffleFindOption2} value={a.name} >{a.name} </option>
                            )
                        })
                    }
                </select>
                    */
                }
            </div>
            <div className={RaffleCSS.myRaffleWholeBox}>
                {
                    {
                        0:
                            <RaffleListShow
                                raffleList={myRaffleList_buy_live}
                                getDone={getDone_buy_live}
                                loading={loading_buy_live}
                                loading_more={loading_buy_live_more}
                                setSelectedRaffleId={setSelectedRaffleId}
                                getListFirst={buy_live_first}
                                getListMore={buy_live_more} />
                        ,
                        1:
                            <RaffleListShow
                                raffleList={myRaffleList_buy_end}
                                getDone={getDone_buy_end}
                                loading={loading_buy_end}
                                loading_more={loading_buy_end_more}
                                setSelectedRaffleId={setSelectedRaffleId}
                                getListFirst={buy_end_first}
                                getListMore={buy_end_more} />
                        ,
                        2:
                            <RaffleListShow
                                raffleList={myRaffleList_buy_win}
                                getDone={getDone_buy_win}
                                loading={loading_buy_win}
                                loading_more={loading_buy_win_more}
                                setSelectedRaffleId={setSelectedRaffleId}
                                getListFirst={buy_win_first}
                                getListMore={buy_win_more} />
                    }[statusBtn]
                }
            </div>
        </>
    )

}

export default MyRaffle_buy;