import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router'

// pages component
import EachFarmBig from '../../components/farm/eachFarm/EachFarmBig';
import EachFarmSmall_overall from '../../components/farm/eachFarm/EachFarmSmall_overall';
import EachFarmSmall_intro from '../../components/farm/eachFarm/EachFarmSmall_intro';
import EachFarmSmall_guestBook from '../../components/farm/eachFarm/EachFarmSmall_guestBook';
import EachFarmSmall_neighbor from '../../components/farm/eachFarm/EachFarmSmall_neighbor';

// store
import { getUserInfo } from '../../store/modules/userInfo'
import { getFarmPosition } from '../../store/modules/farm/userFarm'
import { wrapper } from '../../store';

// css
import classnames from 'classnames';
import FarmCSS from '../../styles/farm.module.css';

function EachFarm({ address }) {

    const router = useRouter()

    const [tabNum, setTabNum] = useState(1);

    const userInfo = useSelector((state) => state.userInfo[address])

    useEffect(() => {
        if (userInfo === undefined || address == undefined) return
        if (!userInfo.isUser) {
            router.push('/error')
        }
    }, [userInfo])

    return (
        <>
            <NextSeo
                title={userInfo?.userName + "님의 농장"}
                description={userInfo?.userName + "님의 치키농장에 오신 것을 환영합니다."}
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/farm/' + address,
                    title: userInfo?.userName + "님의 농장",
                    description: userInfo?.userName + "님의 치키농장에 오신 것을 환영합니다.",
                }}
            />
            <div className="mainBoard eachFarm_mobile">
                <div className="subBoard_big">
                    <EachFarmBig />
                </div>
                <div className="subBoard_small">
                    <div className={FarmCSS.eachFarmWholeBox}>
                        <EachFarmSmall_overall />
                        <div className={FarmCSS.eachFarmFarmerSubBox}>
                            <div className={FarmCSS.eachFarmFarmerSubTab}>
                                <span className={tabNum === 0 ? FarmCSS.eachFarmFarmerSubTitleSelected : FarmCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(0)}>
                                    정보
                                </span>
                                <span className={tabNum === 1 ? FarmCSS.eachFarmFarmerSubTitleSelected : FarmCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(1)}>
                                    방명록
                                </span>
                                <span className={tabNum === 2 ? FarmCSS.eachFarmFarmerSubTitleSelected : FarmCSS.eachFarmFarmerSubTitle} onClick={() => setTabNum(2)}>
                                    이웃 농장
                                </span>
                            </div>
                            {
                                {
                                    0:
                                        <EachFarmSmall_intro />
                                    ,
                                    1:
                                        <EachFarmSmall_guestBook />
                                    ,
                                    2:
                                        <EachFarmSmall_neighbor />
                                }[tabNum]
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default EachFarm;


export const getServerSideProps = wrapper.getServerSideProps((store) =>
    async ({ params }) => {
        const address = params.address
        await store.dispatch(getUserInfo(address))
        await store.dispatch(getFarmPosition(address))

        return {
            props: {
                address
            }
        }
    })