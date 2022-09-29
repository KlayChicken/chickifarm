import Kaikas from "./Kaikas"
import Klip from "./Klip"

const Wallet = {
    getWalletKind: function () {
        return sessionStorage.getItem('wallet_kind');
    },
    login: async function (klipPopOn, klipPopOff) {
        const walletKind = this.getWalletKind();
        let address;

        if (walletKind === 'Kaikas' && Kaikas.installed) {
            address = await Kaikas.connect();
        } else if (walletKind === 'Klip') {
            address = await Klip.connect(klipPopOn, klipPopOff);
        }

        if (address === undefined) {
            address = "";
        }

        return address
    },
    logout: function () {
        sessionStorage.setItem('wallet_kind', 'none')
        window.location.reload();
    },
    loadNetwork: async function () {
        let network;

        if (Kaikas.installed) {
            network = Kaikas.getNetwork();
        } else {
            network = 8217;
        }

        return network;
    },
    signMessage: async function (msg) {
        const walletKind = this.getWalletKind();
        let sign;
        if (walletKind === 'Kaikas' && Kaikas.installed) {
            sign = await Kaikas.signMessage(msg);
        } else if (walletKind === 'Klip') {
            sign = 'Klip'
        }

        return sign
    },
    addToken: async function () {
        const walletKind = this.getWalletKind();
        if (walletKind === 'Kaikas' && Kaikas.installed) {
            await Kaikas.addToken();
        } else if (walletKind === 'Klip') {
            window.alert('클립 토큰 추가 예정')
        }
    }
}

export default Wallet;