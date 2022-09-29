import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

import convert from '../utils/convert';

import { BigNumber } from 'ethers';
import ContractAddress from '../../../src/data/contract/ContractAddress'

const bank = require('../../../src/data/contract/abi/Bank.json');
const kip17 = require('../../../src/data/contract/abi/KIP17Full.json');

class Bankcontract {
    constructor() {
        this.address = ContractAddress.bank;
        this.contract = new caver.klay.Contract(bank.abi, ContractAddress.bank);
    }

    findABI(name) {
        return bank.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    // call
    async getAmountOut(amountIn, inKind) {
        /*
            **get number to number 
            **단위는 KLAY(10**18)

            uint8 private constant _KIND_KLAY = 1;
            uint8 private constant _KIND_CHICK = 2;
        */
        try {
            const _amountIn = caver.utils.convertToPeb(amountIn.toString(), 'KLAY')
            const amountOut = Number(caver.utils.convertFromPeb(await this.contract.call('getAmountOutFromPool', _amountIn, inKind), 'KLAY'));
            const amountOut_calculated = Math.floor(amountOut * 10000) / 10000
            return amountOut_calculated
        } catch (err) {
            console.error(err)
            return 'error'
        }
    }

    async getAmountIn(amountOut, outKind) {
        try {
            const _amountOut = caver.utils.convertToPeb(amountOut.toString(), 'KLAY')
            const amountIn = Number(caver.utils.convertFromPeb(await this.contract.call('getAmountInFromPool', _amountOut, outKind), 'KLAY'));
            const amountIn_calculated = Math.floor(amountIn * 10000) / 10000
            return amountIn_calculated
        } catch (err) {
            console.error(err)
            return 'error'
        }
    }

    async getReserves() {
        return (await this.contract.call('getReservesFromPool'))
    }

    // send
    async swapExactKlayForChick(klipPopOn, klipPopOff, account, amount_in, amount_out_min) {
        const walletKind = Wallet.getWalletKind();
        const _amount_in = (caver.utils.convertToPeb(amount_in.toString(), 'KLAY')).toString();
        const _amount_out_min = (caver.utils.convertToPeb(amount_out_min.toString(), 'KLAY')).toString();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000, value: _amount_in }, "swapExactKlayForChick", _amount_out_min, account);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("swapExactKlayForChick"), [_amount_out_min, account], _amount_in)
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async swapKlayForExactChick(klipPopOn, klipPopOff, account, amount_in_max, amount_out) {
        const walletKind = Wallet.getWalletKind();
        const _amount_in_max = (caver.utils.convertToPeb(amount_in_max.toString(), 'KLAY')).toString();
        const _amount_out = (caver.utils.convertToPeb(amount_out.toString(), 'KLAY')).toString();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000, value: _amount_in_max }, "swapKlayForExactChick", _amount_out, account);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("swapKlayForExactChick"), [_amount_out, account], _amount_in_max)
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async swapExactChickForKlay(klipPopOn, klipPopOff, account, amount_in, amount_out_min) {
        const walletKind = Wallet.getWalletKind();
        const _amount_in = (caver.utils.convertToPeb(amount_in.toString(), 'KLAY')).toString();
        const _amount_out_min = (caver.utils.convertToPeb(amount_out_min.toString(), 'KLAY')).toString();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "swapExactChickForKlay", _amount_in, _amount_out_min, account);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("swapExactChickForKlay"), [_amount_in, _amount_out_min, account])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async swapChickForExactKlay(klipPopOn, klipPopOff, account, amount_in_max, amount_out) {
        const walletKind = Wallet.getWalletKind();
        const _amount_in_max = (caver.utils.convertToPeb(amount_in_max.toString(), 'KLAY')).toString();
        const _amount_out = (caver.utils.convertToPeb(amount_out.toString(), 'KLAY')).toString();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "swapChickForExactKlay", _amount_in_max, _amount_out, account);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("swapChickForExactKlay"), [_amount_in_max, _amount_out, account])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default Bankcontract;