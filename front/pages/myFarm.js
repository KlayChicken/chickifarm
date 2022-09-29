import { NextSeo } from 'next-seo';

// page components
import MyFarmComponent from '../components/farm/myFarm/MyFarmComponent';
import PrivateRoute from '../components/util/PrivateRoute';

function MyFarm() {
    return (
        <>
            <NextSeo
                title="ChickiFarm :: 내 농장 꾸미기"
                description="내 치키농장을 꾸밀 수 있어요. 나를 보여줄 수 있는 멋진 농장을 만들어주세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/myfarm',
                    title: '치키농장 :: 내 농장 꾸미기',
                    description: '나를 보여줄 수 있는 멋진 농장을 만들어주세요.'
                }}
            />
            <div className="mainBoard myFarm_mobile">
                <MyFarmComponent />
            </div >
        </>
    );
}

export default PrivateRoute(MyFarm);