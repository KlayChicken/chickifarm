const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get
router.post("/getAnnouncement", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM announce ORDER BY created DESC")

        res.send({ announce: row })
    } catch (err) {
        console.error(err);
    }
})

router.post("/getNotification_guestBook", async (req, res) => {
    try {

        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) as cnt
            FROM guest_book
            WHERE toAddress = ?`
            , [req.body.account]
        )

        const [row1, field1] = await connection.query(
            `SELECT t1.id, t1.fromAddress, t3.repChickiz, t3.name, mainText, writetime
            FROM guest_book t1
            LEFT JOIN user t2
            ON toAddress = t2.address
            LEFT JOIN user t3
            ON fromAddress = t3.address
            WHERE toAddress = ?
            ORDER BY writetime DESC
            LIMIT ?,12`
            , [req.body.account, req.body.start]
        )

        res.send({ guestBook: row1, total: row0[0].cnt })
    } catch (err) {
        console.error(err);
    }
});

router.post("/getNotification_neighbor", async (req, res) => {
    try {

        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) as cnt
            FROM love_neighbor
            WHERE toAddress = ? AND neighbor=1 AND neighborTime>='2022-05-09 15:01:00'`
            , [req.body.account]
        )

        const [row1, field1] = await connection.query(
            `SELECT t1.fromAddress, t3.repChickiz, t3.name, neighborTime
            FROM love_neighbor t1
            LEFT JOIN user t2
            ON toAddress = t2.address
            LEFT JOIN user t3
            ON fromAddress = t3.address
            WHERE toAddress = ? AND neighbor=1 AND neighborTime>='2022-05-09 15:01:00'
            ORDER BY neighborTime DESC
            LIMIT ?,12`
            , [req.body.account, req.body.start]
        )

        res.send({ neighbor: row1, total: row0[0].cnt })
    } catch (err) {
        console.error(err);
    }
});

router.post("/getNotification_love", async (req, res) => {
    try {

        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) as cnt
            FROM love_neighbor
            WHERE toAddress = ? AND love=1 AND loveTime>='2022-05-09 15:01:00'`
            , [req.body.account]
        )

        const [row1, field1] = await connection.query(
            `SELECT t1.fromAddress, t3.repChickiz, t3.name, loveTime
            FROM love_neighbor t1
            LEFT JOIN user t2
            ON toAddress = t2.address
            LEFT JOIN user t3
            ON fromAddress = t3.address
            WHERE toAddress = ? AND love=1 AND loveTime>='2022-05-09 15:01:00'
            ORDER BY loveTime DESC
            LIMIT ?,12`
            , [req.body.account, req.body.start]
        )

        res.send({ love: row1, total: row0[0].cnt })
    } catch (err) {
        console.error(err);
    }
});

router.post("/getNotificationNum", async (req, res) => {
    try {
        const [row, field] = await connection.query(
            `SELECT lastCheck FROM user WHERE address=?`
            , [req.body.account]
        )

        const [guestNum, neighborNum, loveNum, announceNum] =
            await Promise.all([
                getNotiGuestNum(req.body.account, row[0].lastCheck),
                getNotiNeighborNum(req.body.account, row[0].lastCheck),
                getNotiLoveNum(req.body.account, row[0].lastCheck),
                getNotiAnnounceNum(row[0].lastCheck)
            ]);

        res.send({ guestNum: guestNum, neighborNum: neighborNum, loveNum: loveNum, announceNum: announceNum })
    } catch (err) {
        console.error(err);
    }
});

async function getNotiGuestNum(account, time) {
    try {
        const [row, field] = await connection.query(
            `SELECT COUNT(*) AS cnt
            FROM guest_book 
            WHERE toAddress = ? AND writetime>=?`
            , [account, time]
        )

        return row[0].cnt
    } catch (err) {
        console.error(err);
    }
}

async function getNotiNeighborNum(account, time) {
    try {
        const [row, field] = await connection.query(
            `SELECT COUNT(*) AS cnt
            FROM love_neighbor 
            WHERE toAddress =? AND neighbor=1 AND neighborTime>=?`
            , [account, time]
        )

        return row[0].cnt
    } catch (err) {
        console.error(err);
    }
}

async function getNotiLoveNum(account, time) {
    try {
        const [row, field] = await connection.query(
            `SELECT COUNT(*) AS cnt
            FROM love_neighbor 
            WHERE toAddress =? AND love=1 AND loveTime>=?`
            , [account, time]
        )

        return row[0].cnt
    } catch (err) {
        console.error(err);
    }
}

async function getNotiAnnounceNum(time) {
    try {
        const [row, field] = await connection.query(
            `SELECT COUNT(*) AS cnt
            FROM announce
            WHERE created>=?;`
            , [time]
        )

        return row[0].cnt
    } catch (err) {
        console.error(err);
    }
}

module.exports = router;