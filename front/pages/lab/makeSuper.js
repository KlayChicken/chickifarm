import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NextSeo } from 'next-seo';

// page components
import MakeSuperBig from '../../components/lab/makeSuper/MakeSuperBig';
import MakeSuperSmall from '../../components/lab/makeSuper/MakeSuperSmall';

// css
import labCSS from '../../styles/lab.module.css';

// store
import { getChickizInfo, refreshSelected } from '../../store/modules/lab/mining';

// images

function MakeSuper() {

    return (
        <>
            <NextSeo
                title='ChickiFarm :: 슈퍼치키즈 만들기'
                description='내 치키즈가 슈퍼맨으로 변신하는 곳.'
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/lab/makeSuper',
                    title: '치키농장 :: 슈퍼치키즈 만들기',
                    description: '내 치키즈가 슈퍼맨으로 변신하는 곳.'
                }}
            />
            <div className="mainBoard makeSuper_mobile">
                <MakeSuperBig />
                <MakeSuperSmall />
            </div>
        </>
    )
}

export default MakeSuper;