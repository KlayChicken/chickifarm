const fs = require('fs')
const kas = require('../../key/kas/kasInfo.json')
const accessKeyId = kas.accessKeyId;
const secretAccessKey = kas.secretAccessKey;
const option = {
    headers: [
        { name: 'Authorization', value: 'Basic ' + Buffer.from(accessKeyId + ':' + secretAccessKey).toString('base64') },
        { name: 'x-chain-id', value: '8217' },
    ]
}
const blockPI = require('../../key/blockPI/blockPIInfo.json')

// caver-js
const Caver = require('caver-js');

// httpProvider
// const caver_http = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
const caver_http = new Caver('https://klaytn.testnet.blockpi.net/v1/rpc/' + blockPI.key)

module.exports = caver_http;