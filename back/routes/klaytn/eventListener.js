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
const caver = require('./caver_http.js');
const CaverJS = require('caver-js');

// httpProvider
// const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))

// webSocketProvider
const caver_ws = new CaverJS(new CaverJS.providers.WebsocketProvider("wss://" + accessKeyId + ":" + secretAccessKey +
    "@node-api.klaytnapi.com/v1/ws/open?chain-id=8217", { reconnect: { auto: true } }))

// contract
const contract = require("./contract.js")
const chickizContract = new caver.contract(contract.chickiz.abi, contract.chickiz.address);
const chickizContract_ws = new caver_ws.contract(contract.chickiz.abi, contract.chickiz.address);
const signContract = new caver_ws.contract(contract.sign.abi, contract.sign.address);
const ornamentContract = new caver_ws.contract(contract.ornament.abi, contract.ornament.address);

const raffleContract = new caver_ws.contract(contract.raffle.abi, contract.raffle.address);
const miningContract = new caver.contract(contract.mining.abi, contract.mining.address);

// database
const connection = require('../database/dbSetup.js');
const raffleSync = require('../utils/raffleSync.js');
const superSync = require('../utils/superSync.js');

// function

async function checkSuperSync() {
    try {
        const currentBlock = await caver.klay.getBlockNumber();
        const events = await miningContract.getPastEvents('SuperChickiz', { fromBlock: currentBlock - 600, toBlock: 'latest' }) // 10분간의 트랜잭션 내역
        console.log(events.length)
        for (let i = 0; i < events.length; i++) {
            const { id, chef } = events[i].returnValues;
            const result = await superSync.super_image_change(id);
            if (result === 'done') {
                console.log(`Super #${id} was missing. now added.`)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

const superCount = setInterval(() => {
    checkSuperSync();
}, 270307) // 4분 30초마다


async function checkRaffleSync() {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT COUNT(id) AS cnt FROM raffle");
        const totalRaffle_db = Number(row1[0].cnt);
        const totalRaffle_chain = Number(await raffleContract.call('totalRaffles'));

        if (totalRaffle_chain === totalRaffle_db) {
            //console.log('raffle_sync fine')
            return
        }

        for (let i = totalRaffle_db; i < totalRaffle_chain; i++) {
            await raffleSync.raffle_sync(i);
            console.log(`raffle${i} created`)
        }
    } catch (err) {
        console.error(err)
    }
}

const countdown = setInterval(() => {
    checkRaffleSync();
    //caver.klay.getBlockNumber((err, result) => {
    //    if (!err) {
    //        console.log(result);
    //    } else {
    //        console.error(err);
    //    }
    //})
}, 30000)

async function updateChickiz(_from, _to, _id) {
    try {
        await connection.query(
            `UPDATE chickiz_position SET owner=?,visible=?,x=?,y=?,zIndex=? WHERE id=?`, [_to, 0, 0, 0, 0, Number(_id)],
        )
        const [row, fields] = await connection.query(
            `SELECT repChickiz FROM user WHERE address=?`, [_from]
        )

        if (Number(row[0]?.repChickiz) === Number(_id)) {
            await connection.query(
                `UPDATE user SET repChickiz=NULL WHERE address=?`, [_from],
            )
            console.log(`${_from} repChickiz deleted.`)
        } else {
            console.log(`${_from} repChickiz is not #${_id}.`)
        }
        console.log(`Chickiz#${_id} update complete\n`)
    } catch (err) {
        console.error(err);
    }
}

async function chickizSync() {
    try {
        const currentBlock = await caver.klay.getBlockNumber();
        const events = await chickizContract.getPastEvents('Transfer', { fromBlock: currentBlock - 600, toBlock: 'latest' }) // 10분간의 트랜잭션 내역

        for (let i = 0; i < events.length; i++) {
            const { from, to, tokenId } = events[i].returnValues;
            const [row1, fields1] = await connection.query(
                "SELECT owner FROM chickiz_position WHERE id=?"
                , [tokenId]);
            if (row1[0].owner.toUpperCase() !== to.toUpperCase()) {
                console.log(`Chickiz#${tokenId} not updated (AT ${events[i].blockNumber})`)
                await updateChickiz(from, to, tokenId);
            }
        }

        console.log(`Chickiz volume traded in 10 MIN : ${events.length}`)
    } catch (err) {
        console.error(err)
    }
}

const chickizCount = setInterval(() => {
    chickizSync();
}, 240307) // 4분마다

// chickiz

const checkChickizTransfer = chickizContract_ws.events.Transfer(async function (error, result) {
    if (error) console.error(error)
    if (result === null) return;
    const tokenId = result.returnValues.tokenId;
    const fromAddress = result.returnValues.from;
    const toAddress = result.returnValues.to;

    console.log(`Chickiz#${tokenId} ... ${fromAddress} => ${toAddress}`)
    await updateChickiz(fromAddress, toAddress, tokenId)
})

// sign

const checkSignTransfer1 = signContract.events.TransferSingle(async function (error, result) {
    if (error) console.error(error)
    if (result === null) return;
    const tokenId = result.returnValues.id;
    const fromAddress = result.returnValues.from;
    const toAddress = result.returnValues.to;

    console.log(`Sign#${tokenId} ... ${fromAddress} => ${toAddress}`)

    const balance = await signContract.call("balanceOf", fromAddress, tokenId)

    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM user WHERE address=?", [fromAddress])
        if (row.length < 1) {
            console.log(`${fromAddress} is not farmer`)
        } else {
            if (row[0]?.farmSign === Number(tokenId)) {
                if (balance > 0) {
                    console.log(`${fromAddress} is farmer, and still has this sign.`)
                } else {
                    const resu = await connection.query(
                        `UPDATE user SET farmSign=NULL WHERE address=?`, [fromAddress],
                    )
                    console.log(resu)
                }
            } else {
                console.log(`${fromAddress} is farmer, but not use this sign.`)
            }
        }
    } catch (err) {
        console.log(err)
    }
})

const checkSignTransfer2 = signContract.events.TransferBatch(async function (error, result) {
    if (result === null) return;
    const tokenId = result.returnValues.ids[0];
    const fromAddress = result.returnValues.from;
    const toAddress = result.returnValues.to;

    console.log(`Sign#${tokenId} ... ${fromAddress} => ${toAddress}`)

    const balance = await signContract.call("balanceOf", fromAddress, tokenId)

    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM user WHERE address=?", [fromAddress])
        if (row.length < 1) {
            console.log(`${fromAddress} is not farmer`)
        } else {
            if (row[0]?.farmSign === Number(tokenId)) {
                if (balance > 0) {
                    console.log(`${fromAddress} is farmer, and still has this sign.`)
                } else {
                    const resu = await connection.query(
                        `UPDATE user SET farmSign=NULL WHERE address=?`, [fromAddress],
                    )
                    console.log(resu)
                }
            } else {
                console.log(`${fromAddress} is farmer, but not use this sign.`)
            }
        }
    } catch (err) {
        console.log(err)
    }
})

// ornament

const checkOrnamentTransfer1 = ornamentContract.events.TransferSingle(async function (error, result) {
    if (result === null) return;
    const tokenId = result.returnValues.id;
    const fromAddress = result.returnValues.from;
    const toAddress = result.returnValues.to;
    const tokenQuan = result.returnValues.value;

    console.log(`Ornament#${tokenId} ... ${fromAddress} => ${toAddress}`)

    const balance = await ornamentContract.call("balanceOf", fromAddress, tokenId)

    try {
        const [row1, fields] = await connection.query(
            "SELECT * FROM ornament_position WHERE owner=? AND tokenId=?", [fromAddress, tokenId])
        if (row1.length <= balance) {
            console.log(`${fromAddress} doesen't use this ornament or still has this ornament.`)
        } else {
            for (let i = 0; i < row1.length - balance; i++) {
                const _uniqueId = row1[i].id;
                const resu = await connection.query(
                    "DELETE FROM ornament_position WHERE id=?", [_uniqueId])
                console.log(resu)
            }
            console.log(`total ${row1.length - balance} datum deleted.`)
        }
    } catch (err) {
        console.log(err)
    }
})

const checkOrnamentTransfer2 = ornamentContract.events.TransferBatch(async function (error, result) {
    if (result === null) return;
    const tokenId = result.returnValues.ids[0];
    const fromAddress = result.returnValues.from;
    const toAddress = result.returnValues.to;
    const tokenQuan = result.returnValues.values[0];

    console.log(`Ornament#${tokenId} ... ${fromAddress} => ${toAddress}`)

    const balance = await ornamentContract.call("balanceOf", fromAddress, tokenId)

    try {
        const [row1, fields] = await connection.query(
            "SELECT * FROM ornament_position WHERE owner=? AND tokenId=?", [fromAddress, tokenId])
        if (row1.length <= balance) {
            console.log(`${fromAddress} doesen't use this ornament or still has this ornament.`)
        } else {
            for (let i = 0; i < row1.length - balance; i++) {
                const _uniqueId = row1[i].id;
                const resu = await connection.query(
                    "DELETE FROM ornament_position WHERE id=?", [_uniqueId])
                console.log(resu)
            }
            console.log(`total ${row1.length - balance} datum deleted.`)
        }
    } catch (err) {
        console.log(err)
    }
})

//event Transfer(
//    address indexed from,
//    address indexed to,
//    uint256 indexed tokenId
//);

//event TransferSingle(
//    address indexed operator,
//    address indexed from,
//    address indexed to,
//    uint256 id,
//    uint256 value
//);
//
///**
// * @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
// * transfers.
// */
//event TransferBatch(
//    address indexed operator,
//    address indexed from,
//    address indexed to,
//    uint256[] ids,
//    uint256[] values
//);






const eventList = {
    basic: countdown,
    superCount: superCount,
    chickizCount: chickizCount,
    chickiz: checkChickizTransfer,
    sign1: checkSignTransfer1,
    sign2: checkSignTransfer2,
    ornament1: checkOrnamentTransfer1,
    ornament2: checkOrnamentTransfer2
}

module.exports = eventList;