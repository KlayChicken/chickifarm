import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

const chick = require('../../../src/data/contract/abi/Chick.json');
import ContractAddress from '../../../src/data/contract/ContractAddress';
import { ethers } from 'ethers';

class Chickcontract {
    constructor() {
        this.address = ContractAddress.chick;
        this.contract = new caver.klay.Contract(chick.abi, ContractAddress.chick)
    }

    findABI(name) {
        return chick.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    async getBalance(account) {
        return (await this.contract.call("balanceOf", account))
    }

    async getAllowance(owner, spender) {
        return (await this.contract.call("allowance", owner, spender))
    }

    async approve(klipPopOn, klipPopOff, account, to) {
        const walletKind = Wallet.getWalletKind();
        const maxNum = (ethers.constants.MaxUint256).toString();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "approve", to, maxNum);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("approve"), [to, maxNum])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }
}

export default Chickcontract;