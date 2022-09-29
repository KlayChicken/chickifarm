import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// util components
import useInput from '../../../hooks/useInput';
import caver from '../../chain/CaverChrome';
import Wallet from '../../chain/wallet/Wallet';

// page components
import UtilModal from '../../modal/UtilModal';

// images
import randomChickizLogo from "../../../src/image/utils/randomchickiz.png";
import findImage from '../../../src/image/utils/find_gray.png';
import itemNotFound from "../../../src/image/utils/itemNotFound.png";

// store
import { getGuestBook, deleteGuestBook } from '../../../store/modules/guestBook/guestBook';
import { setSmallModalBool, setConfirmState } from '../../../store/modules/modal';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';

function EachFarmSmall_guestBook() {

    let klaytn;
    if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
        klaytn = window.klaytn;
    }

    const router = useRouter();
    const { address } = router.query;
    const { account, isUser } = useSelector((state) => state.myInfo)
    const { confirmState } = useSelector((state) => state.modal)
    const guestBook = useSelector((state) => state.guestBook[address])

    const dispatch = useDispatch();

    const [scrollRef, inView, entry] = useInView();
    const [searchWord, onChangeSearchWord] = useInput("");

    // modal
    const [utilModalBool, setUtilModalBool] = useState(false);

    // param
    const [param1, setParam1] = useState(0);

    useEffect(() => {
        if (address === undefined) return;
        if (inView || guestBook?.start === undefined) {
            dispatch(getGuestBook({ account: address, searchWord: searchWord }))
        }
    }, [inView, address])

    useEffect(() => {
        if (!confirmState) return;
        deleteGB(param1)
        dispatch(setConfirmState({ confirmState: false }))
    }, [confirmState])

    const refreshFilter = useCallback(() => {
        dispatch(getGuestBook({ start: 0, account: address, searchWord: searchWord }))
    }, [dispatch, address, searchWord])

    async function deleteGB(_deleteId) {
        try {
            const _sign = await Wallet.signMessage("deleteGuestBook");
            const res = await dispatch(deleteGuestBook({ deleteId: _deleteId, sign: _sign, account: account })).unwrap();
            dispatch(setSmallModalBool({ bool: true, msg: res.msg, modalTemplate: "justAlert" }))
            refreshFilter()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={FarmCSS.eachFarmFarmerDetailBox}>
                <div className={FarmCSS.eachFarmFarmerGuestBookWriteBox}>
                    <div className={FarmCSS.eachFarmFindInputBox}>
                        <div className={FarmCSS.eachFarmFindIcon} onClick={() => { guestBookRefresh() }}>
                            <Image className="image100" src={findImage} alt="" />
                        </div>
                        <input className={FarmCSS.eachFarmFarmerGuestBookSearch} placeholder="닉네임 혹은 지갑주소 검색" value={searchWord} onChange={onChangeSearchWord}
                            onKeyUp={() => {
                                if (window.event.keyCode === 13) {
                                    refreshFilter()
                                }
                            }} />
                    </div>
                    <button disabled={!isUser || account?.toUpperCase() === address?.toUpperCase()
                        ? 1 : 0}
                        className={!isUser || account?.toUpperCase() === address?.toUpperCase()
                            ? classnames(FarmCSS.eachFarmFarmerGuestBookWriteBoxButton, "grayButton") : classnames(FarmCSS.eachFarmFarmerGuestBookWriteBoxButton, "purpleButton")}
                        onClick={() => setUtilModalBool(true)}>
                        방명록 작성
                    </button>
                </div>
                <div className={FarmCSS.eachFarmFarmerGuestBookBox}>
                    {
                        guestBook?.guestBook.length < 1
                            ?
                            <div className="noNFTBox">
                                <div className="noNFT">
                                    <Image className="image100" src={itemNotFound} alt="" />
                                    <div className="noNFTDescBox">
                                        <span className="noNFTDesc">
                                            아직 방명록이 없어요.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            guestBook?.guestBook.map((a, index) => {
                                return (
                                    <div key={index} className={FarmCSS.eachFarmFarmerGuestBookEachBox}
                                        ref={(guestBook?.guestBook.length - 1 === index && guestBook?.guestBook.length < guestBook?.total)
                                            ? scrollRef
                                            : null}>
                                        <div className={FarmCSS.eachFarmFarmerGuestBookEachHeaderBox}>
                                            <span className={FarmCSS.eachFarmFarmerGuestBookNoName}>
                                                NO.{a.rowNum} {a.fromName}
                                            </span>
                                            <span className={FarmCSS.eachFarmFarmerGuestBookTime}>
                                                {a.writeTime}
                                            </span>
                                            {
                                                account?.toUpperCase() === a.toAddress?.toUpperCase() || account?.toUpperCase() === a.fromAddress.toUpperCase()
                                                    ?
                                                    <span className={FarmCSS.eachFarmFarmerGuestBookDelete} onClick={async function () {
                                                        setParam1(a.id)
                                                        dispatch(setSmallModalBool({ bool: true, msg: "방명록을 삭제하면 다시 되돌릴 수 없습니다. \n 그래도 삭제하시겠습니까?", modalTemplate: "confirmAlert" }))
                                                    }}>
                                                        삭제
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                        <div className={FarmCSS.eachFarmFarmerGuestBookEachBodyBox}>
                                            <div className={classnames(FarmCSS.eachFarmFarmerGuestBookEachBodyImageBox, "neonShine")} onClick={() => { router.push(`/farm/${a.fromAddress}`) }}>
                                                <Image width={256} height={256} className="image100" src={a.fromRepChickiz === null ? randomChickizLogo : `https://api.klaychicken.com/v2/image/${a.fromRepChickiz}.png`} alt="" />
                                            </div>
                                            <span className={FarmCSS.eachFarmFarmerGuestBookEachBodySpan}>
                                                {a.mainText}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            {
                utilModalBool
                    ?
                    <UtilModal setModalBool={setUtilModalBool} refresh={refreshFilter} modalTemplate="guestBook" from={account} to={address} />
                    :
                    null
            }
        </>
    )
}

export default EachFarmSmall_guestBook;