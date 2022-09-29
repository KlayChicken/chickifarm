import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';

// util components
import farmSkinList from '../../../src/data/farm/FarmSkinList';

// page components
import NftModal from '../../modal/NftModal';
import ChickizModal from '../../modal/ChickizModal';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function EachFarm_Farm() {

    const router = useRouter();
    const { address } = router.query;
    const ref = useRef();

    const farmerInfo = useSelector((state) => state.userInfo[address]);
    const farmPosition = useSelector((state) => state.userFarm[address]);

    // farmSkin
    const [farmSkin, setFarmSkin] = useState(0);
    const [farmSkinSize, setFarmSkinSize] = useState(0);
    const [farmSign, setFarmSign] = useState(null);

    const [farmWidth, setFarmWidth] = useState(0);
    const [farmHeight, setFarmHeight] = useState(0);

    // modal
    const [nftModalBool, setNftModalBool] = useState(false);
    const [nftName, setNftName] = useState(null);
    const [nftId, setNftId] = useState(null);

    useEffect(() => {
        if (farmerInfo === undefined) return;
        setFarmSkin(farmerInfo.userFarmSkin);
        setFarmSkinSize(farmerInfo.userFarmSkin % 3);
        setFarmSign(farmerInfo.userFarmSign);
    }, [farmerInfo])

    useEffect(() => {
        setFarmSize();
        window.addEventListener('resize', () => setFarmSize());
        return () => { window.removeEventListener('resize', () => setFarmSize()) }
    }, [farmWidth, farmHeight])

    function setFarmSize() {
        if (!ref.current) return;
        setFarmWidth(ref.current.offsetWidth)
        setFarmHeight(ref.current.offsetHeight)
    }

    async function openDetails([name, id]) {
        setNftName(name);
        setNftId(id);
        setNftModalBool(true);
    }

    return (
        <>
            <div className="pageContentBox">
                <div className={FarmCSS.farmImageBoxEach} ref={ref}>
                    {
                        farmPosition?.ornamentPosition.map((a, index) => {
                            return (
                                <div key={a.id} className={FarmCSS.farmOrnamentImageBox} style={{ zIndex: a.zIndex + 1, width: Number(a.tokenId) < 1000 || Number(a.tokenId) === 1010 ? `${18 - 3.75 * farmSkinSize}%` : `${12 - 2.5 * farmSkinSize}%`, transform: `translate(${a.x / 100 * farmWidth}px,${a.y / 100 * farmHeight}px)` }} onClick={() => openDetails(["ornament", a.tokenId])}>
                                    <Image width={512} height={512} priority={true} className={FarmCSS.farmChickizImage} style={{ zIndex: a.zIndex }} src={`https://api.klaychicken.com/ornament/image/${a.tokenId}.png`} alt="" />
                                    {
                                        Number(a.tokenId) < 1004 || Number(a.tokenId) > 1008
                                            ?
                                            <div className={FarmCSS.farmChickizShadow} style={{ zIndex: a.zIndex - 1 }}></div>
                                            :
                                            null
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        farmPosition?.chickizPosition.map((a, index) => {
                            return (
                                a.visible === 1
                                    ?
                                    <div key={a.id} className={FarmCSS.farmChickizImageBox} style={{ zIndex: a.zIndex + 1, width: `${12 - 2.5 * farmSkinSize}%`, transform: `translate(${a.x / 100 * farmWidth}px,${a.y / 100 * farmHeight}px)` }} onClick={() => openDetails(["chickiz", a.id])}>
                                        <Image width={256} height={320} priority={true} className={FarmCSS.farmChickizImage} style={{ zIndex: a.zIndex }} src={`https://api.klaychicken.com/v2full/${a.id}.png`} alt="" />
                                        <div className={FarmCSS.farmChickizShadow} style={{ zIndex: a.zIndex - 1 }}></div>
                                    </div>
                                    :
                                    null
                            )
                        })
                    }
                    <Image className={FarmCSS.farmImage} priority={true} src={farmSkinList[farmSkin]} alt="" />
                    {
                        farmSign === null
                            ?
                            null
                            :
                            <div className={FarmCSS.farmSignImage} onClick={() => openDetails(["sign", farmSign])} >
                                <Image width={600} height={260} priority={true} src={`https://api.klaychicken.com/sign/image/${farmSign}.png`} alt="" />
                            </div>
                    }
                </div>
            </div>
            {
                nftModalBool
                    ?
                    nftName === "chickiz"
                        ?
                        <ChickizModal tokenId={nftId} setModalBool={setNftModalBool} />
                        :
                        <NftModal modalBool={nftModalBool} setModalBool={setNftModalBool} nftName={nftName} nftId={nftId} />
                    :
                    null
            }
        </>
    )
}

export default EachFarm_Farm;