import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import classnames from 'classnames';

import useInput from '../../hooks/useInput';

// images
import closeIcon from "../../src/image/utils/close_black.png";
import transferIcon from "../../src/image/utils/transfer.png";
import transferIcon_gray from "../../src/image/utils/transfer_gray.png";
import questionIcon_black from '../../src/image/utils/question_black.png';
import raffleIcon from '../../src/image/utils/raffle_color.png';

import notice from "../../src/image/utils/notice.png";
import transferSuccessIcon from '../../src/image/utils/transferSuccess.png';
import transferFailIcon from '../../src/image/utils/transferFail.png';

import openseaIcon from "../../src/image/logo/snsLogo/color/opensea.svg"
import twitterIcon from '../../src/image/logo/snsLogo/color/twitter_circle.png'
import discordIcon from '../../src/image/logo/snsLogo/color/discord_circle.png'
import klaytnLogo from '../../src/image/logo/klaytnLogo.svg'

import rankingIcon from '../../src/image/utils/rankingIcon_black.png';

import crunchPowerImage from '../../src/image/rarity/raritySelect/crunchpower.png'
import backgroundImage from '../../src/image/rarity/raritySelect/background.png'
import wingImage from '../../src/image/rarity/raritySelect/wing.png'
import menuImage from '../../src/image/rarity/raritySelect/menu.png'
import skinImage from '../../src/image/rarity/raritySelect/skin.png'
import clothesImage from '../../src/image/rarity/raritySelect/clothes.png'
import eyebrowImage from '../../src/image/rarity/raritySelect/eyebrow.png'
import eyesImage from '../../src/image/rarity/raritySelect/eyes.png'
import neckImage from '../../src/image/rarity/raritySelect/neck.png'
import headImage from '../../src/image/rarity/raritySelect/head.png'
import itemsImage from '../../src/image/rarity/raritySelect/items.png'
import levelImage from '../../src/image/rarity/raritySelect/level.png'

import oilImage from '../../src/image/basak/oil.png';

// util component
import KIP17contract from '../chain/contract/KIP17contract';
import ContractAddress from '../../src/data/contract/ContractAddress'

// page component
import Loading from '../util/Loading';

// css
import modalCSS from '../../styles/modal.module.css';

// data
import chickizMeta from '../../src/data/chickiz/chickizMeta.json'
import metaIndex from '../../src/data/chickiz/metaIndex.json'
import miningRate from '../../src/data/chickiz/miningRate';

// chain
import Miningcontract from '../chain/contract/Miningcontract';

// store
import { getJustName } from '../../store/modules/userInfo';
import { resetMyNFT, nftFromChain, nftFromServer } from '../../store/modules/nft';
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { resetOtherNFT, getOtherNFTBalances, getOtherNFTList } from '../../store/modules/otherNft';

