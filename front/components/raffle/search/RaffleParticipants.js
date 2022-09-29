import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from 'react-intersection-observer';

// css
import classnames from 'classnames';
import RaffleCSS from "../../../styles/raffle.module.css";

// image
import itemNotFound from '../../../src/image/utils/itemNotFound.png';

// store
import { getBuyerList_more } from "../../../store/modules/raffle/raffle";

function RaffleParticipants({ selectedRaffleId }) {

    const dispatch = useDispatch();

    const { buyerList, getDone_buyer } = useSelector((state) => state.raffle);
    const [scrollRef, inView, entry] = useInView();

    useEffect(() => {
        if (inView && !getDone_buyer) {
            dispatch(getBuyerList_more({ raffleId: selectedRaffleId }));
        }
    }, [inView])

    return (
        <>
            <div className={RaffleCSS.raffleParticipantsBox}>
                <table className={RaffleCSS.raffleParticipantsTable}>
                    <thead className={RaffleCSS.raffleParticipantsTableThead}>
                        <tr className={RaffleCSS.raffleParticipantsTableTheadTr}>
                            <th className={RaffleCSS.raffleParticipantsTableTh}>농장주</th>
                            <th className={RaffleCSS.raffleParticipantsTableTh}>구매 티켓 수</th>
                        </tr>
                    </thead>
                </table>
                <div className={RaffleCSS.raffleParticipantsBox2}>
                    {
                        buyerList.length < 1
                            ?
                            <div className="noNFTBox">
                                <div className="noNFT">
                                    <Image className="image100" src={itemNotFound} alt="" />
                                    <div className="noNFTDescBox">
                                        <span className="noNFTDesc">
                                            아직 구매자가 없어요.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <table className={RaffleCSS.raffleParticipantsTable2}>
                                <tbody className={RaffleCSS.raffleParticipantsTableTbody}>
                                    {
                                        buyerList.map((a, index) => {
                                            return (
                                                <tr className={RaffleCSS.raffleParticipantsTableTbodyTr} key={index}
                                                    ref={(buyerList.length - 1 === index && !getDone_buyer)
                                                        ? scrollRef
                                                        : null}>
                                                    <td className={RaffleCSS.raffleParticipantsTableTd}><span id='balloon_light' balloon='농장 방문하기' onClick={() => window.open(`https://chickifarm.com/farm/${a.buyer}`)}><b id='hyperBlue'>{a.name}</b></span></td>
                                                    <td className={RaffleCSS.raffleParticipantsTableTd}>{a.buyQuan}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </>
    );
}

export default RaffleParticipants;