import { useEffect, useState } from 'react';
import Image from 'next/image';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import itemNotFound from "../../src/image/utils/itemNotFound.png"
import searchIcon from '../../src/image/utils/find_lightgray.png'

// css
import classnames from 'classnames';
import modalCSS from '../../styles/modal.module.css';
import MyInfoCSS from '../../styles/myinfo.module.css';

function SelectModal(props) {

    const [modalTemplate, setModalTemplate] = useState(null);
    const [chickiz, setChickiz] = useState([]);
    const [farmSign, setFarmSign] = useState([]);

    useEffect(() => {
        setModalTemplate(props.modalTemplate)
        if (props.modalTemplate === "repChickiz") setChickiz(props.chickiz)
        if (props.modalTemplate === "farmSign") setFarmSign(props.farmSign)
    }, [props.modalTemplate])

    function selectRepChickiz(id) {
        props.setRepChickiz(id);
        props.setModalBool(false);
    }

    function selectFarmSign(id) {
        props.setFarmSign(id);
        props.setModalBool(false);
    }

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => props.setModalBool(false)}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.modalContent}>
                    {
                        {
                            "repChickiz":
                                <>
                                    <span className={modalCSS.modalContentTitle}>
                                        대표로 설정할 치키즈를 선택해주세요.
                                    </span>
                                    <div className={modalCSS.modalContentNFTGridBox}>
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
                                                <div className={classnames(modalCSS.modalContentNFTGrid, "grid5", "mobile_grid3")}>
                                                    {
                                                        chickiz.map((a, index) => {
                                                            return (
                                                                <div key={index} className="NFTBox neonShine_black" onClick={() => selectRepChickiz(a)}>
                                                                    <div className="NFTImageBox">
                                                                        <Image width={256} height={256} className="image100" src={"https://api.klaychicken.com/v2small/" + a + ".png"} alt="" />
                                                                    </div>
                                                                    <span className="NFTName" style={{ color: "black" }}>
                                                                        #{a}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                        }
                                    </div>
                                </>,
                            "farmSign":
                                <>
                                    <span className={modalCSS.modalContentTitle}>
                                        대표로 설정할 팻말을 선택해주세요.
                                    </span>
                                    <div className={modalCSS.modalContentNFTGridBox}>
                                        {
                                            farmSign.length === 0
                                                ?
                                                <div className="noNFTBox">
                                                    <div className="noNFT" onClick={() => window.open("https://opensea.io/collection/chickifarm-signs")}>
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
                                                <div className={classnames(modalCSS.modalContentNFTGrid, "grid4", "mobile_grid2")}>
                                                    {
                                                        farmSign.map((a, index) => {
                                                            return (
                                                                <div id={index} className="NFTBox neonShine_black" onClick={() => selectFarmSign(a.tokenId)}>
                                                                    <div className="NFTImageBox">
                                                                        <Image width={600} height={260} className="image100" src={"https://api.klaychicken.com/sign/image/" + a.tokenId + ".png"} alt="" />
                                                                    </div>
                                                                    <span className="NFTName" style={{ color: "black" }}>
                                                                        {a.name}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                        }
                                    </div>
                                </>
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default SelectModal;