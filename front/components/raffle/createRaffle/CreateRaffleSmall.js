import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// css
import classnames from "classnames";
import RaffleCSS from "../../../styles/raffle.module.css";

// Image
import randomChickizLogo from "../../../src/image/utils/randomchickiz.png";

// page components
import useInput from '../../../hooks/useInput';
import Loading from '../../util/Loading';

// util component
import KIP17contract from '../../chain/contract/KIP17contract';
import Rafflecontract from '../../chain/contract/Rafflecontract';
import ContractAddress from '../../../src/data/contract/ContractAddress'

// store
import { createRaffle, resetFilter } from "../../../store/modules/raffle/raffle";
import { resetOtherNFT, getOtherNFTBalances } from "../../../store/modules/otherNft";
import { setRequestKey, setKlipModalBool } from '../../../store/modules/klipstore';
import { getMyRaffleList_create_live_first, getMyRaffleList_create_end_first } from '../../../store/modules/raffle/myRaffle';
import { setSmallModalBool } from '../../../store/modules/modal';


function CreateRaffleSmall({ nftAddress, nftTokenId, nftCollectionName, nftMeta }) {

    const dispatch = useDispatch();
    const router = useRouter();

    const { account } = useSelector((state) => state.myInfo);

    // nft
    const [myNFTBool, setMyNFTBool] = useState(false);

    // loading
    const [createRaffleLoading, setCreateRaffleLoading] = useState(false);

    // raffleInput
    const [rafflePeriod, onChangeRafflePeriod] = useInput(86400);
    const [raffleTicketQuan, onChangeRaffleTicketQuan] = useInput(null);
    const [raffleTicketPrice, onChangeRaffleTicketPrice] = useInput(null);
    const [rafflePaymentMethod, setRafflePaymentMethod] = useState(0);
    const [raffleAgree, setRaffleAgree] = useState(false);

    useEffect(() => {
        if (account === "") return;
        if (nftAddress === null) return;
        if (nftTokenId === null) return;
        getNFTOwner();
    }, [account, nftAddress, nftTokenId])

    async function getNFTOwner() {
        const nftContract = new KIP17contract(nftAddress);
        if (account !== "") {
            const owner = await nftContract.getOwner(nftTokenId);
            setMyNFTBool(account.toUpperCase() === owner.toUpperCase());
        }
    }

    async function createRaffleWhole() {
        if (!(10 <= Number(raffleTicketQuan) && Number(raffleTicketQuan) <= 300)) {
            dispatch(setSmallModalBool({ bool: true, msg: '올바른 티켓 개수를 입력해주세요(10~300개).', modalTemplate: "justAlert" }))
            return
        }
        if (!(0 < Number(raffleTicketPrice)) || ((Number(raffleTicketPrice) * 1000) - Math.floor(Number(raffleTicketPrice) * 1000)) > 0 || Number(raffleTicketPrice) > 1000000000) {
            dispatch(setSmallModalBool({ bool: true, msg: '올바른 티켓 가격을 입력해주세요\n(숫자만 입력, 소수점 아래 셋째 자리까지 가능,\n 티켓 최대 가격 1,000,000,000).', modalTemplate: "justAlert" }))
            return
        }
        if (!raffleAgree) {
            dispatch(setSmallModalBool({ bool: true, msg: '래플 생성 동의에 체크해주세요.', modalTemplate: "justAlert" }))
            return
        }
        if (!window.confirm('래플 생성 이후에는 수정/취소가 불가능합니다. 래플을 생성하시겠습니까?')) return;

        try {
            setCreateRaffleLoading(true)

            const nftContract = new KIP17contract(nftAddress);
            let res = {};

            if (await nftContract.getIsApprovedForAll(account, ContractAddress.raffle)) {
                res.status = true;
            } else {
                res = await nftContract.setApprovalForAll(klipPopOn, klipPopOff, account, ContractAddress.raffle, true)
            }


            if (res?.status === true) {
                const rafflecon = new Rafflecontract();
                const res1 = await rafflecon.createRaffle(klipPopOn, klipPopOff, account, nftAddress, nftTokenId, rafflePeriod, rafflePaymentMethod, raffleTicketPrice, raffleTicketQuan);
                if (res1.status = true) {
                    const res2 = await dispatch(createRaffle()).unwrap()
                    dispatch(setSmallModalBool({ bool: true, msg: res2?.msg, modalTemplate: "justAlert" }))
                    dispatch(resetOtherNFT());
                    dispatch(getOtherNFTBalances(account));
                    dispatch(resetFilter());
                    dispatch(getMyRaffleList_create_live_first({ account: account }))
                    router.push('/raffle')
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: '래플 생성에 실패하였습니다.', modalTemplate: "justAlert" }))
                }
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: '래플 생성에 실패하였습니다.', modalTemplate: "justAlert" }))
            }
            setCreateRaffleLoading(false)
        } catch (err) {
            setCreateRaffleLoading(false)
            dispatch(setSmallModalBool({ bool: true, msg: `래플 생성에 실패하였습니다.\n\n* 단, 트랜잭션이 발생해 NFT가 빠져나갔다면 1분 이내에 래플이 정상적으로 생성됩니다.\n\n* 오류가 반복되면 운영팀에 문의주세요.`, modalTemplate: "justAlert" }))
            console.error(err)
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
            <div className="subBoard_small">
                <div className={RaffleCSS.createRaffle_small_WholeBox}>
                    <div className={RaffleCSS.raffleDetailHeader}>
                        <div className={RaffleCSS.raffleDetailImgBox}>
                            {
                                nftMeta?.image === undefined
                                    ?
                                    <Image className="maxImage100" src={randomChickizLogo} alt='no chosen' />
                                    :
                                    nftMeta?.image.endsWith('mp4') || nftMeta?.image.endsWith('genesis')
                                        ? <video className="image100" autoPlay muted loop><source src={nftMeta?.image} type='video/mp4' /></video>
                                        : <img className="maxImage100" src={nftMeta?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt='chosen NFT' />
                            }
                        </div>
                        <div className={RaffleCSS.raffleDetailHead}>
                            <span className={RaffleCSS.raffleDetailCollection}>
                                {nftCollectionName ? nftCollectionName : 'collection'}
                            </span>
                            <span className={RaffleCSS.raffleDetailName}>
                                {nftMeta?.name ? nftMeta?.name : 'Choose your NFT'}
                            </span>
                        </div>
                    </div>
                    <hr className={RaffleCSS.raffleLine} />
                    <div className={RaffleCSS.createRaffle_CreateDetailsBox}>
                        <div className={RaffleCSS.createRaffle_CreateDetailsEachBox}>
                            <div className={RaffleCSS.createRaffle_CreateDetailsEach}>
                                <span className={RaffleCSS.createRaffle_CreateDetailsEachLabel}>
                                    래플 기간
                                </span>
                                <div className={RaffleCSS.createRaffle_CreateDetailsInputBox}>
                                    <select className={RaffleCSS.createRaffle_CreateDetailsInput_long} value={rafflePeriod} onChange={onChangeRafflePeriod}>
                                        <option value={21600}>6시간</option>
                                        <option value={43200}>12시간</option>
                                        <option value={64800}>18시간</option>
                                        <option value={86400}>24시간</option>
                                        <option value={108000}>30시간</option>
                                        <option value={129600}>36시간</option>
                                        <option value={151200}>42시간</option>
                                        <option value={172800}>48시간</option>
                                    </select>
                                </div>
                            </div>
                            <div className={RaffleCSS.createRaffle_CreateDetailsEach}>
                                <span className={RaffleCSS.createRaffle_CreateDetailsEachLabel}>
                                    티켓 개수
                                </span>
                                <div className={RaffleCSS.createRaffle_CreateDetailsInputBox}>
                                    <input className={RaffleCSS.createRaffle_CreateDetailsInput_long} type='number' placeholder="10~300개"
                                        onChange={onChangeRaffleTicketQuan} value={raffleTicketQuan !== null ? raffleTicketQuan : ""}
                                        min="10" max="300" />
                                </div>
                            </div>
                            <div className={RaffleCSS.createRaffle_CreateDetailsEach}>
                                <span className={RaffleCSS.createRaffle_CreateDetailsEachLabel}>
                                    티켓 가격
                                </span>
                                <div className={RaffleCSS.createRaffle_CreateDetailsInputBox}>
                                    <input className={RaffleCSS.createRaffle_CreateDetailsInput_short} type='number' placeholder="숫자만" max="1000000000"
                                        onChange={onChangeRaffleTicketPrice} value={raffleTicketPrice !== null ? raffleTicketPrice : ""} />
                                    <div className={RaffleCSS.createRaffle_CreateDetailsSelectMethodBox}>
                                        <div className={rafflePaymentMethod === 0 ? RaffleCSS.createRaffle_CreateDetailsSelectMethodEach_selected : RaffleCSS.createRaffle_CreateDetailsSelectMethodEach}
                                            onClick={() => setRafflePaymentMethod(0)}>
                                            KLAY
                                        </div>
                                        <div className={rafflePaymentMethod === 1 ? RaffleCSS.createRaffle_CreateDetailsSelectMethodEach_selected : RaffleCSS.createRaffle_CreateDetailsSelectMethodEach}
                                            onClick={() => setRafflePaymentMethod(1)}>
                                            CHICK
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={RaffleCSS.createRaffle_CreateDetailsNoticeBox}>
                            <div className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent}>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_title}>
                                    래플 생성 방법
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_desc}>
                                    1. 래플에 등록하고 싶은 NFT를 선택하세요.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_desc}>
                                    2. 티켓의 가격과 개수를 설정하세요.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_desc}>
                                    3. 래플의 시간을 설정하세요. 최소 6시간부터 최대 48시간까지 설정할 수 있습니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_desc}>
                                    4. 래플을 생성하면 NFT가 스마트 컨트랙트로 전송됩니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_desc}>
                                    5. 티켓 판매가 완료되면 6%의 수수료를 제외한 티켓 판매금을 수령하세요. (치키즈 3개 이상 홀더는 수수료가 50% 감면됩니다.)
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_title}>
                                    래플 유의 사항
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 티켓이 1장도 판매되지 않으면, NFT를 다시 수령해야 합니다. 티켓이 1장 이상 판매되면 추첨은 그대로 진행됩니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 티켓이 모두 판매되어도 설정한 시간이 모두 지나야 수령이 가능합니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 티켓의 가격은 소수점 아래 셋째 자리까지만 설정 가능합니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 블록체인에 정보가 저장되므로 래플 생성 후 취소/변경이 절대 불가합니다.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 기존에 등록된 NFT 컬렉션만 생성이 가능합니다. 추가를 원하는 프로젝트는 클치 운영진에게 신청해주세요.
                                </span>
                                <span className={RaffleCSS.createRaffle_CreateDetailsNoticeBoxContent_notice}>
                                    * 래플 생성 과정에서 총 2회의 트랜잭션이 발생합니다. NFT 컬렉션마다 최초 등록 이후에는 1회의 트랜잭션만 발생합니다.
                                </span>
                            </div>
                        </div>

                    </div>
                    <hr className={RaffleCSS.raffleLine} />
                    <div className={RaffleCSS.createRaffle_CreateBox}>
                        <div className={RaffleCSS.createRaffle_CreateSign}>
                            <input type="checkbox" className={RaffleCSS.createRaffle_CreateSignInput} checked={raffleAgree} onChange={() => setRaffleAgree(!raffleAgree)} />
                            <span className={RaffleCSS.createRaffle_CreateSignSpan} onClick={() => setRaffleAgree(!raffleAgree)}>
                                상기의 내용을 충분히 숙지하였으며 이에 동의합니다.
                            </span>
                        </div>
                        {
                            !createRaffleLoading
                                ?
                                myNFTBool
                                    ?
                                    <button className={classnames(RaffleCSS.createRaffle_CreateButton, "purpleButton")} onClick={createRaffleWhole}>
                                        생성하기
                                    </button>
                                    :
                                    <button className={classnames(RaffleCSS.createRaffle_CreateButton, "grayButton")}>
                                        생성하기
                                    </button>
                                :
                                <button className={classnames(RaffleCSS.createRaffle_CreateButton, "grayButton")}>
                                    <div className={RaffleCSS.createRaffleLoadingBox}>
                                        <Loading />
                                    </div>
                                </button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateRaffleSmall;