const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const caver = require('../klaytn/caver_http.js');
const contract = require("../klaytn/contract.js");

// utils
const raffleSync = require('../utils/raffleSync.js');

// contract
const raffleContract = new caver.contract(contract.raffle.abi, contract.raffle.address);

// favorite

router.post("/updateFavorite", async (req, res) => {
    try {
        let msg = ""
        const [row, fields] = await connection.query(
            `SELECT * FROM raffle_favorite WHERE raffle_id=? AND user_id=?`,
            [req.body.raffleId, req.body.userId])

        if (row.length < 1) {
            const [row1, fields1] = await connection.query(
                `INSERT INTO raffle_favorite(raffle_id, user_id) VALUES(?,?)`,
                [req.body.raffleId, req.body.userId])
            msg = "찜 목록에 추가 되었습니다."
        } else {
            const [row2, fields2] = await connection.query(
                `DELETE FROM raffle_favorite WHERE raffle_id=? AND user_id=?`,
                [req.body.raffleId, req.body.userId])
            msg = "찜 목록에서 삭제 되었습니다."
        }

        res.send({ msg: msg })
    } catch (err) {
        console.error(err)
    }
});

router.post("/getFavorite", async (req, res) => {
    try {
        let query0 = `SELECT * FROM raffle_favorite WHERE raffle_id=? AND user_id=?`;

        const [row, fields] = await connection.query(
            query0,
            [req.body.raffleId, req.body.userId])

        if (row.length > 0) {
            res.send({ favorite: 1 })
        } else {
            res.send({ favorite: 0 })
        }
    } catch (err) {
        console.error(err)
    }
});

//  create
router.post("/createRaffle", async (req, res) => {
    try {
        const totalRaffle_chain = Number(await raffleContract.call("totalRaffles"));
        const [row1, fields1] = await connection.query(
            "SELECT COUNT(id) AS cnt FROM raffle");
        const totalRaffle_db = Number(row1[0].cnt);

        if (totalRaffle_chain === totalRaffle_db) {
            res.send({ msg: '이미 저장된 래플' })
            return
        }

        for (let i = totalRaffle_db; i < totalRaffle_chain; i++) {
            await raffleSync.raffle_sync(i);
            console.log(`raffle${i} created`);
        }

        res.send({ msg: '래플 생성 완료' })
    } catch (err) {
        console.error(err);
    }
});

router.post("/buyTicket", async (req, res) => {
    try {
        await raffleSync.ticket_sync(req.body.raffleId, req.body.buyer);

        res.send({ msg: "티켓 구매를 완료하였습니다." })
    } catch (err) {
        console.log(err)
    }
});

// get
router.post('/getSingleRaffle', async (req, res) => {
    try {
        const [row, field] = await connection.query(
            `SELECT * FROM raffle_view WHERE id=?`, [req.body.raffleId]
        )

        res.send({ raffleDetail: row[0] })
    } catch (err) {
        console.error(err);
    }
});

