import caver from './CaverChrome';
import dynamic from 'next/dynamic';

// contract abi
const chickiz = require('../../src/data/contract/Chickiz.json');
const ornament = require('../../src/data/contract/Ornament.json')
const sign = require('../../src/data/contract/Sign.json')
const v1bone = require('../../src/data/contract/KlayChicken.json');
const v1sunsal = require('../../src/data/contract/KlayChickenSunsal.json');

// contract address
const chickizAddress = "0x56eE689E3BBbafee554618fD25754Eca6950e97E"
const ornamentAddress = "0x4e16E2567dD332d4c44474F8B8d3130b5c311Cf7";
const signAddress = "0x45712F8889d64284924A11d9c62F030b1c7aF8fC";
const v1boneAddress = "0xe298c5e48d488d266c986b408a27ee924331bccc";
const v1sunsalAddress = "0x715c9b59670b54a54aeedb5ed752f6d15ad79261";

// caver contract

let chickizContract;
let ornamentContract;
let signContract;
let v1boneContract;
let v1sunsalContract;

if (caver !== undefined) {
    chickizContract = new caver.klay.Contract(chickiz.abi, chickizAddress);
    ornamentContract = new caver.klay.Contract(ornament.abi, ornamentAddress);
    signContract = new caver.klay.Contract(sign.abi, signAddress);
    v1boneContract = new caver.klay.Contract(v1bone.abi, v1boneAddress);
    v1sunsalContract = new caver.klay.Contract(v1sunsal.abi, v1sunsalAddress);
} else {
    chickizContract = dynamic(() => new caver.klay.Contract(chickiz.abi, chickizAddress), { ssr: false });
    ornamentContract = dynamic(() => new caver.klay.Contract(ornament.abi, ornamentAddress), { ssr: false });
    signContract = dynamic(() => new caver.klay.Contract(sign.abi, signAddress), { ssr: false });
    v1boneContract = dynamic(() => new caver.klay.Contract(v1bone.abi, v1boneAddress), { ssr: false });
    v1sunsalContract = dynamic(() => new caver.klay.Contract(v1sunsal.abi, v1sunsalAddress), { ssr: false });
    //console.log('err at contract')
}

//const chickizContract = new caver.klay.Contract(chickiz.abi, chickizAddress);
//const ornamentContract = new caver.klay.Contract(ornament.abi, ornamentAddress);
//const signContract = new caver.klay.Contract(sign.abi, signAddress);
//const v1boneContract = new caver.klay.Contract(v1bone.abi, v1boneAddress);
//const v1sunsalContract = new caver.klay.Contract(v1sunsal.abi, v1sunsalAddress);

//const chickizContract = dynamic(() => new caver.klay.Contract(chickiz.abi, chickizAddress), { ssr: false });
//const ornamentContract = dynamic(() => new caver.klay.Contract(ornament.abi, ornamentAddress), { ssr: false });
//const signContract = dynamic(() => new caver.klay.Contract(sign.abi, signAddress), { ssr: false });
//const v1boneContract = dynamic(() => new caver.klay.Contract(v1bone.abi, v1boneAddress), { ssr: false });
//const v1sunsalContract = dynamic(() => new caver.klay.Contract(v1sunsal.abi, v1sunsalAddress), { ssr: false });

// export
const contract = {
    chickiz: chickizContract,
    ornament: ornamentContract,
    sign: signContract,
    v1bone: v1boneContract,
    v1sunsal: v1sunsalContract,
}

export default contract;