import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

// images
import closeIcon from "../../src/image/utils/close_black.png";

// css
import modalCSS from '../../styles/modal.module.css';
import classnames from 'classnames';

// store
import { setSmallModalBool, setConfirmState } from '../../store/modules/modal';

function SmallModal(props) {

    const dispatch = useDispatch();
    const { modalTemplate, msg } = useSelector((state) => state.modal);

    // async function okButton() {
    //     // const size = 0;
    //     // for (let i = 0; i < props.params.length; i++) {
    //     //     if (props.params[i] != '') {
    //     //         size++;
    //     //     }
    //     // }
    //     // console.log(size === 0)
    //     // if (size === 0) {
    //     //     props.func()
    //     // } else {
    //     //     props.func(...props.params)
    //     // }
    //     // props.setModalBool(false)
    // }

    // async function noButton() {
    //     props.setModalBool(false)
    // }

    async function okButton() {
        dispatch(setConfirmState({ confirmState: true }))
        dispatch(setSmallModalBool({ bool: false }))
        //  dispatch(setConfirmState({ confirmState: false }))
    }

    async function noButton() {
        dispatch(setSmallModalBool({ bool: false }))
    }

    return (
        <>
            <div className={modalCSS.smallModal}>
                <div className={modalCSS.smallModalCloseDiv}>
                    <div className={modalCSS.smallModalCloseBox} onClick={() => {
                        dispatch(setSmallModalBool({ bool: false }));
                        dispatch(setConfirmState({ confirmState: false }))
                    }}>
                        <Image src={closeIcon} alt="close" />
                    </div>
                </div>
                <div className={modalCSS.smallModalContent}>
                    {
                        {
                            "justAlert":
                                <>
                                    <span className={modalCSS.smallModalContentTitle}>
                                        {msg}
                                    </span>
                                    <div className={modalCSS.smallModalJustAlertDiv}>
                                        <div className={classnames(modalCSS.smallModalButton, 'greenButton')}
                                            onClick={() => dispatch(setSmallModalBool({ bool: false }))}>
                                            확인
                                        </div>
                                    </div>
                                </>,
                            "confirmAlert":
                                <>
                                    <span className={modalCSS.smallModalContentTitle}>
                                        {msg}
                                    </span>
                                    <div className={modalCSS.smallModalConfirmAlertDiv}>
                                        <div className={classnames(modalCSS.smallModalButton, 'greenButton')} onClick={() => okButton()}>예</div>
                                        <div className={classnames(modalCSS.smallModalButton, 'redButton')} onClick={() => noButton()}>아니오</div>
                                    </div>
                                </>,
                        }[modalTemplate]
                    }
                </div>
            </div>
            <div className={modalCSS.whole} onClick={() => {
                dispatch(setSmallModalBool({ bool: false }));
                dispatch(setConfirmState({ confirmState: false }))
            }} />
        </>
    );
}

export default SmallModal;