function ChickizModal({ tokenId, setModalBool }) {

    const dispatch = useDispatch();

    const { account, isUser } = useSelector((state) => state.myInfo);

    // tab
    const [tabNum, setTabNum] = useState(0);

    // template
    const [utilTemplate, setUtilTemplate] = useState('details');

    // transfer
    const projectAddress = '0x56ee689e3bbbafee554618fd25754eca6950e97e';
    const [ownerLoading, setOwnerLoading] = useState(false);
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerName, setOwnerName] = useState(null);
    const [myNFTBool, setMyNFTBool] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");

    // mining
    const [chainLoading, setChainLoading] = useState(false);
    const [mentor, setMentor] = useState(0);
    const [mentorId, setMentorId] = useState(null);
    const [mentorKind, setMentorKind] = useState(null);
    const [superBool, setSuperBool] = useState(false);
    const [remain, setRemain] = useState('-');

    // input
    const [toAddress, onChangeToAddress] = useInput("");

    // image
    const rarityIcon = [
        backgroundImage,
        wingImage,
        menuImage,
        skinImage,
        clothesImage,
        eyebrowImage,
        eyesImage,
        neckImage,
        headImage,
        itemsImage,
        levelImage
    ]

    useEffect(() => {
        getNFTOwner();
    }, [account])

    useEffect(() => {
        getChainInfo();
    }, [])

    // oil time calculate
    const calculateOilTime = (_oilCharged, _cp) => {
        const now = Math.ceil(Date.now() / 1000);
        const _time = Number(_oilCharged) + 2592000 - now;
        if (_cp > 2) return '-'
        if (_time < 0) return 0
        return (_time)
    }

    const secondToTime = (_time) => {
        if (_time === '-') return '-'
        const d = Math.floor(_time / 86400)
        const h = Math.floor(_time / 3600) % 24
        const m = Math.ceil(_time / 60) % 60
        if (d === 29 && h === 23 && m === 0) m = 59
        return `${d}일 ${h}시간 ${m}분 남음`
    }

    async function getChainInfo() {
        setChainLoading(true);
        const mineCon = new Miningcontract();
        const _info = await mineCon.getChickizInfo(tokenId);

        if (Number(_info._cp) > 2) {
            setSuperBool(true)
        }
        if (Number(_info._mentor) > 0) {
            if (Number(_info._mentor) > 899) {
                setMentor(2)
            } else {
                setMentor(1)
            }
            setMentorId(Number(_info._mentor));
            setMentorKind(Number(_info._mentorKind))
        }
        setRemain(secondToTime(calculateOilTime(_info._oilCharged, _info._cp)))
        setChainLoading(false);
    }

    async function getNFTOwner() {
        setOwnerLoading(true);
        const nftContract = new KIP17contract(projectAddress);
        const owner = await nftContract.getOwner(tokenId);
        const result = await dispatch(getJustName(owner)).unwrap();
        setOwnerAddress(owner)
        if (result === false) {
            setOwnerName(null)
        } else {
            setOwnerName(result)
        }
        if (account !== '' && isUser) {
            setMyNFTBool(account.toUpperCase() === owner.toUpperCase());
        }
        setOwnerLoading(false);
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

    // utils
    const shrink = (_address) => {
        if (_address.length > 20) {
            return `${_address.substring(0, 5)}......${_address.substring(37, 42)}`
        } else {
            return _address
        }
    }

    const getPercentage = (_quan) => {
        return (Math.round(_quan / 40 * 100) / 100)
    }

    const getPercent_CSS = (_quan) => {
        const _percent = getPercentage(_quan);
        if (_percent < 0.9) {
            return (modalCSS.percentage_superrare)
        } else if (_percent < 2) {
            return (modalCSS.percentage_rare)
        } else if (_percent < 4.8) {
            return (modalCSS.percentage_uncommon)
        } else {
            return (modalCSS.percentage_common)
        }
    }

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
                                        <Image width={512} height={512} priority={true} className="image100" src={`https://api.klaychicken.com/v2/image/${tokenId}.png`} alt="" />
                                    </div>
                                    <div className={modalCSS.otherNFTModalETCWhole}>
                                        <div className={modalCSS.chickizModalNameBox}>
                                            <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                Chickiz #{tokenId}
                                            </span>
                                            <span className={modalCSS.chickizModalOwnerBox}>
                                                <span >
                                                    owned by
                                                </span>
                                                {
                                                    ownerLoading
                                                        ?
                                                        <div className={modalCSS.chickizModalOwnerLoading}>
                                                            <Loading color='light' />
                                                        </div>
                                                        :
                                                        ownerName !== null
                                                            ?
                                                            <Link href={`/farm/${ownerAddress}`}>
                                                                <div id='balloon_dark' balloon='농장 방문하기' className={modalCSS.chickizModalOwnerName}>
                                                                    <b id='hyperBlue'>
                                                                        {ownerName}
                                                                    </b>
                                                                </div>
                                                            </Link>
                                                            :
                                                            <div className={modalCSS.chickizModalOwnerName}>
                                                                <b id='hyperBlue'>
                                                                    {shrink(ownerAddress)}
                                                                </b>
                                                            </div>
                                                }
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
                                                onClick={() => window.open('https://www.twitter.com/klaychicken')}>
                                                <Image className="image100" src={twitterIcon} alt="twitter" />
                                            </div>
                                            <div id="balloon_dark" balloon="디스코드" className={modalCSS.otherNFTModalLinkEach}
                                                onClick={() => window.open('https://discord.com/invite/75xeBYMe9x')}>
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
                                    <div className={modalCSS.chickizModalDetailWholeBox}>
                                        <div className={modalCSS.chickizModalTabBox}>
                                            <span className={classnames(modalCSS.chickizModalEachTab,
                                                tabNum === 0 ? modalCSS.chickizModalEachTab_selected : modalCSS.chickizModalEachTab_notSelected)}
                                                onClick={() => setTabNum(0)}>
                                                채굴 정보
                                            </span>
                                            <span className={classnames(modalCSS.chickizModalEachTab,
                                                tabNum === 1 ? modalCSS.chickizModalEachTab_selected : modalCSS.chickizModalEachTab_notSelected)}
                                                onClick={() => setTabNum(1)}>
                                                특성 정보
                                            </span>
                                        </div>
                                        {
                                            {
                                                0:
                                                    <div className={modalCSS.chickizModalMiningBox}>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                바삭력
                                                                <div className={modalCSS.chickizModalMiningBox_question}
                                                                    id='balloon_dark' balloon='채굴 가이드 보기'
                                                                    onClick={() => window.open('https://klayproject.notion.site/22-07-18-06ac6b88ea4e4478af1f4b57781a629f')}>
                                                                    <Image src={questionIcon_black} alt='' />
                                                                </div>
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    {
                                                                        0:
                                                                            metaIndex[0].trait[0],
                                                                        1:
                                                                            metaIndex[0].trait[1],
                                                                        2:
                                                                            metaIndex[0].trait[2]
                                                                    }[chickizMeta[tokenId].cp]
                                                                }
                                                                <span className={modalCSS.chickizModalMiningBox_remark}>
                                                                    (기본 채굴량 {miningRate.basic[chickizMeta[tokenId].cp]})
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                하루 채굴량
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    superBool
                                                                        ?
                                                                        <>
                                                                            {miningRate.basic[chickizMeta[tokenId].cp] * 3} $CHICK
                                                                            <span className={modalCSS.chickizModalMiningBox_remark}>
                                                                                (기본 {miningRate.basic[chickizMeta[tokenId].cp]} + 슈퍼 200%)
                                                                            </span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {miningRate.basic[chickizMeta[tokenId].cp] * (100 + miningRate.mentor[mentor]) / 100} $CHICK
                                                                            <span className={modalCSS.chickizModalMiningBox_remark}>
                                                                                (기본 {miningRate.basic[chickizMeta[tokenId].cp]} + 멘토 {miningRate.mentor[mentor]}%)
                                                                            </span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                기름
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    remain === '-'
                                                                        ?
                                                                        '-'
                                                                        :
                                                                        <>
                                                                            <div className={modalCSS.chickizModalMiningBox_mentor}>
                                                                                <Image width={128} height={128} src={oilImage} alt='' />
                                                                            </div>
                                                                            {remain}
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                장착 멘토
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    mentorId === null
                                                                        ?
                                                                        'X'
                                                                        :
                                                                        <>
                                                                            <div className={modalCSS.chickizModalMiningBox_mentor}>
                                                                                {
                                                                                    mentorKind === 0
                                                                                        ?
                                                                                        <Image width={128} height={128} src={`https://api.klaychicken.com/v1/bone/image/${mentorId}.png`} alt='' />
                                                                                        :
                                                                                        <Image width={128} height={128} src={`https://api.klaychicken.com/v1/sunsal/image/${mentorId}.png`} alt='' />
                                                                                }
                                                                            </div>
                                                                            #{mentorId}
                                                                            <span className={modalCSS.chickizModalMiningBox_remark}>
                                                                                (채굴량 +{miningRate.mentor[mentor]}%)
                                                                            </span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                슈퍼 치키즈
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    superBool
                                                                        ?
                                                                        'YES'
                                                                        :
                                                                        'NO'
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={modalCSS.chickizModalMiningEachBox}>
                                                            <div className={modalCSS.chickizModalMiningBox_title}>
                                                                치키즈 먹기
                                                            </div>
                                                            <div className={modalCSS.chickizModalMiningBox_info}>
                                                                {
                                                                    true
                                                                        ?
                                                                        'NO'
                                                                        :
                                                                        <>
                                                                            by UNO
                                                                            <span className={modalCSS.chickizModalMiningBox_remark}>
                                                                                (at #9281042)
                                                                            </span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>,
                                                1:
                                                    <div className={modalCSS.chickizModalTraitBox}>
                                                        <div className={modalCSS.chickizModalTraitEachBox}>
                                                            <div id='balloon_dark' balloon='rank' className={modalCSS.chickizModalTraitEachBox_icon}>
                                                                <Image src={rankingIcon} alt='' />
                                                            </div>
                                                            <span className={modalCSS.chickizModalTraitEachBox_trait}>
                                                                {chickizMeta[tokenId].rank}위
                                                            </span>
                                                            <div className={classnames(modalCSS.chickizModalTraitEachBox_percentage,
                                                                {
                                                                    0:
                                                                        modalCSS.percentage_common,
                                                                    1:
                                                                        modalCSS.percentage_uncommon,
                                                                    2:
                                                                        modalCSS.percentage_rare
                                                                }[chickizMeta[tokenId].cp]
                                                            )}>
                                                                {
                                                                    {
                                                                        0:
                                                                            metaIndex[0].trait[0],
                                                                        1:
                                                                            metaIndex[0].trait[1],
                                                                        2:
                                                                            metaIndex[0].trait[2]
                                                                    }[chickizMeta[tokenId].cp]
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            chickizMeta[tokenId].meta.map((a, index) => {

                                                                return (
                                                                    <div key={index} className={modalCSS.chickizModalTraitEachBox}>
                                                                        <div id='balloon_dark' balloon={metaIndex[index + 1].type} className={modalCSS.chickizModalTraitEachBox_icon}>
                                                                            <Image src={rarityIcon[index]} alt='' />
                                                                        </div>
                                                                        <span className={modalCSS.chickizModalTraitEachBox_trait}>
                                                                            {index === 10 ? 'Lv.' : null}{metaIndex[index + 1].trait[a]}
                                                                        </span>
                                                                        <div className={
                                                                            classnames(modalCSS.chickizModalTraitEachBox_percentage, getPercent_CSS(metaIndex[index + 1].quan[a]))}>
                                                                            {getPercentage(metaIndex[index + 1].quan[a])}%
                                                                        </div>
                                                                    </div>
                                                                )

                                                            }
                                                            )
                                                        }
                                                    </div>
                                            }[tabNum]
                                        }
                                    </div>
                                </div >
                            </div >,
                        "transfer":
                            <div className={modalCSS.transferDiv}>
                                <div className={modalCSS.transferInputBox}>
                                    <div className={modalCSS.otherNFTtransferLeftBox}>
                                        <div className={modalCSS.transferImageBox}>
                                            <Image width={512} height={512} priority={true} className="image100" src={`https://api.klaychicken.com/v2/image/${tokenId}.png`} alt="" />
                                        </div>
                                        <div className={modalCSS.otherNFTModalProjectNameWhole_transfer}>
                                            <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                Chickiz #{tokenId}
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
                                                <Image width={512} height={512} priority={true} className="image100" src={`https://api.klaychicken.com/v2/image/${tokenId}.png`} alt="" />
                                            </div>
                                            <div className={modalCSS.otherNFTModalProjectNameWhole_transferResult}>
                                                <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                    Chickiz #{tokenId}
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
                                                <Image width={512} height={512} priority={true} className="image100" src={`https://api.klaychicken.com/v2/image/${tokenId}.png`} alt="" />
                                            </div>
                                            <div className={modalCSS.otherNFTModalProjectNameWhole_transferResult}>
                                                <span className={modalCSS.otherNFTModalProjectNameEach}>
                                                    Chickiz #{tokenId}
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

export default ChickizModal;