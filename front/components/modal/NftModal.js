import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';
import classnames from 'classnames';

import useInput from '../../hooks/useInput';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import openseaIcon from "../../src/image/logo/snsLogo/color/opensea.svg"
import transferIcon from "../../src/image/utils/transfer.png"
import transferIcon_gray from "../../src/image/utils/transfer_gray.png"
import notice from "../../src/image/utils/notice.png"
import transferSuccessIcon from '../../src/image/utils/transferSuccess.png';
import transferFailIcon from '../../src/image/utils/transferFail.png';

// util component
import KIP17contract from '../chain/contract/KIP17contract';
import KIP37contract from '../chain/contract/KIP37contract';
import ContractAddress from '../../src/data/contract/ContractAddress'

// page component
import Loading from '../util/Loading';

// css
import modalCSS from '../../styles/modal.module.css';

// store
import { resetMyNFT, nftFromChain, nftFromServer } from '../../store/modules/nft';
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';

function NftModal(props) {

    const dispatch = useDispatch();

    const { account } = useSelector((state) => state.myInfo);

    // template
    const [modalTemplate, setModalTemplate] = useState(null);
    const [utilTemplate, setUtilTemplate] = useState('details');

    // details
    const [modalImageURL, setModalImageURL] = useState("");
    const [modalNFTName, setModalNFTName] = useState("");
    const [modalDesc, setModalDesc] = useState("");
    const [modalNFTTraits, setModalNFTTraits] = useState([]);
    const [openseaLink, setOpensseaLink] = useState("");
    const [scopeLink, setScopeLink] = useState("");

    // transfer
    const [kip37Balance, setKip37Balance] = useState(0);
    const [myNFTBool, setMyNFTBool] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);

    const [transactionHash, setTransactionHash] = useState("");

    // input
    const [toAddress, onChangeToAddress] = useInput("");
    const [transferQuan, onChangeTransferQuan] = useInput(1);

    // chickiz contract
    const chickizContract = new KIP17contract(ContractAddress.chickiz);
    const v1boneContract = new KIP17contract(ContractAddress.v1bone);
    const v1sunsalContract = new KIP17contract(ContractAddress.v1sunsal);
    const ornamentContract = new KIP37contract(ContractAddress.ornament);
    const signContract = new KIP37contract(ContractAddress.sign);

    // other contract

    useEffect(() => {
        openDetails(props.nftName, props.nftId)
    }, [props.nftName, props.nftId])

    async function openDetails(name, id) {
        if (name === "chickiz") {
            const meta = await axios.get(`https://api.klaychicken.com/v2/meta/${id}.json`)
            setModalNFTName(`Chickiz #${id}`)
            setModalNFTTraits(meta.data.attributes)
            setModalImageURL(`https://api.klaychicken.com/v2/image/${id}.png`)
            setOpensseaLink(`https://opensea.io/assets/klaytn/0x56ee689e3bbbafee554618fd25754eca6950e97e/${id}`)
            setScopeLink(`https://scope.klaytn.com/nft/0x56ee689e3bbbafee554618fd25754eca6950e97e`)
            setModalTemplate("kip17")
            if (account !== "") {
                const owner = await chickizContract.getOwner(id)
                setMyNFTBool(account.toUpperCase() === owner.toUpperCase())
            }
        } else if (name === "ornament") {
            const meta = await axios.get(`https://api.klaychicken.com/ornament/meta/${id}.json`)
            console.log(meta)
            setModalNFTName(meta.data.name)
            setModalDesc(meta.data.description)
            setModalImageURL(`https://api.klaychicken.com/ornament/image/${id}.png`)
            setOpensseaLink(`https://opensea.io/assets/klaytn/0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7/${id}`)
            setScopeLink(`https://scope.klaytn.com/nft/0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7`)
            setModalTemplate("kip37")
            if (account !== "") {
                const balance = await ornamentContract.getBalance(account, id);
                setKip37Balance(balance);
                setMyNFTBool(Number(balance) > 0);
            }
        } else if (name === "sign") {
            const meta = await axios.get(`https://api.klaychicken.com/sign/meta/${id}.json`)
            setModalNFTName(meta.data.name)
            setModalDesc(meta.data.description)
            setModalImageURL(`https://api.klaychicken.com/sign/image/${id}.png`)
            setOpensseaLink(`https://opensea.io/assets/klaytn/0x45712f8889d64284924a11d9c62f030b1c7af8fc/${id}`)
            setScopeLink(`https://scope.klaytn.com/nft/0x45712f8889d64284924a11d9c62f030b1c7af8fc`)
            setModalTemplate("kip37")
            if (account !== "") {
                const balance = await signContract.getBalance(account, id);
                setKip37Balance(balance);
                setMyNFTBool(Number(balance) > 0);
            }
        } else if (name === "sunsal") {
            const meta = await axios.get(`https://api.klaychicken.com/v1/sunsal/meta/${id}.json`)
            setModalNFTName(`KC Sunsal #${id}`)
            setModalNFTTraits(meta.data.attributes)
            setModalImageURL(`https://api.klaychicken.com/v1/sunsal/image/${id}.png`)
            setOpensseaLink(`https://opensea.io/assets/klaytn/0x715c9b59670b54a54aeedb5ed752f6d15ad79261/${id}`)
            setScopeLink(`https://scope.klaytn.com/nft/0x715c9b59670b54a54aeedb5ed752f6d15ad79261`)
            setModalTemplate("kip17")
            if (account !== "") {
                const owner = await v1sunsalContract.getOwner(id)
                setMyNFTBool(account.toUpperCase() === owner.toUpperCase())
            }
        } else if (name === "bone") {
            const meta = await axios.get(`https://api.klaychicken.com/v1/bone/meta/${id}.json`)
            setModalNFTName(`KC Bone #${id}`)
            setModalNFTTraits(meta.data.attributes)
            setModalImageURL(`https://api.klaychicken.com/v1/bone/image/${id}.png`)
            setOpensseaLink(`https://opensea.io/assets/klaytn/0xe298c5e48d488d266c986b408a27ee924331bccc/${id}`)
            setScopeLink(`https://scope.klaytn.com/nft/0xe298c5e48d488d266c986b408a27ee924331bccc`)
            setModalTemplate("kip17")
            if (account !== "") {
                const owner = await v1boneContract.getOwner(id)
                setMyNFTBool(account.toUpperCase() === owner.toUpperCase())
            }
        }
    }

    async function nftTransfer() {
        if (toAddress === "" || transferQuan < 1) return
        setTransferLoading(true);
        let res = { status: false, tx_hash: "" };
        if (modalTemplate === 'kip17') {
            if (props.nftName === "chickiz") {
                res = await chickizContract.transfer(klipPopOn, klipPopOff, account, toAddress, props.nftId)
            } else if (props.nftName === "bone") {
                res = await v1boneContract.transfer(klipPopOn, klipPopOff, account, toAddress, props.nftId)
            } else if (props.nftName === "sunsal") {
                res = await v1sunsalContract.transfer(klipPopOn, klipPopOff, account, toAddress, props.nftId)
            }
        } else if (modalTemplate === 'kip37') {
            if (props.nftName === "ornament") {
                res = await ornamentContract.transfer(klipPopOn, klipPopOff, account, toAddress, props.nftId, transferQuan)
            } else if (props.nftName === "sign") {
                res = await signContract.transfer(klipPopOn, klipPopOff, account, toAddress, props.nftId, transferQuan)
            }
        }

        setTransferLoading(false);

        if (res?.status === true) {
            dispatch(resetMyNFT());
            dispatch(nftFromChain(account));
            dispatch(nftFromServer(account));
            setTransactionHash(res?.tx_hash);
            setUtilTemplate('transferSuccess');
        } else {
            if (res?.tx_hash === undefined) {
                setTransactionHash("");
            } else {
                setTransactionHash(res?.tx_hash);
            }
            setUtilTemplate('transferFail');
        }
    }

    const klipPopOn = useCallback((request_key) => {
        dispatch(setRequestKey({ rk: request_key }))
        dispatch(setKlipModalBool({ kmo: true }))
    }, []);

    const klipPopOff = useCallback(() => {
        dispatch(setKlipModalBool({ kmo: false }))
    }, []);

    return (
        <>
            <div className={modalCSS.modal}>
                <div className={modalCSS.modalCloseDiv}>
                    <div className={modalCSS.modalCloseBox} onClick={() => props.setModalBool(false)}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                {
                    {
                        "details":
                            <div className={modalCSS.nftModalContent}>
                                <div className={modalCSS.nftModalLeftBox}>
                                    <div className={modalCSS.nftModalImageBox}>
                                        {
                                            modalImageURL === ""
                                                ? null
                                                : props.nftName !== "sign"
                                                    ? <Image width={512} height={512} priority={true} className="image100" src={modalImageURL} alt="" />
                                                    : <Image width={300} height={130} priority={true} className="image100" src={modalImageURL} alt="" />
                                        }
                                    </div>
                                    <div className={modalCSS.nftModalNameBox}>
                                        <span className={modalCSS.nftModalName}>
                                            {modalNFTName}
                                        </span>
                                        <div className={modalCSS.nftModalOpenseaButton}>
                                            <div className={modalCSS.nftModalOpenseaISBox} onClick={() => window.open(openseaLink)}>
                                                <div className={modalCSS.nftModalOpenseaIconBox}>
                                                    <Image className="image100" src={openseaIcon} alt="" />
                                                </div>
                                                <span className={modalCSS.nftModalOpenseaSpan}>
                                                    Opensea
                                                </span>
                                            </div>
                                            {
                                                myNFTBool
                                                    ?
                                                    <div className={modalCSS.nftModalOpenseaISBox} onClick={() => setUtilTemplate('transfer')}>
                                                        <div className={modalCSS.nftModalOpenseaIconBox}>
                                                            <Image className="image100" src={transferIcon} alt="" />
                                                        </div>
                                                        <span className={modalCSS.nftModalOpenseaSpan}>
                                                            NFT 전송
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className={modalCSS.nftModalOpenseaISBox_gray}>
                                                        <div className={modalCSS.nftModalOpenseaIconBox}>
                                                            <Image className="image100" src={transferIcon_gray} alt="" />
                                                        </div>
                                                        <span className={modalCSS.nftModalOpenseaSpan}>
                                                            NFT 전송
                                                        </span>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={modalCSS.nftModalRightBox}>
                                    {
                                        {

                                            "kip17":
                                                < div className={modalCSS.nftModalTraitBox}>
                                                    {
                                                        modalNFTTraits.map((a, index) => {
                                                            if (a.trait_type === "Generation") return null
                                                            return (
                                                                <div key={index} className={modalCSS.nftModalGrid}>
                                                                    <span className={modalCSS.nftModalTraitType}>
                                                                        {a.trait_type}
                                                                    </span>
                                                                    <span className={modalCSS.nftModalTraitValue}>
                                                                        {a.value}
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </div>,
                                            "kip37":
                                                < div className={modalCSS.nftModalDescriptionBox}>
                                                    <span className={modalCSS.nftModalSubtitle}>
                                                        설명
                                                    </span>
                                                    <span className={modalCSS.nftModalDesc}>
                                                        {modalDesc}
                                                    </span >
                                                </div >
                                        }[modalTemplate]
                                    }
                                </div >
                            </div >,
                        "transfer":
                            <div className={modalCSS.transferDiv}>
                                <div className={modalCSS.transferInputBox}>
                                    <div className={modalCSS.transferLeftBox}>
                                        <div className={modalCSS.transferImageBox}>
                                            {
                                                modalImageURL === ""
                                                    ? null
                                                    : props.nftName !== "sign"
                                                        ? <Image width={512} height={512} priority={true} className="image100" src={modalImageURL} alt="" />
                                                        : <Image width={300} height={130} priority={true} className="image100" src={modalImageURL} alt="" />
                                            }
                                        </div>
                                        <span className={modalCSS.transferNftName}>
                                            {modalNFTName}
                                        </span>
                                    </div>
                                    {
                                        {
                                            "kip17":
                                                <div className={modalCSS.AInputBox}>
                                                    <div className={modalCSS.addressInputBox}>
                                                        <span className={modalCSS.addressTitle}>보낼 지갑 주소</span>
                                                        <input className={modalCSS.addressInput} value={toAddress} type="text" placeholder="ex) 0x8e85e025..."
                                                            onChange={(e) => { onChangeToAddress(e); }} />
                                                    </div>
                                                    <div className={modalCSS.notice}>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    잘못된 주소로 전송 시 복구가 불가능합니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    클레이튼 지갑주소(카이카스, 클립 등)를 기입해주시기 바랍니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    서명 수락 시 소량의 가스비가 발생합니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ,
                                            "kip37":
                                                <div className={modalCSS.QAInputBox}>
                                                    <div className={modalCSS.addressInputDiv}>
                                                        <span className={modalCSS.addressTitle}>보낼 지갑 주소</span>
                                                        <input className={modalCSS.addressInput} value={toAddress} type="text" placeholder="ex) 0x0abcdef..."
                                                            onChange={(e) => { onChangeToAddress(e); }} />
                                                    </div>
                                                    <div className={modalCSS.quanInputBox}>
                                                        <span className={modalCSS.quanTitle}>수량 <span className={modalCSS.quanSub}>({kip37Balance}개 보유중)</span></span>
                                                        <input className={modalCSS.addressInput} value={transferQuan} type="number" min="1" max={kip37Balance}
                                                            onChange={(e) => { onChangeTransferQuan(e); }} />
                                                    </div>
                                                    <div className={modalCSS.notice}>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    잘못된 주소로 전송 시 복구가 불가능합니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    클레이튼에서 지원하는 "카이카스 지갑주소"를 기입해주시기 바랍니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.noticeBox}>
                                                            <div className={modalCSS.noticeDiv}>
                                                                <div className={modalCSS.noticeImgBox}>
                                                                    <Image className={classnames("image100", modalCSS.noticeImg)} src={notice} />
                                                                </div>
                                                                <span className={modalCSS.noticeSpan}>
                                                                    서명 수락 시 소량의 가스비가 발생합니다.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        }[modalTemplate]
                                    }
                                </div>
                                {
                                    !transferLoading
                                        ?
                                        <div className={modalCSS.transferBtnBox}>
                                            <button className={classnames("greenButton", modalCSS.transferBtn)} onClick={() => nftTransfer()}>
                                                <span className={modalCSS.transferBtnSpan}>NFT 전송</span>
                                            </button>
                                        </div>
                                        :
                                        <div className={modalCSS.transferBtnBox}>
                                            <button className={classnames("greenButton", modalCSS.transferBtn)}>
                                                <div className={modalCSS.transferLoadingBox}>
                                                    <Loading />
                                                </div>
                                            </button>
                                        </div>
                                }
                            </div>,
                        "transferSuccess":
                            <div className={modalCSS.transferResult}>
                                <div className={modalCSS.transferResultBox}>
                                    <div className={modalCSS.transferResultDiv}>
                                        <div className={modalCSS.transferResultTitleBox}>
                                            <div className={modalCSS.transfetResultCheckImgBox}>
                                                <Image className={classnames("image100", modalCSS.transfetResultCheckImg)} src={transferSuccessIcon} />
                                            </div>
                                            <div className={modalCSS.transferResultTitle}>
                                                <span className={modalCSS.transferResultTitleSpan}>전송 성공</span>
                                            </div>
                                        </div>
                                        <div className={modalCSS.transferResultNftInfo}>
                                            <div className={modalCSS.transferResultImgBox}>
                                                {
                                                    modalImageURL === ""
                                                        ? null
                                                        : props.nftName !== "sign"
                                                            ? <Image width={512} height={512} priority={true} className="image100" src={modalImageURL} alt="" />
                                                            : <Image width={300} height={130} priority={true} className="image100" src={modalImageURL} alt="" />
                                                }
                                            </div>
                                            <div className={modalCSS.transfetResultNftName}>
                                                <span className={modalCSS.transfetResultNftNameSpan}>{modalNFTName}</span>
                                            </div>
                                        </div>
                                        <div className={modalCSS.transferResultHash}>
                                            <span className={modalCSS.transferResultHashSpan}>
                                                {"Tx Hash : "}
                                                <a className={modalCSS.hyperLink} href={`https://www.klaytnfinder.io/tx/${transactionHash}`} target="_blank">
                                                    {transactionHash.substring(0, 5)}...{transactionHash.substring(transactionHash.length - 4, transactionHash.length)}
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                        "transferFail":
                            <div className={modalCSS.transferResult}>
                                <div className={modalCSS.transferResultBox}>
                                    <div className={modalCSS.transferResultDiv}>
                                        <div className={modalCSS.transferResultTitleBox}>
                                            <div className={modalCSS.transfetResultCheckImgBox}>
                                                <Image className={classnames("image100", modalCSS.transfetResultCheckImg)} src={transferFailIcon} />
                                            </div>
                                            <div className={modalCSS.transferResultTitle}>
                                                <span className={modalCSS.transferResultTitleSpan}>전송 실패</span>
                                            </div>
                                        </div>
                                        <div className={modalCSS.transferResultNftInfo}>
                                            <div className={modalCSS.transferResultImgBox}>
                                                {
                                                    modalImageURL === ""
                                                        ? null
                                                        : props.nftName !== "sign"
                                                            ? <Image width={512} height={512} priority={true} className="image100" src={modalImageURL} alt="" />
                                                            : <Image width={300} height={130} priority={true} className="image100" src={modalImageURL} alt="" />
                                                }
                                            </div>
                                            <div className={modalCSS.transfetResultNftName}>
                                                <span className={modalCSS.transfetResultNftNameSpan}>{modalNFTName}</span>
                                            </div>
                                        </div>
                                        <div className={modalCSS.transferResultHash}>
                                            <span className={modalCSS.transferResultHashSpan}>
                                                {"Tx Hash : "}
                                                <a className={modalCSS.hyperLink} href={`https://www.klaytnfinder.io/tx/${transactionHash}`} target="_blank">
                                                    {
                                                        transactionHash === ""
                                                            ?
                                                            "none"
                                                            :
                                                            transactionHash.substring(0, 5) + "..." + transactionHash.substring(transactionHash.length - 4, transactionHash.length)
                                                    }
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }[utilTemplate]
                }
            </div >
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default NftModal;