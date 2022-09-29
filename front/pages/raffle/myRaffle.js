import { NextSeo } from "next-seo";
import { useState } from "react";

// page components
import PrivateRoute from '../../components/util/PrivateRoute';
import MyRaffleBig from "../../components/raffle/myRaffle/MyRaffleBig";
import MyRaffleSmall from "../../components/raffle/myRaffle/MyRaffleSmall";

function MyRaffle() {
    const [selectedRaffleId, setSelectedRaffleId] = useState(null);

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 내 래플"
                description="내가 만든 래플과 참여한 래플을 모두 확인하세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/raffle/myRaffle',
                    title: '치키농장 :: 내 래플',
                    description: '내가 만든 래플과 참여한 래플을 모두 확인하세요.'
                }}
            />
            <div className="mainBoard myRaffle_mobile">
                <MyRaffleSmall setSelectedRaffleId={setSelectedRaffleId} selectedRaffleId={selectedRaffleId} />
                <MyRaffleBig setSelectedRaffleId={setSelectedRaffleId} />
            </div>
        </>
    );
}

export default PrivateRoute(MyRaffle);
