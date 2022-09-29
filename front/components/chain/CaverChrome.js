import Caver_js from 'caver-js';
import dynamic from 'next/dynamic'

let provider;
let caver;


const accessKeyId = "KASKRH7W5MGYP45GIHV8CJUK";
const secretAccessKey = "kPTmnOespsX2CUdut_m75PvP7XPgijZvPGX-6ChQ";
const option = {
    headers: [
        { name: 'Authorization', value: 'Basic ' + Buffer.from(accessKeyId + ':' + secretAccessKey).toString('base64') },
        { name: 'x-chain-id', value: '8217' },
    ]
}

//EN 연결  

if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
    provider = window['klaytn'];
    caver = new Caver_js(provider);
} else {
    // caver = new Caver_js(new Caver_js.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
    caver = new Caver_js('https://klaytn.testnet.blockpi.net/v1/rpc/'+'key');
}

//const caver = dynamic(() => new Caver_js(window.klaytn), { ssr: false })

export default caver;