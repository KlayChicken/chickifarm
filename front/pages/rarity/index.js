import { NextSeo } from "next-seo";

// page components
import RaritySmall from "../../components/rarity/RaritySmall";
import RarityBig from "../../components/rarity/RarityBig";

function Rarity() {

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 치키도감"
                description="치키즈의 모든 정보는 이곳에서"
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/rarity',
                    title: '치키농장 :: 치키도감',
                    description: '치키즈의 모든 정보는 이곳에서'
                }}
            />
            <div className="mainBoard rarity_mobile">
                <RaritySmall />
                <RarityBig />
            </div>
        </>
    );
}

export default Rarity;
