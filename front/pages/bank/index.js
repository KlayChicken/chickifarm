import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NextSeo } from 'next-seo';

// page components
import BankBig from '../../components/bank/BankBig';
import BankSmall from '../../components/bank/BankSmall';

// css
import bankCSS from '../../styles/bank.module.css';

// store
import { getChickizInfo, refreshSelected } from '../../store/modules/lab/mining';

// images

function Bank() {

    return (
        <>
            <NextSeo
                title='ChickiFarm :: 은행'
                description='KLAY와 $CHICK의 교환소'
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/bank',
                    title: '치키농장 :: 은행',
                    description: 'KLAY와 $CHICK의 교환소'
                }}
            />
            <div className="mainBoard bank_mobile">
                <BankBig />
                <BankSmall />
            </div>
        </>
    )
}

export default Bank;