// kas
const kas = require('../../key/kas/kasInfo.json')
const fs = require('fs')
const accessKeyId = kas.accessKeyId;
const secretAccessKey = kas.secretAccessKey;
const option = {
    headers: [
        { name: 'Authorization', value: 'Basic ' + Buffer.from(accessKeyId + ':' + secretAccessKey).toString('base64') },
        { name: 'x-chain-id', value: '8217' },
    ]
}

// caver-js
// const Caver = require('caver-js');

// // httpProvider
// const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))

const caver = require('../klaytn/caver_http.js');

async function decodeSign(message, sign, address) {
    try {
        if (sign === 'Klip') {
            return true
        }

        const account = caver.utils.recover(message, sign);
        if (account.toUpperCase() === address.toUpperCase()) {
            return true
        }

        return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = decodeSign;