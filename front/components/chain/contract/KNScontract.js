import caver from '../CaverChrome';
import Wallet from '../wallet/Wallet';
import Kaikas from '../wallet/Kaikas';
import Klip from '../wallet/Klip';

const REVERSE_RECORDS_ADDRESS = "0x87f4483E4157a6592dd1d1546f145B5EE22c790a";
const REVERSE_RECORDS_ABI = [
    {
        type: "function",
        name: "getName",
        stateMutability: "view",
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
    },
];

class KNScontract {
    constructor() {
        this.address = REVERSE_RECORDS_ADDRESS;
        this.contract = new caver.klay.Contract(REVERSE_RECORDS_ABI, REVERSE_RECORDS_ADDRESS);
    }

    async getDomain(address) {
        return (await this.contract.methods.getName(address).call())
    }

}

export default KNScontract;