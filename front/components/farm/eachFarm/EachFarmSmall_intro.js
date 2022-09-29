import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

// css
import FarmCSS from '../../../styles/farm.module.css';

function EachFarmSmall_intro() {

    const router = useRouter();
    const { address } = router.query;

    const farmerInfo = useSelector((state) => state.userInfo[address])

    return (
        <div className={FarmCSS.eachFarmFarmerDetailBox}>
            <span className={FarmCSS.eachFarmFarmerDetailTitle}>
                소개하는 글
            </span>
            <div className={FarmCSS.eachFarmFarmerIntroBox}>
                {farmerInfo?.userIntro}
            </div>
            <span className={FarmCSS.eachFarmFarmerDetailTitle}>
                길드
            </span>
            <div className={FarmCSS.eachFarmFarmerGuildBox}>
                Coming Soon...
            </div>
        </div>
    )
}

export default EachFarmSmall_intro;