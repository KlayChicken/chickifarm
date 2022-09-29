import { NextSeo } from 'next-seo';

// components
import Error from '../components/util/Error'

function ErrorAll() {

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 존재하지 않는 페이지입니다."
                description="앗, 여기는 아무것도 없네요."
                openGraph={{
                    type: 'website',
                    url: "https://chickifarm.com/error",
                    title: "치키농장 :: 존재하지 않는 페이지",
                    description: "앗, 여기는 아무것도 없네요.",
                }}
            />
            <Error />
        </>
    );
}

export default ErrorAll;