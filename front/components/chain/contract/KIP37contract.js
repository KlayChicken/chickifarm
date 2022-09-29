import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

const kip37 = require('../../../src/data/contract/abi/KIP37.json');

class KIP37contract {
    constructor(address) {
        this.address = address;
        this.contract = new caver.klay.Contract(kip37.abi, address);
    }

    findABI(name) {
        return kip37.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    async getBalance(account, id) {
        return (Number(await this.contract.call("balanceOf", account, id)))
    }

    async getURI(id) {
        return (await this.contract.call("uri", id))
    }

    async getIsApprovedForAll(account, operator) {
        return (await this.contract.call("isApprovedForAll", account, operator))
    }

    // send

    async transfer(klipPopOn, klipPopOff, from, to, id, quan) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: from, gas: 1500000 }, "safeTransferFrom", from, to, id, quan, 0);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("safeTransferFrom"), [from, to, id, quan, ""])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }

    async setApprovalForAll(klipPopOn, klipPopOff, account, to, approved) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "setApprovalForAll", to, approved);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("setApprovalForAll"), [to, approved])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }
}

export default KIP37contract;