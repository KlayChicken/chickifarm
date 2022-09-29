const KIP17FULL = require('../../contract/KIP17Full.json')
const chickiz = require('../../contract/Chickiz.json');
const ornament = require('../../contract/Ornament.json')
const sign = require('../../contract/Sign.json')
const v1bone = require('../../contract/KlayChicken.json');
const v1sunsal = require('../../contract/KlayChickenSunsal.json');
const raffle = require('../../contract/Raffle.json');
const mining = require('../../contract/Chick_Mining.json');

const ornamentAddress = "0x4e16E2567dD332d4c44474F8B8d3130b5c311Cf7";
const signAddress = "0x45712F8889d64284924A11d9c62F030b1c7aF8fC";
const chickizAddress = "0x56eE689E3BBbafee554618fD25754Eca6950e97E"
const v1boneAddress = "0xe298c5e48d488d266c986b408a27ee924331bccc";
const v1sunsalAddress = "0x715c9b59670b54a54aeedb5ed752f6d15ad79261";
const raffleAddress = "0x20cd4c4295CA0F88e82A7076D81c0FEffED23927";
const miningAddress = "0xeB624Fa3930BB4368FC5071CaDAdD182f498e25D";

// export
const contract = {
    KIP17FULL: {
        abi: KIP17FULL.abi
    },
    chickiz: {
        abi: chickiz.abi,
        address: chickizAddress
    },
    ornament: {
        abi: ornament.abi,
        address: ornamentAddress
    },
    sign: {
        abi: sign.abi,
        address: signAddress
    },
    v1bone: {
        abi: v1bone.abi,
        address: v1boneAddress
    },
    v1sunsal: {
        abi: v1sunsal.abi,
        address: v1sunsalAddress
    },
    raffle: {
        abi: raffle.abi,
        address: raffleAddress
    },
    mining: {
        abi: mining.abi,
        address: miningAddress
    }
}

module.exports = contract;