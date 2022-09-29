import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

import convert from '../utils/convert';

import { BigNumber } from 'ethers';
import ContractAddress from '../../../src/data/contract/ContractAddress'

const mining = require('../../../src/data/contract/abi/Chick_Mining.json');
const kip17 = require('../../../src/data/contract/abi/KIP17Full.json');

class Miningcontract {
    constructor() {
        this.address = ContractAddress.mining;
        this.contract = new caver.klay.Contract(mining.abi, ContractAddress.mining);
    }

    findABI(name) {
        return mining.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    // call
    async getChickizInfo(id) {
        return (await this.contract.call('chickizInfo', id))
    }

    async getMinable(id) {
        return (await this.contract.call('minable', id))
    }

    async getChickizInfos(list) {
        try {
            const promises = [];

            for (let i = 0; i < list.length; i++) {
                promises.push(this.getChickizInfo(list[i]));
            }

            const infos = await Promise.all(promises);

            return infos
        } catch (err) {
            console.error(err)
            return []
        }
    }

    async getMinables(list) {
        try {
            const promises = [];

            for (let i = 0; i < list.length; i++) {
                promises.push(this.getMinable(list[i]));
            }

            const minables = await Promise.all(promises);

            return minables
        } catch (err) {
            console.error(err)
            return []
        }
    }

    // send
    async makeSuperChickiz(klipPopOn, klipPopOff, account, id) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "makeSuperChickiz", id);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("makeSuperChickiz"), [id])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async equipMentor(klipPopOn, klipPopOff, account, chickizId, mentorId, mentorKind) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "equipMentor", chickizId, mentorId, mentorKind);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("equipMentor"), [chickizId, mentorId, mentorKind])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async unEquipMentor(klipPopOn, klipPopOff, account, id) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "unEquipMentor", id);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("unEquipMentor"), [id])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async mine(klipPopOn, klipPopOff, account, ids) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 2500000 }, "mine", ids);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("mine"), [ids])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async charge(klipPopOn, klipPopOff, account, ids) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 2500000 }, "charge", ids);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("charge"), [ids])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default Miningcontract;