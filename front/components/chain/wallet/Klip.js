import klipSDK from '../KlipSDK_next';
import { BigNumber } from 'ethers';

const Klip = {
    BAPP_NAME: '치키농장',
    checkMobile: function () {
        const pc_device = "win16|win32|win64|mac|macintel";
        const this_device = navigator.platform;

        if (this_device) {
            if (pc_device.indexOf(navigator.platform.toLowerCase()) < 0) {
                return true // mobile
            } else {
                return false // pc
            }
        }
    },
    request: async function (res, popOn, popOff) {
        klipSDK.request(res.request_key, async () => {
            if (this.checkMobile()) {
                window.open(`https://klipwallet.com/?target=/a2a?request_key=${res.request_key}`)
            } else {
                popOn(res.request_key)
            }
        });
        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                const result = await klipSDK.getResult(res.request_key);
                if (result.status === 'requested' || result.status === 'canceled' || result.status === 'completed' || result.result !== undefined) {
                    popOff()
                    clearInterval(interval);
                    setTimeout(() => resolve(result.result), 2000);
                }
            }, 1000);
        });
    },
    connect: async function (popOn, popOff) {
        const res = await klipSDK.prepare.auth({ bappName: this.BAPP_NAME });
        return (await this.request(res, popOn, popOff)).klaytn_address;
    },
    runContract: async function (popOn, popOff, contractAddress, abi, _params, value) {
        //const params = [];
        //for (const param of _params) {
        //    if (Array.isArray(param) === true) {
        //        const ps = [];
        //        for (const p of param) {
        //            if (p instanceof BigNumber) {
        //                ps.push(p.toString());
        //            } else {
        //                ps.push(p);
        //            }
        //        }
        //        params.push(ps);
        //    } else if (param instanceof BigNumber) {
        //        params.push(param.toString());
        //    } else {
        //        params.push(param);
        //    }
        //}

        const res = await klipSDK.prepare.executeContract({
            bappName: this.BAPP_NAME,
            to: contractAddress,
            abi: JSON.stringify(abi),
            params: JSON.stringify(_params),
            value: (value === undefined ? 0 : value).toString(),
        });
        return (await this.request(res, popOn, popOff));
    },
}

export default Klip;