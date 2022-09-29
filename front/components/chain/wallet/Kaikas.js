import caver from '../CaverChrome'
import dynamic from 'next/dynamic'
import ContractAddress from '../../../src/data/contract/ContractAddress';

let klaytn;

if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
    klaytn = window['klaytn'];
} else {
    // klaytn = dynamic(() => window['klaytn'], { ssr: false })
}


const Kaikas = {
    installed: klaytn !== undefined,
    loadAddress: function () {
        if (this.installed) {
            return klaytn.selectedAddress;
        } else {
            return undefined;
        }
    },
    connect: async function () {
        if (this.installed) {
            const accounts = await klaytn?.enable()
            return accounts[0]
        }
    },
    getNetwork: function () {
        if (this.installed) {
            return klaytn?.networkVersion
        }
    },
    signMessage: async function (msg) {
        if (this.installed) {
            const sign = await caver.klay.sign(msg, klaytn.selectedAddress)
            return sign
        }
    },
    addToken: async function () {
        const tokenImage = 'https://chickifarm.com/image/chick.png';
        klaytn.sendAsync(
            {
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: ContractAddress.chick, // The address that the token is at.
                        symbol: 'CHICK', // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18, // The number of decimals in the token
                        image: tokenImage // A string url of the token logo
                    }
                },
                id: Math.round(Math.random() * 100000)
            },
            (err, added) => {
                if (added) {
                    console.log('success')
                } else {
                    console.log('fail')
                }
            }
        )
    }
    //getBalance: async function (address) {
    //
    //},
}

export default Kaikas;