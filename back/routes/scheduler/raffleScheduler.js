const fs = require('fs');
const connection = require('../database/dbSetup');
const caver = require('../klaytn/caver_http.js');
const contract = require("../klaytn/contract.js");
const keyPw = require('../../key/keystore/keyPw.json');
const keystoreFile = require('../../key/keystore/cypress/kaikas-0x6a907aebdf55c704eeb66d732a1cf317192764aa.json');
const raffleSync = require('../utils/raffleSync.js');

const raffleContract = new caver.contract(contract.raffle.abi, contract.raffle.address);

// account
const keystore = fs.readFileSync('./key/keystore/cypress/kaikas-0x6a907aebdf55c704eeb66d732a1cf317192764aa.json', 'utf-8');
const keyring = caver.wallet.keyring.decrypt(keystore, keyPw.password);
caver.wallet.add(keyring);

// 끝나지 않은 래플에 대한 스케쥴 관리
const updateStatus = async (raffleId) => {
    try {
        const raffleStatus = Number(await raffleContract.call('raffleStatus', raffleId));

        switch (raffleStatus) {
            case 0:
                console.log(`raffle${raffleId} 아직 진행 중`);
                break;
            case 1:
                await connection.query(
                    `UPDATE raffle SET raffleStatus=1 WHERE id=?`
                    , [raffleId]
                )
                console.log(`raffle${raffleId} 종료 - 환불`);
                break;
            case 2:
                const rndNumber = Math.floor(Math.random() * 100) + 1;
                await raffleContract.send({ from: keyring.address, gas: 1500000 }, "selectWinner", raffleId, rndNumber);
                console.log(`raffle${raffleId} 추첨 트랜잭션 전송`);
                break;
            case 3:
                const result = await raffleContract.call('raffleResult', raffleId)
                await connection.query(
                    `UPDATE raffle SET raffleStatus=3,winner=?,winnerQuan=? WHERE id=?`
                    , [result.winner, Number(result.ticketQuan), raffleId]
                )
                console.log(`raffle${raffleId} 종료 - 우승자 ${result.winner}(${result.ticketQuan})`);
                break;
            default:
                console.log(`raffle${raffleId} 아직 진행 중`);
                break;
        }
    } catch (err) {
        console.error(err);
    }
}

const readRaffle = async () => {
    try {
        const [row1, field1] = await connection.query(
            `SELECT id FROM raffle WHERE raffleStatus=2`
        );

        if (row1.length < 1) {
            return
        }

        for (let i = 0; i < row1.length; i++) {
            await updateStatus(Number(row1[i].id));
        }

    } catch (err) {
        console.error(err);
    }
}

const getBuyEvent = async () => {
    try {

        const currentBlock = await caver.klay.getBlockNumber();
        const events = await raffleContract.getPastEvents('TicketBuy', { fromBlock: currentBlock - 100 })
        const events_filtered = events.map(a => {
            return {
                raffleId: a.returnValues.raffleNum,
                buyer: a.returnValues.buyer,
                ticketQuan: a.returnValues.ticketQuan,
                total: a.returnValues.ticketBalance
            }
        })

        for (let i = 0; i < events_filtered.length; i++) {
            await raffleSync.ticket_sync_db(events_filtered[i].raffleId, events_filtered[i].buyer, events_filtered[i].total)
        }

    } catch (err) {
        console.error(err);
    }
}

const checkRaffleStatus = setInterval(() => {
    try {
        readRaffle();

    } catch (err) {
        console.error(err);
    }

    //caver.klay.getBlockNumber((err, result) => {
    //    if (!err) {
    //        console.log(result);
    //    } else {
    //        console.error(err);
    //    }
    //})
}, 40000)

const checkBuyerStatus = setInterval(() => {
    try {
        getBuyEvent();
    } catch (err) {
        console.error(err);
    }

    //caver.klay.getBlockNumber((err, result) => {
    //    if (!err) {
    //        console.log(result);
    //    } else {
    //        console.error(err);
    //    }
    //})
}, 41321)

const raffleScheduler = { job1: checkRaffleStatus, job2: checkBuyerStatus }

module.exports = raffleScheduler;