import Link from 'next/link';
import { NextSeo } from 'next-seo';

// components
import PublicRoute from '../components/util/PublicRoute';
import SignUpForm from '../components/util/SignUpForm'

function SignUp() {

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 농장 입주"
                description="치키농장에 오신 것을 환영합니다. 농장에 지금 입주하세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/signUp',
                    title: '치키농장 :: 농장 입주',
                    description: '치키농장에 오신 것을 환영합니다. 농장에 지금 입주하세요.'
                }}
            />
            <div className="mainBoard signUp_mobile">
                <div className="subBoard_whole">
                    <div className="pageHeaderBox">
                        <div className="pageTitleBox">
                            <Link href="/">
                                <span className="pageTitle">
                                    HOME
                                </span>
                            </Link>
                            <span className="pageTitleArrow">
                                &gt;
                            </span>
                            <span className="pageTitle">
                                농장 입주
                            </span>
                        </div>
                    </div>
                    <SignUpForm />
                </div>
            </div>
        </>
    );
}

export default PublicRoute(SignUp);