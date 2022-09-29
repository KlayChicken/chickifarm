const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get
router.post("/getLove", async (req, res) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT COUNT(fromAddress) as cnt FROM love_neighbor WHERE (toAddress=? AND love=1)", [req.body.toAddress]
        )
        const [row2, fields2] = await connection.query(
            "SELECT * FROM love_neighbor WHERE fromAddress=? AND toAddress=?", [req.body.fromAddress, req.body.toAddress]
        )
        if (row2.length < 1) {
            res.send({ loves: row1[0].cnt, love: 0 });
        } else {
            res.send({ loves: row1[0].cnt, love: row2[0].love });
        }
    } catch (err) {
        console.log(err)
    }
});

// create & update
router.post("/updateLove", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM love_neighbor WHERE fromAddress=? AND toAddress=?", [req.body.fromAddress, req.body.toAddress])
        if (row.length < 1) {
            const result = await connection.query(
                "INSERT INTO love_neighbor(fromAddress,toAddress,love,neighbor) VALUES(?,?,1,0)", [req.body.fromAddress, req.body.toAddress])

            res.send({ msg: "생성완료" })
            return;
        }

        if (Number(req.body.love) === 1) {
            const [row2, fields2] = await connection.query(
                "UPDATE love_neighbor SET love=?,loveTime=NOW() WHERE fromAddress=? AND toAddress=?", [0, req.body.fromAddress, req.body.toAddress]
            )
        } else {
            const [row2, fields2] = await connection.query(
                "UPDATE love_neighbor SET love=?,loveTime=NOW() WHERE fromAddress=? AND toAddress=?", [1, req.body.fromAddress, req.body.toAddress]
            )
        }

        res.send({ msg: "변경완료" })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;