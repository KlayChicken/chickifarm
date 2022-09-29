import { NextSeo } from "next-seo";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/router';

// page components
import RaffleBig from "../../components/raffle/search/RaffleBig";
import RaffleSmall from "../../components/raffle/search/RaffleSmall";

function Raffle() {
    const router = useRouter();
    const { asPath } = router;
    const [selectedRaffleId, setSelectedRaffleId] = useState(null);

    useEffect(() => {
        if (asPath !== '/raffle') {
            setSelectedRaffleId(Number(asPath.substring(11)));
            router.replace('/raffle')
        }
    }, [])

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 래플"
                description="래플 페이지입니다. 오늘 행운의 주인공은 바로 나!"
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/raffle',
                    title: '치키농장 :: 래플',
                    description: '래플 페이지입니다. 오늘 행운의 주인공은 바로 나!'
                }}
            />
            <div className="mainBoard raffle_mobile">
                <RaffleBig setSelectedRaffleId={setSelectedRaffleId} />
                <RaffleSmall setSelectedRaffleId={setSelectedRaffleId} selectedRaffleId={selectedRaffleId} />
            </div>
        </>
    );
}

export default Raffle;
