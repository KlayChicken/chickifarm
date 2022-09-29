import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CopyToClipboard from 'react-copy-to-clipboard';

// util components
import farmerRankList from '../../../src/data/farm/FarmerRankList';
import KNScontract from '../../chain/contract/KNScontract';

// images
import twitterIcon from '../../../src/image/logo/snsLogo/color/twitter_circle.png';
import randomChickizLogo from "../../../src/image/utils/randomchickiz.png";
import copyIcon from '../../../src/image/utils/copy_white.png';
import kns_symbol from '../../../src/image/etc/kns_symbol.png';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

// store
import { setSmallModalBool } from '../../../store/modules/modal';


function EachFarmSmall_overall() {

    const dispatch = useDispatch();
    const router = useRouter();
    const { address } = router.query;

    const farmerInfo = useSelector((state) => state.userInfo[address])

    // kns
    const [isKNS, setIsKNS] = useState(false)
    const [knsDomain, setKnsDomain] = useState('')

    useEffect(() => {
        if (address === "") return
        checkKNS()
    }, [address])

    async function checkKNS() {
        const KNSCon = new KNScontract();
        const _domain = await KNSCon.getDomain(address);
        if (_domain === "") {
            setIsKNS(false);
            setKnsDomain('')
        } else {
            setIsKNS(true);
            setKnsDomain(_domain);
        }
    }

    return (
        <div className={FarmCSS.eachFarmFarmerBox}>
            <div className={FarmCSS.eachFarmFarmerImage}>
                {
                    farmerInfo?.repChickiz
                        ?
                        <Image width={256} height={256} className="image100" src={`https://api.klaychicken.com/v2/image/${farmerInfo.repChickiz}.png`} alt="" />
                        :
                        <Image width={256} height={256} className="image100" src={randomChickizLogo} alt="" />
                }
            </div>
            <div className={FarmCSS.eachFarmFarmerInfoBox}>
                <div className={FarmCSS.eachFarmFarmerBasicBox}>
                    <div className={FarmCSS.eachFarmFarmerNameBox}>
                        <span className={FarmCSS.eachFarmFarmerName}>
                            {farmerInfo?.userName}
                        </span>
                        <div className={classnames(FarmCSS.eachFarmIcon, "neonShine")} onClick={() => window.open(`https://twitter.com/${farmerInfo?.userTwitter}`)}>
                            <Image className="image100" src={twitterIcon} alt="" />
                        </div>
                    </div>
                    <span className={FarmCSS.eachFarmFarmerAddress}>
                        {
                            isKNS
                                ?
                                <div id='balloon_light' balloon='파인더에서 보기' className={FarmCSS.eachFarmFarmerKNSBox}
                                    onClick={() => window.open(`https://klaytnfinder.io/account/${knsDomain}`)}>
                                    <div className={FarmCSS.eachFarmFarmerKNS}>
                                        <Image className='image100' src={kns_symbol} alt='' />
                                    </div>
                                    {knsDomain}
                                </div>
                                :
                                address.substring(0, 10) + '......' + address.substring(32, 42)
                        }
                        <CopyToClipboard text={address}>
                            <div id="balloon_light" balloon="지갑 주소 복사" className={classnames(FarmCSS.eachFarmFarmerAddressCopy, "neonShine")}
                                onClick={function () {
                                    dispatch(setSmallModalBool({ bool: true, msg: '지갑 주소가 복사되었습니다.', modalTemplate: "justAlert" }))
                                }}>
                                <Image className='image100' src={copyIcon} alt="copy" />
                            </div>
                        </CopyToClipboard>
                    </span>
                </div>
                {
                    farmerInfo?.userRankNum !== undefined
                        ?
                        < div className={FarmCSS.eachFarmFarmerDetails}>
                            <span className={classnames(FarmCSS.eachFarmFarmerDetail, farmerRankList[farmerInfo?.userRankNum].class)}>
                                {farmerRankList[farmerInfo?.userRankNum].name}
                            </span>
                            <span className={classnames(FarmCSS.eachFarmFarmerDetail, "orangeBox")}>
                                {farmerInfo?.userChickizQuan} 치키
                            </span>
                        </div>
                        :
                        null
                }
            </div>
        </div >
    )
}

export default EachFarmSmall_overall;