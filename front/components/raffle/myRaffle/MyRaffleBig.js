import { useState } from "react";

// css
import classnames from "classnames";
import RaffleCSS from "../../../styles/raffle.module.css";
import MyInfoCSS from '../../../styles/myinfo.module.css'

// page components
import MyRaffle_buy from "./MyRaffle_buy";
import MyRaffle_create from "./MyRaffle_create";
import MyRaffle_favorite from "./MyRaffle_favorite";

function MyRaffleBig({ setSelectedRaffleId }) {

    const [tabNum, setTabNum] = useState(0);

    return (
        <>
            <div className="subBoard_big">
                <div className={classnames("pageHeaderBox", MyInfoCSS.myInfoTabBox)}>
                    <span className={tabNum === 0 ? MyInfoCSS.myInfoTabSelected : MyInfoCSS.myInfoTab} onClick={() => setTabNum(0)}>
                        구매한 래플
                    </span>
                    <span className={tabNum === 1 ? MyInfoCSS.myInfoTabSelected : MyInfoCSS.myInfoTab} onClick={() => setTabNum(1)}>
                        생성한 래플
                    </span>
                    <span className={tabNum === 2 ? MyInfoCSS.myInfoTabSelected : MyInfoCSS.myInfoTab} onClick={() => setTabNum(2)}>
                        찜한 래플
                    </span>
                </div>
                <div className="pageContentBox">
                    {
                        {
                            0:
                                <MyRaffle_buy setSelectedRaffleId={setSelectedRaffleId} />,
                            1:
                                <MyRaffle_create setSelectedRaffleId={setSelectedRaffleId} />,
                            2:
                                <MyRaffle_favorite setSelectedRaffleId={setSelectedRaffleId} />,
                        }[tabNum]
                    }
                </div>
            </div>
        </>
    );
}

export default MyRaffleBig;