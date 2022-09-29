import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Draggable from 'react-draggable';
import Image from 'next/image';

// util components
import caver from '../../chain/CaverChrome';
import Wallet from '../../chain/wallet/Wallet';

// images
import plusIcon from "../../../src/image/utils/plus.png";
import minusIcon from "../../../src/image/utils/minus.png";
import questionIcon_white from "../../../src/image/utils/question_white.png"
import itemNotFound from "../../../src/image/utils/itemNotFound.png"
import searchIcon from '../../../src/image/utils/find_lightgray.png'

// data
import farmSkinList from '../../../src/data/farm/FarmSkinList';

// store
import { getFarmPosition, updateFarmPosition } from '../../../store/modules/farm/userFarm'
import { getMyInfo } from '../../../store/modules/myInfo';
import { setSmallModalBool } from '../../../store/modules/modal';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function MyFarmBig() {

    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const dispatch = useDispatch();
    const ref = useRef();
    const router = useRouter();

    const { account, myFarmSkin } = useSelector((state) => state.myInfo);
    const { chickiz, ornament } = useSelector((state) => state.nft);
    const farmPosition = useSelector((state) => state.userFarm[account]);

    const [chickizChanged, setChickizChanged] = useState([])
    const [ornamentChanged, setOrnamentChanged] = useState([])

    useEffect(() => {
        getOrnamentBalance();
    }, [ornament])

    useEffect(() => {
        if (account === undefined || account === "") return;
        setInitialPosition()
    }, [account])

    async function setInitialPosition() {
        dispatch(getFarmPosition(account)).unwrap()
            .then((a) => {
                setChickizChanged(a.chickizPosition)
                setOrnamentChanged(a.ornamentPosition)
            })
    }

    // farmSkin
    let [farmSkin, setFarmSkin] = useState(0);
    let [farmSkinSize, setFarmSkinSize] = useState(0);
    let [farmWidth, setFarmWidth] = useState(0);
    let [farmHeight, setFarmHeight] = useState(0);

    useEffect(() => {
        if (myFarmSkin === null || myFarmSkin === undefined) return;
        setFarmSkin(myFarmSkin);
        setFarmSkinSize(myFarmSkin % 3);
    }, [myFarmSkin])

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

    // position change
    function changeChickizPosition(id, e, data) {
        const newX = Math.round(data.x * 10000 / farmWidth) / 100;
        const newY = Math.round(data.y * 10000 / farmHeight) / 100;
        const newObj = { id: id, x: newX, y: newY, visible: 1, zIndex: Math.round(newY * 10) + 2 }
        const _chickiz = [...chickizChanged];
        for (let i = 0; i < _chickiz.length; i++) {
            if (_chickiz[i].id === id) {
                _chickiz.splice(i, 1, newObj)
                break
            }
        }
        setChickizChanged(_chickiz)
    }

    function changeOrnamentPosition(uniqueId, id, e, data) {
        const newX = Math.round(data.x * 10000 / farmWidth) / 100;
        const newY = Math.round(data.y * 10000 / farmHeight) / 100;
        const newObj = { id: uniqueId, tokenId: id, x: newX, y: newY, zIndex: Math.round(newY * 10) + 2 }
        const _ornament = [...ornamentChanged];
        for (let i = 0; i < _ornament.length; i++) {
            if (_ornament[i].id === uniqueId) {
                _ornament.splice(i, 1, newObj)
                break
            }
        }
        setOrnamentChanged(_ornament)
    }

    async function savePosition() {
        try {
            let sendChickizPosition = chickizChanged.filter((x) => !JSON.stringify(farmPosition.chickizPosition).includes(JSON.stringify(x)))
            let sendOrnamentPosition = ornamentChanged;

            const sign = await Wallet.signMessage("updateFarm")
            const res = await dispatch(updateFarmPosition({
                chickiz: sendChickizPosition,
                ornament: sendOrnamentPosition,
                account: account,
                farmFinal: farmSkin,
                sign: sign
            })).unwrap()
            dispatch(getMyInfo(account));
            dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }));
            router.push(`/farm/${account}`)
        } catch (err) {
            console.error(err);
            dispatch(setSmallModalBool({ bool: true, msg: "저장에 실패하였습니다.", modalTemplate: "justAlert" }));
        }
    }

    // util
    function checkChickiz(id) {
        const _chickiz = [...chickizChanged];
        const _obj = _chickiz.find((a) => a.id === id)
        if (_obj === undefined) return false
        if (_obj.visible === 1) return true
        return false
    }

    function farmSet(skin) {
        setFarmSkin(skin)
        setFarmSkinSize(skin % 3)
    }

    function addOrSubChickiz(id) {
        const _chickiz = [...chickizChanged];
        const newObj1 = { id: id, x: 0, y: 0, visible: 1, zIndex: 1 }
        const newObj2 = { id: id, x: 0, y: 0, visible: 0, zIndex: 1 }

        const _obj = _chickiz.find((a) => a.id === id)

        if (_obj === undefined) {
            _chickiz.push(newObj1)
        } else if (_obj.visible === 0) {
            for (let i = 0; i < _chickiz.length; i++) {
                if (_chickiz[i].id === id) {
                    _chickiz.splice(i, 1, newObj1)
                    break
                }
            }
        } else if (_obj.visible === 1) {
            for (let i = 0; i < _chickiz.length; i++) {
                if (_chickiz[i].id === id) {
                    _chickiz.splice(i, 1, newObj2)
                    break
                }
            }
        }
        setChickizChanged(_chickiz)
    }

    function addOrnament(id) {
        if (ornamentBalance[id] === undefined || ornamentBalance[id] <= ornamentDisplayQuan[id]) return
        let _ornamentUniqueId = ornamentUniqueId;
        const _ornament = [...ornamentChanged];
        const newObj = { id: _ornamentUniqueId, x: 0, y: 0, tokenId: id, zIndex: 1 }

        _ornament.push(newObj)
        let _ornamentDisplayQuan = ornamentDisplayQuan;
        if (ornamentDisplayQuan[id] === undefined) {
            _ornamentDisplayQuan[id] = 1;
        } else {
            _ornamentDisplayQuan[id] += 1;
        }

        _ornamentUniqueId += 1
        setOrnamentChanged(_ornament);
        setOrnamentUniqueId(_ornamentUniqueId);
        setOrnamentDisplayQuan(_ornamentDisplayQuan)
    }

    function subOrnament(id) {
        if (ornamentBalance[id] === undefined || ornamentDisplayQuan[id] === 0 || ornamentDisplayQuan[id] === undefined) return
        const _ornament = [...ornamentChanged];

        for (let i = 0; i < _ornament.length; i++) {
            if (_ornament[i].tokenId === id) {
                _ornament.splice(i, 1)
                break
            }
        }


        let _ornamentDisplayQuan = ornamentDisplayQuan;
        _ornamentDisplayQuan[id] -= 1;

        setOrnamentChanged(_ornament)
        setOrnamentDisplayQuan(_ornamentDisplayQuan)
    }

    // ornament

    let [ornamentBalance, setOrnamentBalance] = useState([]);
    let [ornamentDisplayQuan, setOrnamentDisplayQuan] = useState([]);
    let [ornamentUniqueId, setOrnamentUniqueId] = useState(100000);
    let [ornamentUniqueQ, setOrnamentUniqueQ] = useState(0);

    useEffect(() => {
        if (ornamentChanged.length * ornamentBalance.length < 1) return;
        if (ornamentUniqueQ > 0) return
        getOrnamentDisplayQuan();
        setOrnamentUniqueQ(1);
    }, [ornamentChanged, ornamentBalance])

    function getOrnamentBalance() {
        const _ornamentArray = ornament
        let _ornamentBalance = []
        _ornamentArray.map((a) => {
            _ornamentBalance[a.tokenId] = Number(a.quan)
            return null;
        })
        setOrnamentBalance(_ornamentBalance)
    }

    function getOrnamentDisplayQuan() {
        const _ornamentPosition = ornamentChanged

        let _ornamentDisplayQuan = []

        _ornamentPosition.map((a) => {
            if (_ornamentDisplayQuan[a.tokenId] === undefined) {
                _ornamentDisplayQuan[a.tokenId] = 1;
            } else {
                _ornamentDisplayQuan[a.tokenId] += 1;
            }
            return null;
        })

        setOrnamentDisplayQuan(_ornamentDisplayQuan);
    }

    return (
        <>
            <div className="subBoard_big">
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
                        <Link href="/farm">
                            <span className="pageTitle">
                                치키농장
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            내 농장 꾸미기
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <button className="pageUtilSubmit greenButton" onClick={() => savePosition()}>
                            저장하기
                        </button>
                    </div>
                </div>
                <div className="pageContentBox">
                    <div className={FarmCSS.farmImageBox} ref={ref}>
                        {
                            ornamentChanged.map((a, index) => {
                                return (
                                    <Draggable cancel=".farmChickizImage" key={a.id} onStop={(e, data) => { changeOrnamentPosition(a.id, a.tokenId, e, data) }} bounds="parent" defaultPosition={{ x: a.x / 100 * farmWidth, y: a.y / 100 * farmHeight }}>
                                        <div className={FarmCSS.farmOrnamentImageBox} style={{ zIndex: a.zIndex + 10, width: Number(a.tokenId) < 1000 || Number(a.tokenId) === 1010 ? `${18 - 3.75 * farmSkinSize}%` : `${12 - 2.5 * farmSkinSize}%` }}>
                                            <Image width={512} height={512} className={FarmCSS.farmChickizImage} style={{ zIndex: a.zIndex }} src={`https://api.klaychicken.com/ornament/image/${a.tokenId}.png`} alt="" />
                                            {
                                                Number(a.tokenId) < 1004 || Number(a.tokenId) > 1008
                                                    ?
                                                    <div className={FarmCSS.farmChickizShadow} style={{ zIndex: a.zIndex - 1 }}></div>
                                                    :
                                                    null
                                            }
                                            <div className={FarmCSS.forDrag} style={{ zIndex: a.zIndex + 2 }}></div>
                                        </div>
                                    </Draggable>
                                )
                            })
                        }
                        {
                            chickizChanged.map((a, index) => {
                                return (
                                    a.visible === 1
                                        ?
                                        <Draggable cancel=".farmChickizImage" key={a.id} onStop={(e, data) => { changeChickizPosition(a.id, e, data) }} bounds="parent" defaultPosition={{ x: a.x / 100 * farmWidth, y: a.y / 100 * farmHeight }}>
                                            <div className={FarmCSS.farmChickizImageBox} style={{ zIndex: a.zIndex + 1, width: `${12 - 2.5 * farmSkinSize}%` }} >
                                                <Image width={256} height={320} className={FarmCSS.farmChickizImage} style={{ zIndex: a.zIndex }} src={`https://api.klaychicken.com/v2full/${a.id}.png`} alt="" />
                                                <div className={FarmCSS.farmChickizShadow} style={{ zIndex: a.zIndex - 1 }}></div>
                                                <div className={FarmCSS.forDrag} style={{ zIndex: a.zIndex + 2 }}></div>
                                            </div>
                                        </Draggable>
                                        :
                                        null
                                )
                            })
                        }
                        <Image className={FarmCSS.farmImage} priority={true} src={farmSkinList[farmSkin]} alt="" />
                    </div>
                </div>
            </div>
            <div className="subBoard_small">
                <span className={FarmCSS.myFarm_mobileWarning}>
                    꾸미기 기능은 화면을 가로로 회전하여 이용해주세요.
                </span>
                <div className={FarmCSS.myFarmNFTBox1}>
                    <span className={FarmCSS.myFarmNFTTitle}>
                        치키즈
                    </span>
                    <div className={FarmCSS.myFarmNFTGridBox}>
                        {
                            chickiz.length === 0
                                ?
                                <div className="noNFTBox">
                                    <div className="noNFT" onClick={() => window.open("https://opensea.io/collection/chickiz")}>
                                        <Image className="image100" src={itemNotFound} alt="" />
                                        <div className="noNFTDescBox">
                                            <div className="noNFTDescIcon">
                                                <Image className="image100" src={searchIcon} alt="" />
                                            </div>
                                            <span className="noNFTDesc">
                                                오픈씨에서 구경하기
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={classnames(FarmCSS.myFarmNFTGrid, "grid5")}>
                                    {
                                        chickiz.map((a, index) => {
                                            return (
                                                <div key={a.id} className={FarmCSS.myFarmNFT} onClick={() => addOrSubChickiz(a)}>
                                                    <div className={classnames(FarmCSS.myFarmNFTImageBox, "neonShineBoxTemp")}>
                                                        <input className="NFTInput" type="checkbox" checked={checkChickiz(a)} readOnly />
                                                        <Image width={256} height={256} className="image100" src={"https://api.klaychicken.com/v2small/" + a + ".png"} alt="" />
                                                    </div>
                                                    <span className={FarmCSS.myFarmNFTName}>
                                                        #{a}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                        }
                    </div>
                </div>
                <div className={FarmCSS.myFarmNFTBox2}>
                    <span className={FarmCSS.myFarmNFTTitle}>
                        장식품
                    </span>
                    <div className={FarmCSS.myFarmNFTGridBox}>
                        {
                            ornament.length === 0
                                ?
                                <div className="noNFTBox">
                                    <div className="noNFT" onClick={() => window.open("https://opensea.io/collection/chickifarm-ornaments")}>
                                        <Image className="image100" src={itemNotFound} alt="" />
                                        <div className="noNFTDescBox">
                                            <div className="noNFTDescIcon">
                                                <Image className="image100" src={searchIcon} alt="" />
                                            </div>
                                            <span className="noNFTDesc">
                                                오픈씨에서 구경하기
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={classnames(FarmCSS.myFarmNFTGrid, "grid5")}>
                                    {
                                        ornament.map((a, index) => {
                                            return (
                                                <div key={a.tokenId} className={FarmCSS.myFarmNFT} style={{ cursor: "default" }} >
                                                    <div className={FarmCSS.myFarmNFTImageBox}>
                                                        <Image width={256} height={256} className="image100" src={"https://api.klaychicken.com/ornament/image/" + a.tokenId + ".png"} alt="" />
                                                    </div>
                                                    <div className={FarmCSS.myFarmNFTQuanAdjustBox}>
                                                        <div className={classnames(FarmCSS.myFarmNFTQuanAdjustIconBox, "neonShine")} onClick={() => subOrnament(a.tokenId)}>
                                                            <Image className="image100" src={minusIcon} alt="" />
                                                        </div>
                                                        <span className={FarmCSS.myFarmNFTQuanAdjustSpan}>
                                                            {ornamentDisplayQuan[a.tokenId] === undefined ? 0 : ornamentDisplayQuan[a.tokenId]}
                                                        </span>
                                                        <div className={classnames(FarmCSS.myFarmNFTQuanAdjustIconBox, "neonShine")} onClick={() => addOrnament(a.tokenId)}>
                                                            <Image className="image100" src={plusIcon} alt="" />
                                                        </div>
                                                    </div>
                                                    <span className={FarmCSS.myFarmNFTQuan}>
                                                        X {a.quan}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                        }
                    </div>
                </div>
                <div className={FarmCSS.myFarmNFTBox2}>
                    <div className={FarmCSS.myFarmSkinTitleBox}>
                        <span className={FarmCSS.myFarmSkinTitle}>
                            농장 스킨
                        </span>
                        <div className={FarmCSS.myFarmSkinCheckBox}>
                            <span className={FarmCSS.myFarmSkinCheckTag}>
                                소
                            </span>
                            <input className={FarmCSS.myFarmSkinCheckInput} type="checkbox" checked={farmSkinSize === 0} onClick={() => farmSet(parseInt(farmSkin / 3) * 3)} readOnly />
                            <span className={chickiz.length > 6 ? FarmCSS.myFarmSkinCheckTag : classnames(FarmCSS.myFarmSkinCheckTag, "grayColor")} >
                                중
                            </span>
                            <input className={FarmCSS.myFarmSkinCheckInput} disabled={chickiz.length > 6 ? false : true} type="checkbox" checked={farmSkinSize === 1} onClick={() => farmSet(parseInt(farmSkin / 3) * 3 + 1)} readOnly />
                            <span className={chickiz.length > 19 ? FarmCSS.myFarmSkinCheckTag : classnames(FarmCSS.myFarmSkinCheckTag, "grayColor")} disabled={chickiz.length > 900 ? false : true}>
                                대
                            </span>
                            <input className={FarmCSS.myFarmSkinCheckInput} disabled={chickiz.length > 19 ? false : true} type="checkbox" checked={farmSkinSize === 2} onClick={() => farmSet(parseInt(farmSkin / 3) * 3 + 2)} readOnly />
                            <div id="balloon_light" balloon="농장 스킨 이용 조건" className={classnames(FarmCSS.myFarmSkinIconBox, "neonShine")} onClick={() =>
                                dispatch(setSmallModalBool({ bool: true, msg: "치키즈 7개 보유 시부터 '중',\n20개 보유 시부터 '대'\n크기의 농장이 이용가능합니다.", modalTemplate: "justAlert" }))} >
                                <Image className="image100" src={questionIcon_white} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={FarmCSS.myFarmNFTGridBox}>
                        <div className={classnames(FarmCSS.myFarmNFTGrid, "grid3")}>
                            {
                                farmSkinList.map((a, index) => {
                                    if (farmSkinList.indexOf(a) % 3 !== 0) return null
                                    return (
                                        <div key={index} className={classnames(FarmCSS.myFarmNFT, "neonShine")} onClick={() => farmSet(farmSkinList.indexOf(a) + farmSkinSize)} >
                                            <div className={FarmCSS.myFarmNFTImageBox}>
                                                <Image width={400} height={300} className="image100" src={a} alt="" />
                                            </div>
                                        </div>
                                    );

                                })
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default MyFarmBig