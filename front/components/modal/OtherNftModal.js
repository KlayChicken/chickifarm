import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';
import classnames from 'classnames';

import useInput from '../../hooks/useInput';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import transferIcon from "../../src/image/utils/transfer.png"
import transferIcon_gray from "../../src/image/utils/transfer_gray.png"
import raffleIcon from '../../src/image/utils/raffle_color.png'

import notice from "../../src/image/utils/notice.png"
import transferSuccessIcon from '../../src/image/utils/transferSuccess.png';
import transferFailIcon from '../../src/image/utils/transferFail.png';

import openseaIcon from "../../src/image/logo/snsLogo/color/opensea.svg"
import twitterIcon from '../../src/image/logo/snsLogo/color/twitter_circle.png'
import discordIcon from '../../src/image/logo/snsLogo/color/discord_circle.png'
import klaytnLogo from '../../src/image/logo/klaytnLogo.svg'

// util component
import KIP17contract from '../chain/contract/KIP17contract';
import ContractAddress from '../../src/data/contract/ContractAddress'

// page component
import Loading from '../util/Loading';

// css
import modalCSS from '../../styles/modal.module.css';

// store
import { resetMyNFT, nftFromChain, nftFromServer } from '../../store/modules/nft';
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { resetOtherNFT, getOtherNFTBalances, getOtherNFTList } from '../../store/modules/otherNft';

