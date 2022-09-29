import caver from '../CaverChrome';
import { BigNumber } from 'ethers';

const from_mKLAY_to_PEB = (mKLAY) => {
    return (caver.utils.convertToPeb(mKLAY, 'mKLAY'));
}

const from_mKLAY_to_KLAY = (mKLAY) => {
    return (caver.utils.convertFromPeb(caver.utils.convertToPeb(mKLAY, 'mKLAY'), 'KLAY'))
}

const from_mKLAY_to_PEB_multiply = (mKLAY, mulValue) => {
    if (mulValue % 1 !== 0) {
        return '-'
    }
    return (BigNumber.from(caver.utils.convertToPeb(mKLAY, 'mKLAY')).mul(mulValue)).toString();
}

const from_mKLAY_to_KLAY_multiply = (mKLAY, mulValue) => {
    if (mulValue % 1 !== 0) {
        return '-'
    }
    return (caver.utils.convertFromPeb((BigNumber.from(caver.utils.convertToPeb(mKLAY, 'mKLAY')).mul(mulValue)), 'KLAY')).toString();
}

const convert = {
    from_mKLAY_to_PEB: from_mKLAY_to_PEB,
    from_mKLAY_to_KLAY: from_mKLAY_to_KLAY,
    from_mKLAY_to_PEB_multiply: from_mKLAY_to_PEB_multiply,
    from_mKLAY_to_KLAY_multiply: from_mKLAY_to_KLAY_multiply,
}

export default convert;