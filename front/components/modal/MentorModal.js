import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classnames from 'classnames';

// images
import closeIcon from "../../src/image/utils/close_black.png";

// css
import modalCSS from '../../styles/modal.module.css';

// page component
import Loading from '../util/Loading';

// contract
import Miningcontract from '../chain/contract/Miningcontract';
import KIP17contract from '../chain/contract/KIP17contract';
import ContractAddress from '../../src/data/contract/ContractAddress';

// store
import { setRequestKey, setKlipModalBool } from '../../store/modules/klipstore';
import { nftFromChain } from '../../store/modules/nft';
import { setSmallModalBool } from '../../store/modules/modal';
import { getBalance } from '../../store/modules/myInfo'

function MentorModal(props) {

    const dispatch = useDispatch();

    const [modalTemplate, setModalTemplate] = useState(0);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedMentorKind, setSelectedMentorKind] = useState(null);
    const [loading, setLoading] = useState(false);


    const { bone, sunsal } = useSelector((state) => state.nft);
    const { account } = useSelector((state) => state.myInfo);

    const equipMentor = async () => {
        if (selectedMentor === null) {
            dispatch(setSmallModalBool({ bool: true, msg: "멘토를 선택해주세요.", modalTemplate: "justAlert" }))
            return
        }
        try {
            setLoading(true);
            let res = {};

            if (selectedMentorKind === 0) {
                const bonecon = new KIP17contract(ContractAddress.v1bone);
                if (await bonecon.getIsApprovedForAll(account, ContractAddress.mining)) {
                    res.status = true;
                } else {
                    res = await bonecon.setApprovalForAll(klipPopOn, klipPopOff, account, ContractAddress.mining, true)
                }
            } else if (selectedMentorKind === 1) {
                const sunsalcon = new KIP17contract(ContractAddress.v1sunsal);
                if (await sunsalcon.getIsApprovedForAll(account, ContractAddress.mining)) {
                    res.status = true;
                } else {
                    res = await sunsalcon.setApprovalForAll(klipPopOn, klipPopOff, account, ContractAddress.mining, true)
                }
            }

            if (res?.status === true) {
                const minecon = new Miningcontract();
                const res1 = await minecon.equipMentor(klipPopOn, klipPopOff, account, props.tokenId, selectedMentor, selectedMentorKind);
                if (res1?.status === true) {
                    props.setModalBool(false);
                    props.refresh();
                    dispatch(setSmallModalBool({ bool: true, msg: "멘토 장착에 성공하였습니다.", modalTemplate: "justAlert" }))
                    dispatch(getBalance(account));
                    dispatch(nftFromChain(account));
                } else {
                    dispatch(setSmallModalBool({ bool: true, msg: "장착에 실패하셨습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
                    props.setModalBool(false);
                }
            } else {
                dispatch(setSmallModalBool({ bool: true, msg: "장착에 실패하셨습니다. 다시 시도해주세요.", modalTemplate: "justAlert" }))
                props.setModalBool(false);
            }
            setLoading(false);
        } catch (err) {
            console.error(err)
            setLoading(false);
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
                <div className={modalCSS.modalContent}>
                    {
                        {
                            0:
                                <div className={modalCSS.mentor_cautionWhole}>
                                    <span className={modalCSS.mentor_cautionTitle}>
                                        멘토 장착 시 유의사항
                                    </span>
                                    <span className={modalCSS.mentor_caution}>
                                        * 멘토를 처음 장착하는 경우, 두 번의 트랜잭션이 발생합니다.<br /><br />
                                        * 멘토를 장착할 경우 지금까지 쌓인 토큰이 모두 자동 채굴됩니다.<br /><br />
                                        * 멘토를 장착한 채로 치키즈를 이동하면 멘토의 소유권도 함께 이동합니다.<br />&nbsp;&nbsp;치키즈 판매(전송) 전에 멘토를 '꼭' 해제해주세요.<br /><br />
                                        * 자세한 내용은 <b id='hyperBlue' onClick={() => window.open('https://klayproject.notion.site/8a2894ec853d44699b1c843fa9f430b0')}>채굴 가이드</b>를 참고해주세요.
                                    </span>
                                    <button onClick={() => setModalTemplate(1)} className={classnames(modalCSS.mentor_cautionButton, 'greenButton')}>유의사항 확인하고 다음으로 넘어가기</button>
                                </div>,
                            1:
                                <div className={modalCSS.mentor_cautionWhole}>
                                    <div className={modalCSS.mentor_equipHeader}>
                                        <div className={modalCSS.mentor_equipHeaderFirst}>
                                            <div className={modalCSS.mentor_equipChickiz}>
                                                <Image width={512} height={512} className='image100'
                                                    src={`https://api.klaychicken.com/v2/image/${props.tokenId}.png`} alt={`Chickiz #${props.tokenId}`} />
                                            </div>
                                            <span className={modalCSS.mentor_equipChickizName}>
                                                Chickiz #{props.tokenId}
                                            </span>
                                        </div>
                                        <span className={modalCSS.mentor_equipDesc}>
                                            에 장착할 멘토를 선택해주세요. [현재&nbsp; <b id='red'>#{selectedMentor}</b> &nbsp;선택]
                                        </span>
                                    </div>
                                    <div className={modalCSS.mentor_equipGridBox}>
                                        <div className={classnames(modalCSS.modalContentNFTGrid, "grid6", "mobile_grid4")}>
                                            {
                                                bone.map((a, index) => {
                                                    return (
                                                        <div key={index}
                                                            className={selectedMentor === a ? classnames("NFTBox neonShine_black", modalCSS.mentor_selected) : "NFTBox neonShine_black"}
                                                            onClick={() => { setSelectedMentor(a); setSelectedMentorKind(0); }}>
                                                            <div className="NFTImageBox">
                                                                <Image width={256} height={256} className="image100" src={"https://api.klaychicken.com/v1/bone/image/" + a + ".png"} alt="" />
                                                            </div>
                                                            <span className="NFTName" style={{ color: "black" }}>
                                                                #{a}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            }
                                            {
                                                sunsal.map((b, index) => {
                                                    return (
                                                        <div key={index}
                                                            className={selectedMentor === b ? classnames("NFTBox neonShine_black", modalCSS.mentor_selected) : "NFTBox neonShine_black"}
                                                            onClick={() => { setSelectedMentor(b); setSelectedMentorKind(1); }}>
                                                            <div className="NFTImageBox">
                                                                <Image width={256} height={256} className="image100" src={"https://api.klaychicken.com/v1/sunsal/image/" + b + ".png"} alt="" />
                                                            </div>
                                                            <span className="NFTName" style={{ color: "black" }}>
                                                                #{b}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                    {
                                        !loading
                                            ?
                                            <div className={modalCSS.mentor_equipButton}>
                                                <button className={classnames("greenButton", modalCSS.mentor_equipButton)} onClick={equipMentor}>
                                                    <span className={modalCSS.transferBtnSpan}>장착하기</span>
                                                </button>
                                            </div>
                                            :
                                            <div className={modalCSS.mentor_equipButton}>
                                                <button className={classnames("greenButton", modalCSS.mentor_equipButton)}>
                                                    <div className={modalCSS.transferLoadingBox}>
                                                        <Loading />
                                                    </div>
                                                </button>
                                            </div>
                                    }
                                </div>
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => props.setModalBool(false)} />
        </>
    );
}

export default MentorModal;