import { NextSeo } from 'next-seo';
import FarmBig from '../../components/farm/search/FarmBig';
import FarmSmall from '../../components/farm/search/FarmSmall';

function FarmSearch() {
    return (
        <>
            <NextSeo
                title="ChickiFarm :: 농장 검색"
                description="이웃 농장을 구경해 보세요. 친절한 이웃들이 당신을 기다리고 있어요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/farm',
                    title: '치키농장 :: 농장 검색',
                    description: "이웃 농장을 구경해 보세요.",
                }}
            />
            <div className="mainBoard farm_mobile">
                <FarmBig />
                <FarmSmall />
            </div >
        </>
    );
}

export default FarmSearch;