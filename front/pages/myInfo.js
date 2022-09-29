import { useState } from 'react';
import { NextSeo } from 'next-seo';

// page scomponents
import PrivateRoute from '../components/util/PrivateRoute';
import MyInfoSmall from '../components/myInfo/MyInfoSmall';
import MyInfoBig_NFT from '../components/myInfo/MyInfoBig_NFT';
import MyInfoBig_Neighbor from '../components/myInfo/MyInfoBig_Neighbor';

// css
import classnames from 'classnames';
import MyInfoCSS from '../styles/myinfo.module.css'

function MyInfo() {

    const [tabNum, setTabNum] = useState(0);

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 내 정보"
                description="내 정보 페이지입니다. 나를 소개해주세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/myInfo',
                    title: '치키농장 :: 내 정보',
                    description: '내 정보 페이지입니다. 나를 소개해주세요.'
                }}
            />
            <div className="mainBoard myInfo_mobile">
                <div className="subBoard_small">
                    <MyInfoSmall />
                </div>
                <div className="subBoard_big">
                    <div className={classnames("pageHeaderBox", MyInfoCSS.myInfoTabBox)}>
                        <span className={tabNum === 0 ? MyInfoCSS.myInfoTabSelected : MyInfoCSS.myInfoTab} onClick={() => setTabNum(0)}>
                            내 NFT
                        </span>
                        <span className={tabNum === 1 ? MyInfoCSS.myInfoTabSelected : MyInfoCSS.myInfoTab} onClick={() => setTabNum(1)}>
                            이웃 농장
                        </span>
                    </div>
                    <div className="pageContentBox">
                        {
                            {
                                0:
                                    <MyInfoBig_NFT />
                                ,
                                1:
                                    <MyInfoBig_Neighbor />
                            }[tabNum]
                        }
                    </div>
                </div>
            </div >
        </>
    );
}

export default PrivateRoute(MyInfo);