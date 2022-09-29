import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NextSeo } from 'next-seo';

// page components
import MiningBig from '../../components/lab/mining/MiningBig';
import MiningSmall from '../../components/lab/mining/MiningSmall';

// css
import labCSS from '../../styles/lab.module.css';

// store
import { getChickizInfo, refreshSelected } from '../../store/modules/lab/mining';

// images

function Mining() {

    const dispatch = useDispatch();

    const [now, setNow] = useState(Math.ceil(Date.now() / 1000))

    const refresh = () => {
        dispatch(getChickizInfo());
        dispatch(refreshSelected());
        setNow(Math.ceil(Date.now() / 1000))
    }

    return (
        <>
            <NextSeo
                title='ChickiFarm :: 채굴하기'
                description='치키즈로 $CHICK을 획득해보세요.'
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/lab/mining',
                    title: '치키농장 :: 채굴하기',
                    description: '치키즈로 $CHICK을 획득해보세요.'
                }}
            />
            <div className="mainBoard mining_mobile">
                <MiningBig refresh={refresh} now={now} />
                <MiningSmall refresh={refresh} now={now} />
            </div>
        </>
    )
}

export default Mining;