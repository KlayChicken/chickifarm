import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

const kip17 = require('../../../src/data/contract/abi/KIP17Full.json');

class KIP17contract {
    constructor(address) {
        this.address = address;
        this.contract = new caver.klay.Contract(kip17.abi, address)
    }

    findABI(name) {
        return kip17.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    async getOwner(id) {
        return (await this.contract.call("ownerOf", id))
    }

    async getTokenOfOwnerByIndex(account, id) {
        return (await this.contract.call("tokenOfOwnerByIndex", account, id))
    }

    async getURI(id) {
        return (await this.contract.call("tokenURI", id))
    }

    async getBalanceOf(account) {
        return (Number(await this.contract.call("balanceOf", account)))
    }

    async getIsApprovedForAll(owner, operator) {
        return (await this.contract.call("isApprovedForAll", owner, operator))
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

    // get List
    async getList(account) {
        const balance = await this.getBalanceOf(account);
        const dividend = 10;
        const q = parseInt(balance / dividend);
        const r = balance % dividend;

        // get splited nft from to from + num
        const getSplitNFT = async (from, num) => {
            const _list = [];
            let id;
            for (let i = from; i < from + num; i++) {
                id = await this.getTokenOfOwnerByIndex(account, i);
                _list.push(id);
            }
            return _list;
        }

        const promises = [];

        for (let j = 0; j < q; j++) {
            promises.push(getSplitNFT(j * dividend, dividend));
        }
        promises.push(getSplitNFT(q * dividend, r));

        const _result = await Promise.all(promises);
        const result = _result.reduce((before, a) => before.concat(a), []);
        const resultSorted = result.sort((a, b) => a - b);

        return resultSorted
    }

    // get URIs - 20개씩
    async getMetaData(list) {
        try {
            const _getURI = async (tokenId) => {
                return (await this.getURI(tokenId));
            }

            const _getMeta = async (_uri) => {
                return (await (await fetch('/api/proxy?url=' + _uri)).json())
            }

            const promises1 = [];
            const promises2 = [];

            for (let i = 0; i < list.length; i++) {
                promises1.push(_getURI(list[i]));
            }
            const uris = await Promise.all(promises1);

            for (let j = 0; j < uris.length; j++) {
                promises2.push(_getMeta(uris[j]))
            }

            const metas = await Promise.all(promises2)

            return metas
        } catch (err) {
            console.error(err)
            return []
        }
    }

    async transfer(klipPopOn, klipPopOff, from, to, id) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: from, gas: 1500000 }, "transferFrom", from, to, id);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("transferFrom"), [from, to, id])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }
}

export default KIP17contract;