router.post("/getBuyerList", async (req, res) => {
    try {
        if (req.body.cursor === '') {
            req.body.cursor = '99999999';
        }

        const [row, fields] = await connection.query(
            `SELECT COUNT(*) as cnt FROM raffle_buyer WHERE raffle_id=?`,
            [req.body.raffleId])

        const [row1, fields1] = await connection.query(
            `SELECT t1.*,CONCAT(LPAD(t1.buyQuan,3,'0'),LPAD(t1.id,5,'0')) AS 'cursor',t2.name
                FROM raffle_buyer t1
                LEFT JOIN user t2
                ON t1.buyer = t2.address
                WHERE t1.raffle_id = ? AND CONCAT(LPAD(t1.buyQuan,3,'0'),LPAD(t1.id,5,'0'))<?
                ORDER BY t1.buyQuan DESC, t1.id DESC
                LIMIT 12`,
            [req.body.raffleId, req.body.cursor])

        let cursor;
        if (row1.length < 1) {
            cursor = '';
        } else {
            cursor = row1[row1.length - 1].cursor;
        }

        res.send({ buyQuan: row[0].cnt, buyerList: row1, cursor: cursor })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getRaffleList", async (req, res) => {
    try {

        //const query0 =
        //    `SELECT COUNT(*) AS cnt
        //    FROM raffle_view
        //    WHERE (collection LIKE ? OR id LIKE ?)`; // COUNT

        let query1; // 부분 읽기
        let query2; // raffleStatus
        let query2_1 = ''; // collection
        let query3; // ORDER
        const query4 = " LIMIT 12"

        if (req.body.cursor === '') {
            req.body.cursor = '9999999999999999999'
        }

        switch (Number(req.body.sortWay)) {
            case 0:
                query1 =
                    `SELECT *, id AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?) AND id < ?`

                query3 = ` ORDER BY id DESC`
                break;
            case 1:
                query1 =
                    `SELECT *, CONCAT(POW(10,10)-UNIX_TIMESTAMP(endTime), LPAD(id, 8, '0')) AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?)
                            AND CONCAT(POW(10,10)-UNIX_TIMESTAMP(endTime), LPAD(id, 8, '0')) < ?`

                query3 = ` ORDER BY endTime ASC, id DESC`
                break;
            case 2:
                query1 =
                    `SELECT *, CONCAT(LPAD(POW(10, 10) - (ticketQuan-ticketSell + 1), 10, '0'), LPAD(id, 8, '0')) AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?)
                            AND CONCAT(LPAD(POW(10, 10) - (ticketQuan-ticketSell + 1), 10, '0'), LPAD(id, 8, '0')) < ?
                `

                query3 = ` ORDER BY (ticketQuan-ticketSell) ASC, id DESC`
                break;
            case 3:
                query1 =
                    `SELECT *, CONCAT(LPAD(POW(10, 13) - ticketPrice, 13, '0'), LPAD(id, 5, '0')) AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?)
                            AND CONCAT(LPAD(POW(10, 13) - ticketPrice, 13, '0'), LPAD(id, 5, '0')) < ?`

                query3 = ` ORDER BY ticketPrice ASC, id DESC`
                break;
            case 4:
                query1 =
                    `SELECT *, CONCAT(LPAD(ticketPrice, 13, '0'), LPAD(id, 5, '0')) AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?)
                            AND CONCAT(LPAD(ticketPrice, 13, '0'), LPAD(id, 5, '0')) < ?`

                query3 = ` ORDER BY ticketPrice DESC, id DESC`
                break;
            default:
                query1 =
                    `SELECT *, id AS 'cursor'
                        FROM raffle_view
                        WHERE (collection LIKE ? OR id LIKE ?) AND id < ?`

                query3 = ` ORDER BY id DESC`
        }

        if (req.body.sortCollection !== '') {
            query2_1 = ` AND collection = '${req.body.sortCollection}'`
        }

        switch (Number(req.body.sortStatus)) {
            case 0:
                query2 = ``;
                break;
            case 1:
                query2 = ` AND raffleStatus IN (0,2)`;
                break;
            case 2:
                query2 = ` AND raffleStatus IN (1,3)`;
                break;
            default:
                query2 = ` AND raffleStatus IN (0,2)`;
        }

        if (Number(req.body.sortWay) === 1) {
            query2 = ` AND raffleStatus IN (0,2)`;
        }

        const [row1, fields1] = await connection.query(
            query1 + query2_1 + query2 + query3 + query4,
            [req.body.searchWord, req.body.searchWord, req.body.cursor]
        )

        let cursor;
        if (row1.length < 1) {
            cursor = '';
        } else {
            cursor = row1[row1.length - 1].cursor;
        }

        res.send({ cursor: cursor, raffleList: row1 })

    } catch (err) {
        console.log(err)
    }
});

// myRaffle

router.post("/getRaffleList_buy", async (req, res) => {
    try {

        if (req.body.cursor === '') {
            req.body.cursor = 999999999
        }

        let query;

        switch (Number(req.body.sort)) {
            case 0:
                query = `SELECT t1.*, t2.*, t2.id AS 'cursor'
                            FROM raffle_buyer t1
                            JOIN raffle_view t2
                            ON t1.raffle_id = t2.id
                            WHERE t2.raffleStatus IN (0,2) AND t1.raffle_id<? AND t1.buyer = ?
                            ORDER BY t2.id DESC
                            LIMIT 12`
                break;
            case 1:
                query = `SELECT t1.*, t2.*, t2.id AS 'cursor'
                            FROM raffle_buyer t1
                            JOIN raffle_view t2
                            ON t1.raffle_id = t2.id
                            WHERE t2.raffleStatus IN (1,3) AND t1.raffle_id<? AND t1.buyer = ?
                            ORDER BY t2.id DESC
                            LIMIT 12`
                break;
            case 2:
                query = `SELECT *, id AS 'cursor'
                            FROM raffle_view
                            WHERE id<? AND winner = ?
                            ORDER BY id DESC
                            LIMIT 12`
                break;
            default:
                query = `SELECT t1.*, t2.*, t2.id AS 'cursor'
                            FROM raffle_buyer t1
                            JOIN raffle_view t2
                            ON t1.raffle_id = t2.id
                            WHERE t2.raffleStatus IN (0,2) AND t1.raffle_id<? AND t1.buyer = ?
                            ORDER BY t2.id DESC
                            LIMIT 12`
        }

        const [row1, field1] = await connection.query(
            query,
            [req.body.cursor, req.body.account]
        )

        let cursor;
        if (row1.length < 1) {
            cursor = '';
        } else {
            cursor = row1[row1.length - 1].cursor;
        }

        res.send({ cursor: cursor, raffleList: row1 })

    } catch (err) {
        console.log(err)
    }
});

router.post("/getRaffleList_create", async (req, res) => {
    try {

        if (req.body.cursor === '') {
            req.body.cursor = 999999999
        }

        let query;

        switch (Number(req.body.sort)) {
            case 0:
                query = `SELECT *,id AS 'cursor'
                            FROM raffle_view
                            WHERE raffleStatus IN (0,2) AND id<? AND raffler = ?
                            ORDER BY id DESC
                            LIMIT 12`
                break;
            case 1:
                query = `SELECT *,id AS 'cursor'
                            FROM raffle_view
                            WHERE raffleStatus IN (1,3) AND id<? AND raffler = ?
                            ORDER BY id DESC
                            LIMIT 12`
                break;
            default:
                query = `SELECT *,id AS 'cursor'
                            FROM raffle_view
                            WHERE raffleStatus IN (0,2) AND id<? AND raffler = ?
                            ORDER BY id DESC
                            LIMIT 12`
        }

        const [row1, field1] = await connection.query(
            query,
            [req.body.cursor, req.body.account]
        )

        let cursor;
        if (row1.length < 1) {
            cursor = '';
        } else {
            cursor = row1[row1.length - 1].cursor;
        }

        res.send({ cursor: cursor, raffleList: row1 })

    } catch (err) {
        console.log(err)
    }
});

router.post("/getRaffleList_favorite", async (req, res) => {
    try {

        if (req.body.cursor === '') {
            req.body.cursor = 999999999
        }

        let query;

        switch (Number(req.body.sort)) {
            case 0:
                query = `SELECT t1.*,t1.id AS 'cursor'
                            FROM raffle_view t1
                            JOIN raffle_favorite t2
                            ON t1.id = t2.raffle_id
                            WHERE raffleStatus IN (0,2) AND t1.id<? AND t2.user_id = ?
                            ORDER BY t1.id DESC
                            LIMIT 12`
                break;
            case 1:
                query = `SELECT t1.*,t1.id AS 'cursor'
                            FROM raffle_view t1
                            JOIN raffle_favorite t2
                            ON t1.id = t2.raffle_id
                            WHERE raffleStatus IN (1,3) AND t1.id<? AND t2.user_id = ?
                            ORDER BY t1.id DESC
                            LIMIT 12`
                break;
            default:
                query = `SELECT t1.*,t1.id AS 'cursor'
                            FROM raffle_view t1
                            JOIN raffle_favorite t2
                            ON t1.id = t2.raffle_id
                            WHERE raffleStatus IN (0,2) AND t1.id<?
                            ORDER BY t1.id DESC
                            LIMIT 12`
        }

        const [row1, field1] = await connection.query(
            query,
            [req.body.cursor, req.body.userId]
        )

        let cursor;
        if (row1.length < 1) {
            cursor = '';
        } else {
            cursor = row1[row1.length - 1].cursor;
        }

        res.send({ cursor: cursor, raffleList: row1 })

    } catch (err) {
        console.log(err)
    }
});

module.exports = router;