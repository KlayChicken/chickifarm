import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

import convert from '../utils/convert';

import { BigNumber } from 'ethers';
import ContractAddress from '../../../src/data/contract/ContractAddress'

const chickStore = require('../../../src/data/contract/abi/ChickStore.json');

class ChickStorecontract {
    constructor() {
        this.address = ContractAddress.chickStore;
        this.contract = new caver.klay.Contract(chickStore.abi, ContractAddress.chickStore);
    }

    findABI(name) {
        return chickStore.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    // call

    // send
    async buyProduct(klipPopOn, klipPopOff, account, id, quan) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "buyProduct", id, quan);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("buyProduct"), [id, quan])
                return { status: true, tx_hash: res.tx_hash }
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default ChickStorecontract;