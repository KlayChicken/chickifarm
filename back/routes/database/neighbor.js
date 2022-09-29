const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get
router.post("/isNeighbor", async (req, res) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT neighbor FROM love_neighbor WHERE (fromAddress=? AND toAddress=?)",
            [req.body.fromAddress, req.body.toAddress]
        )
        if (row1.length < 1) {
            res.send({ isNeighbor: 0 })
        } else {
            res.send({ isNeighbor: row1[0].neighbor });
        }
    } catch (err) {
        console.log(err)
    }
});

router.post("/getFollowing", async (req, res) => {
    try {
        // followingNum
        let query1 = "SELECT COUNT(*) as cnt FROM love_neighbor WHERE (fromAddress=? AND neighbor=1)"

        // followingArray (첫번째 ? => 나, 두번째 ? => 그사람)
        let query2 =
            `SELECT fromAddress, toAddress, neighbor, IFNULL(iFollow,0) AS iFollow, name, repChickiz, t2.address AS address
                FROM love_neighbor t1
                JOIN (SELECT address, name, repChickiz FROM user) t2
                ON (t2.address = t1.toAddress)
                LEFT JOIN (SELECT fromAddress AS fA, toAddress AS tA, neighbor AS iFollow FROM love_neighbor) t3
                ON (t1.toAddress=t3.tA AND ? = t3.fA)
                WHERE t1.fromAddress=? AND neighbor=1
                ORDER BY repChickiz DESC`

        // followingArray isUser가 아닐 때
        let query2_1 =
            `SELECT fromAddress, toAddress, neighbor, name, repChickiz, t2.address AS address
                FROM love_neighbor t1
                JOIN (SELECT address, name, repChickiz FROM user) t2
                ON (t2.address = t1.toAddress)
                WHERE fromAddress=? AND neighbor=1
                ORDER BY repChickiz DESC`

        // 15개씩
        let query3 = " LIMIT ?,15"

        const [row1, fields1] = await connection.query(
            query1, [req.body.targetAddress])

        let row2;
        let fields2;

        if (req.body.myAddress !== null) {
            const [_row2, _fields2] = await connection.query(
                query2 + query3, [req.body.myAddress, req.body.targetAddress, req.body.start])

            row2 = _row2;
            fields2 = _fields2;
        } else {
            const [_row2, _fields2] = await connection.query(
                query2_1 + query3, [req.body.targetAddress, req.body.start])

            row2 = _row2;
            fields2 = _fields2;
        }

        res.send({ followingNum: row1[0].cnt, followingArray: row2 });
    } catch (err) {
        console.log(err)
    }
});

router.post("/getFollowers", async (req, res) => {
    try {
        // followersNum
        let query1 = "SELECT COUNT(*) as cnt FROM love_neighbor WHERE (toAddress=? AND neighbor=1)"

        // followersArray (첫번째 ? => 나, 두번째 ? => 그사람)
        let query2 =
            `SELECT fromAddress, toAddress, neighbor, IFNULL(iFollow,0) AS iFollow, name, repChickiz, t2.address AS address
                FROM love_neighbor t1
                JOIN (SELECT address, name, repChickiz FROM user) t2
                ON (t2.address = t1.fromAddress)
                LEFT JOIN (SELECT fromAddress AS fA, toAddress AS tA, neighbor AS iFollow FROM love_neighbor) t3
                ON (t1.fromAddress=t3.tA AND ? = t3.fA)
                WHERE t1.toAddress=? AND neighbor=1
                ORDER BY repChickiz DESC`

        // followersArray isUser가 아닐 때
        let query2_1 =
            `SELECT fromAddress, toAddress, neighbor, name, repChickiz, t2.address AS address
                FROM love_neighbor t1
                JOIN (SELECT address, name, repChickiz FROM user) t2
                ON (t2.address = t1.fromAddress)
                WHERE toAddress=? AND neighbor=1
                ORDER BY repChickiz DESC`

        // 15개씩
        let query3 = " LIMIT ?,15"

        const [row1, fields1] = await connection.query(
            query1, [req.body.targetAddress])

        let row2;
        let fields2;

        if (req.body.myAddress !== null) {
            const [_row2, _fields2] = await connection.query(
                query2 + query3, [req.body.myAddress, req.body.targetAddress, req.body.start])

            row2 = _row2;
            fields2 = _fields2;
        } else {
            const [_row2, _fields2] = await connection.query(
                query2_1 + query3, [req.body.targetAddress, req.body.start])

            row2 = _row2;
            fields2 = _fields2;
        }

        res.send({ followersNum: row1[0].cnt, followersArray: row2 });
    } catch (err) {
        console.log(err)
    }
});

// create & update
router.post("/updateNeighbor", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM love_neighbor WHERE fromAddress=? AND toAddress=?", [req.body.fromAddress, req.body.toAddress])
        if (row.length < 1) {
            const result = await connection.query(
                "INSERT INTO love_neighbor(fromAddress,toAddress,love,neighbor) VALUES(?,?,0,1)", [req.body.fromAddress, req.body.toAddress])

            res.send({ msg: "생성완료" })
            return;
        }

        if (Number(req.body.neighborBool) === 1) {
            const [row2, fields2] = await connection.query(
                "UPDATE love_neighbor SET neighbor=?,neighborTime=NOW() WHERE fromAddress=? AND toAddress=?", [0, req.body.fromAddress, req.body.toAddress]
            )
        } else {
            const [row2, fields2] = await connection.query(
                "UPDATE love_neighbor SET neighbor=?,neighborTime=NOW() WHERE fromAddress=? AND toAddress=?", [1, req.body.fromAddress, req.body.toAddress]
            )
        }

        res.send({ msg: "변경완료" })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;