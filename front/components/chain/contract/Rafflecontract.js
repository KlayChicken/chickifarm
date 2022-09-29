import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

import convert from '../utils/convert';

import { BigNumber } from 'ethers';
import ContractAddress from '../../../src/data/contract/ContractAddress'

const raffle = require('../../../src/data/contract/abi/Raffle.json');
const kip17 = require('../../../src/data/contract/abi/KIP17Full.json');

class Rafflecontract {
    constructor() {
        this.address = ContractAddress.raffle;
        this.contract = new caver.klay.Contract(raffle.abi, ContractAddress.raffle);
    }

    findABI(name) {
        return raffle.abi.filter((abi) => abi.name === name && abi.type === "function")[0];
    }

    // call
    async getSoldTickets(raffleId) {
        return (await this.contract.call('soldTickets', raffleId))
    }

    async getClaimByRaffler(raffleId) {
        return (await this.contract.call('claimByRaffler_done', raffleId))
    }

    async getClaimByWinner(raffleId) {
        return (await this.contract.call('claimByWinner_done', raffleId))
    }

    async getRaffleStatus(raffleId) {
        return (await this.contract.call('raffleStatus', raffleId))
    }

    // send
    async createRaffle(klipPopOn, klipPopOff, account, nft, tokenId, period, paymentMethod, _ticketPrice, ticketQuan) {
        const walletKind = Wallet.getWalletKind();

        try {
            const ticketPrice = caver.utils.convertToPeb(_ticketPrice.toString(), 'KLAY');
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "createRaffle", nft, tokenId, period, paymentMethod, ticketPrice, ticketQuan);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("createRaffle"), [nft, tokenId, period, paymentMethod, ticketPrice, ticketQuan])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }

    async buyTicket(klipPopOn, klipPopOff, account, paymentMethod, ticketPrice, raffleId, ticketQuan) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (paymentMethod === 0) {
                const _value = convert.from_mKLAY_to_PEB_multiply(ticketPrice, ticketQuan);
                if (walletKind === 'Kaikas' && Kaikas.installed) {
                    const res = await this.contract.send({ from: account, gas: 1500000, value: _value }, "buyTicketsWithKlay", raffleId, ticketQuan);
                    return { status: res.status, tx_hash: res.transactionHash }
                } else if (walletKind === 'Klip') {
                    const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("buyTicketsWithKlay"), [raffleId, ticketQuan], _value)
                    return { status: true, tx_hash: res.tx_hash }
                }
            } else if (paymentMethod === 1) {
                if (walletKind === 'Kaikas' && Kaikas.installed) {
                    const res = await this.contract.send({ from: account, gas: 1500000 }, "buyTicketsWithChick", raffleId, ticketQuan);
                    return { status: res.status, tx_hash: res.transactionHash }
                } else if (walletKind === 'Klip') {
                    const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("buyTicketsWithChick"), [raffleId, ticketQuan])
                    return { status: true, tx_hash: res.tx_hash }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async refund(klipPopOn, klipPopOff, account, raffleId) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "refund", raffleId);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("refund"), [raffleId])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }

    async claimByRaffler(klipPopOn, klipPopOff, account, raffleId) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "claimByRaffler", raffleId);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("claimByRaffler"), [raffleId])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }

    async claimByWinner(klipPopOn, klipPopOff, account, raffleId) {
        const walletKind = Wallet.getWalletKind();

        try {
            if (walletKind === 'Kaikas' && Kaikas.installed) {
                const res = await this.contract.send({ from: account, gas: 1500000 }, "claimByWinner", raffleId);
                return { status: res.status, tx_hash: res.transactionHash }
            } else if (walletKind === 'Klip') {
                const res = await Klip.runContract(klipPopOn, klipPopOff, this.address, this.findABI("claimByWinner"), [raffleId])
                return { status: true, tx_hash: res.tx_hash }
            }

        } catch (err) {
            console.error(err);
        }
    }
}

export default Rafflecontract;