function OtherNftModal({ projectName, projectAddress, twitterUrl, discordUrl, tokenId, meta, setModalBool }) {

    const dispatch = useDispatch();

    const { account } = useSelector((state) => state.myInfo);

    // template
    const [utilTemplate, setUtilTemplate] = useState('details');

    // transfer
    const [myNFTBool, setMyNFTBool] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);

    const [transactionHash, setTransactionHash] = useState("");

    // input
    const [toAddress, onChangeToAddress] = useInput("");

    useEffect(() => {
        if (account === "") return;
        getNFTOwner();
    }, [account])

    async function getNFTOwner() {
        const nftContract = new KIP17contract(projectAddress);
        if (account !== "") {
            const owner = await nftContract.getOwner(tokenId);
            setMyNFTBool(account.toUpperCase() === owner.toUpperCase());
        }
    }

    async function nftTransfer() {
        const nftContract = new KIP17contract(projectAddress);

        if (toAddress === "") return

        setTransferLoading(true);
        const res = await nftContract.transfer(klipPopOn, klipPopOff, account, toAddress, tokenId);
        setTransferLoading(false);

        if (res?.status === true) {
            //dispatch(resetMyNFT());
            //dispatch(nftFromChain(account));
            //dispatch(nftFromServer(account));
            dispatch(resetOtherNFT());
            dispatch(getOtherNFTBalances(account));
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
                    <div className={modalCSS.modalCloseBox} onClick={() => setModalBool(false)}>
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
                                            meta.image.startsWith('ipfs')
                                                ?
                                                <Image width={256} height={256}
                                                    className={modalCSS.otherNftModalImage100} src={meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                                    alt=""
                                                    placeholder='blur'
                                                    blurDataURL={`/image/otherProject/${projectName}.png`} />
                                                :
                                                meta.image.endsWith('mp4') || meta.image.endsWith('genesis')
                                                    ? <video className="image100" autoPlay muted loop><source src={meta.image} type='video/mp4' /></video>
                                                    :
                                                    projectName === "Klay 3 Kingdoms"
                                                        ?
                                                        <img className={modalCSS.otherNftModalImage100} src={meta.image} alt="" />
                                                        :
                                                        <img className="image100" src={meta.image} alt="" />
                                        }
                                    </div>
                                    <div className={modalCSS.otherNFTModalETCWhole}>
                                        <div className={modalCSS.otherNFTModalProjectNameWhole}>
                                            <span className={modalCSS.otherNFTModalProjectName}>
                                                {projectName}
                                            </span>
                                            <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                {meta.name}
                                            </span>
                                        </div>
                                        <div className={modalCSS.otherNFTModalLinkBox}>
                                            <div id="balloon_dark" balloon="오픈씨에서 보기" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => window.open(`https://opensea.io/assets/klaytn/${projectAddress}/${tokenId}`)}>
                                                <Image className="image100" src={openseaIcon} alt="opensea" />
                                            </div>
                                            <div id="balloon_dark" balloon="파인더에서 보기" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => window.open(`https://www.klaytnfinder.io/nft/${projectAddress}/${tokenId}`)}>
                                                <Image className="image100" src={klaytnLogo} alt="klaytnfinder" />
                                            </div>
                                            <div id="balloon_dark" balloon="트위터" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => window.open(twitterUrl)}>
                                                <Image className="image100" src={twitterIcon} alt="twitter" />
                                            </div>
                                            <div id="balloon_dark" balloon="디스코드" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => window.open(discordUrl)}>
                                                <Image className="image100" src={discordIcon} alt="discord" />
                                            </div>
                                            <div id="balloon_dark" balloon="NFT 전송하기" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => { }}>
                                                {
                                                    myNFTBool
                                                        ?
                                                        <Image className="image100" src={transferIcon} alt="transfer"
                                                            onClick={() => setUtilTemplate('transfer')} />
                                                        :
                                                        <Image className="image100" src={transferIcon_gray} alt="transfer" />
                                                }
                                            </div>
                                            {/*
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
                                    */}
                                        </div>
                                    </div>
                                </div>
                                <div className={modalCSS.nftModalRightBox}>
                                    <div className={modalCSS.otherNFTModalTraitBox_Whole}>
                                        <div className={modalCSS.otherNFTModalTraitBox_Grid}>
                                            {
                                                meta.attributes?.map((a, index) => {
                                                    return (
                                                        <div key={index} className={modalCSS.otherNFTModalGrid}>
                                                            <span className={modalCSS.otherNFTModalTraitType}>
                                                                {a.trait_type}
                                                            </span>
                                                            <span className={modalCSS.otherNFTModalTraitValue}>
                                                                {a.value}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                                )
                                            }
                                        </div>
                                    </div>
                                </div >
                            </div >,
                        "transfer":
                            <div className={modalCSS.transferDiv}>
                                <div className={modalCSS.transferInputBox}>
                                    <div className={modalCSS.otherNFTtransferLeftBox}>
                                        <div className={modalCSS.transferImageBox}>
                                            {
                                                meta.image.startsWith('ipfs')
                                                    ?
                                                    <Image width={256} height={256}
                                                        className={modalCSS.otherNftModalImage100} src={meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                                        alt=""
                                                        placeholder='blur'
                                                        blurDataURL={`/image/otherProject/${projectName}.png`} />
                                                    :
                                                    projectName === "Klay 3 Kingdoms"
                                                        ?
                                                        <img className={modalCSS.otherNftModalImage100} src={meta.image} alt="" />
                                                        :
                                                        <img className="image100" src={meta.image} alt="" />
                                            }
                                        </div>
                                        <div className={modalCSS.otherNFTModalProjectNameWhole_transfer}>
                                            <span className={modalCSS.otherNFTModalProjectName}>
                                                {projectName}
                                            </span>
                                            <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                {meta.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={modalCSS.otherNFTAInputBox}>
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
                                                    meta.image.startsWith('ipfs')
                                                        ?
                                                        <Image width={256} height={256}
                                                            className={modalCSS.otherNftModalImage100} src={meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                                            alt=""
                                                            placeholder='blur'
                                                            blurDataURL={`/image/otherProject/${projectName}.png`} />
                                                        :
                                                        projectName === "Klay 3 Kingdoms"
                                                            ?
                                                            <img className={modalCSS.otherNftModalImage100} src={meta.image} alt="" />
                                                            :
                                                            <img className="image100" src={meta.image} alt="" />
                                                }
                                            </div>
                                            <div className={modalCSS.otherNFTModalProjectNameWhole_transferResult}>
                                                <span className={modalCSS.otherNFTModalProjectName}>
                                                    {projectName}
                                                </span>
                                                <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                    {meta.name}
                                                </span>
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
                                                    meta.image.startsWith('ipfs')
                                                        ?
                                                        <Image width={256} height={256}
                                                            className={modalCSS.otherNftModalImage100} src={meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                                            alt=""
                                                            placeholder='blur'
                                                            blurDataURL={`/image/otherProject/${projectName}.png`} />
                                                        :
                                                        projectName === "Klay 3 Kingdoms"
                                                            ?
                                                            <img className={modalCSS.otherNftModalImage100} src={meta.image} alt="" />
                                                            :
                                                            <img className="image100" src={meta.image} alt="" />
                                                }
                                            </div>
                                            <div className={modalCSS.otherNFTModalProjectNameWhole_transferResult}>
                                                <span className={modalCSS.otherNFTModalProjectName}>
                                                    {projectName}
                                                </span>
                                                <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                    {meta.name}
                                                </span>
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
            <div className={modalCSS.whole} onClick={() => setModalBool(false)} />
        </>
    );
}

export default OtherNftModal;