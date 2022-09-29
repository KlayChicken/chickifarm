import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';

// page components
import RaffleListShow from '../search/RaffleListShow';

// css
import RaffleCSS from '../../../styles/raffle.module.css';
import classnames from 'classnames';

// image
import refreshIcon from '../../../src/image/utils/reset_white.png'

// store
import {
    getMyRaffleList_create_live_first, getMyRaffleList_create_live_more,
    getMyRaffleList_create_end_first, getMyRaffleList_create_end_more,
} from '../../../store/modules/raffle/myRaffle';

function MyRaffle_create({ setSelectedRaffleId }) {

    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.myInfo);
    const {
        myRaffleList_create_live, getDone_create_live, loading_create_live, loading_create_live_more,
        myRaffleList_create_end, getDone_create_end, loading_create_end, loading_create_end_more,
    } = useSelector((state) => state.myRaffle);

    const [statusBtn, setStatusBtn] = useState(0);

    const create_live_first = useCallback(() => {
        dispatch(getMyRaffleList_create_live_first({ account: account }));
    }, [])

    const create_end_first = useCallback(() => {
        dispatch(getMyRaffleList_create_end_first({ account: account }));
    }, [])

    const create_live_more = useCallback(() => {
        dispatch(getMyRaffleList_create_live_more({ account: account }));
    }, [])

    const create_end_more = useCallback(() => {
        dispatch(getMyRaffleList_create_end_more({ account: account }));
    }, [])

    const refresh = () => {
        //document.querySelector(`.${RaffleCSS.myRaffleWholeBox}`).scrollTop = 0;
        switch (statusBtn) {
            case 0:
                create_live_first();
                break;
            case 1:
                create_end_first();
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
                </div>
                <div id='balloon_light' balloon='리스트 새로고침' className={classnames(RaffleCSS.myRaffleResetButton, "neonShine")} onClick={refresh}>
                    <Image className='image100' src={refreshIcon} alt='새로고침' />
                </div>
            </div>
            <div className={RaffleCSS.myRaffleWholeBox}>
                {
                    {
                        0:
                            <RaffleListShow
                                raffleList={myRaffleList_create_live}
                                getDone={getDone_create_live}
                                loading={loading_create_live}
                                loading_more={loading_create_live_more}
                                setSelectedRaffleId={setSelectedRaffleId}
                                getListFirst={create_live_first}
                                getListMore={create_live_more} />
                        ,
                        1:
                            <RaffleListShow
                                raffleList={myRaffleList_create_end}
                                getDone={getDone_create_end}
                                loading={loading_create_end}
                                loading_more={loading_create_end_more}
                                setSelectedRaffleId={setSelectedRaffleId}
                                getListFirst={create_end_first}
                                getListMore={create_end_more} />
                    }[statusBtn]
                }
            </div>
        </>
    )

}

export default MyRaffle_create;