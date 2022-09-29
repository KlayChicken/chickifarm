const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

// db
const connection = require('../database/dbSetup.js');

// data
const NFTProjectList = require('../../data/NFTProjectList.js');

// chain
const caver = require('../klaytn/caver_http.js');
const contract = require("../klaytn/contract.js");

const raffleContract = new caver.contract(contract.raffle.abi, contract.raffle.address);


const raffle_sync = async (_raffleId) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT * FROM raffle WHERE id=?", [Number(_raffleId)])

        if (row1.length > 0) {
            return
        }

        const raffleInfo = await raffleContract.call('RaffleList', _raffleId);
        const currentBlock = await caver.klay.getBlockNumber();

        const KIP17 = new caver.contract(contract.KIP17FULL.abi, raffleInfo.nft);
        const url = await KIP17.call('tokenURI', Number(raffleInfo.nft_tokenId));

        let res;
        if (url.startsWith('ipfs')) {
            res = await axios.post(`https://ipfs.infura.io:5001/api/v0/cat?arg=${url.substring(7)}`);
        } else {
            res = await axios.get(url);
        }

        const meta = JSON.stringify(res.data)

        const collectionName = NFTProjectList.filter((project) => project.address.toUpperCase() === raffleInfo.nft.toUpperCase())[0]?.name;

        const raffle_period_calculated = Number(raffleInfo.startBlock) + Number(raffleInfo.rafflePeriod) - Number(currentBlock) - 1

        const [row2, fileds2] = await connection.query(`
        INSERT INTO raffle(id,collection,nftAddress,tokenId,nftMeta,raffler,rafflerStatus,paymentMethod,ticketPrice,ticketQuan,ticketSell,endTime,raffleStatus) 
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [Number(raffleInfo.raffleNum), collectionName,
            raffleInfo.nft, Number(raffleInfo.nft_tokenId), meta,
            raffleInfo.raffler, raffleInfo.rafflerStatus, Number(raffleInfo.paymentMethod),
            Math.ceil(caver.utils.convertFromPeb(raffleInfo.ticketPrice, 'mKLAY')), Number(raffleInfo.ticketQuan), 0,
            new Date(moment().add(raffle_period_calculated, 's')), 0]);

        const [row3, fields3] = await connection.query(`
        CREATE EVENT raffle${raffleInfo.raffleNum}
            ON SCHEDULE AT ?
            COMMENT ?
            DO
            UPDATE raffle SET raffleStatus=2 WHERE id=?`,
            [new Date(moment().add(raffle_period_calculated - 1, 's')), `raffle${raffleInfo.raffleNum}_end`, Number(raffleInfo.raffleNum)]
        )
    } catch (err) {
        console.error(err);
    }
}

const ticket_sync = async (_raffleId, _account) => {
    try {
        const soldTickets = await raffleContract.call('soldTickets', _raffleId);
        const buyHowMuch = await raffleContract.call('participants_ticket', _raffleId, _account);

        const [row1, field1] = await connection.query(
            'SELECT * FROM raffle_buyer WHERE raffle_id=? AND buyer=?',
            [_raffleId, _account]
        )

        if (row1.length < 1) {
            await connection.query(
                `INSERT INTO raffle_buyer(raffle_id,buyer,buyQuan) VALUES(?,?,?)`,
                [_raffleId, _account, buyHowMuch]
            )
        } else {
            await connection.query(
                `UPDATE raffle_buyer SET buyQuan=? WHERE raffle_id=? AND buyer=?`,
                [buyHowMuch, _raffleId, _account]
            )
        }

        await connection.query(
            `UPDATE raffle SET ticketSell=? WHERE id=?`,
            [soldTickets, _raffleId]
        )
    } catch (err) {
        console.error(err);
    }
}

const ticket_sync_db = async (_raffleId, _account, _total) => {
    try {

        const [row1, field1] = await connection.query(
            'SELECT * FROM raffle_buyer WHERE raffle_id=? AND buyer=?',
            [_raffleId, _account]
        )

        if (row1.length < 1) {
            await connection.query(
                `INSERT INTO raffle_buyer(raffle_id,buyer,buyQuan) VALUES(?,?,?)`,
                [_raffleId, _account, _total]
            )
            console.log(`raffle${_raffleId} bought by ${_account} _ missing`)
        } else {
            if (Number(row1[0].buyQuan) !== Number(_total)) {
                await connection.query(
                    `UPDATE raffle_buyer SET buyQuan=? WHERE raffle_id=? AND buyer=?`,
                    [_total, _raffleId, _account]
                )
                console.log(`raffle${_raffleId} bought by ${_account} _ missing`)
            }
        }

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    raffle_sync: raffle_sync,
    ticket_sync: ticket_sync,
    ticket_sync_db: ticket_sync_db,
}