const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get
router.post("/getGuestBook", async (req, res) => {
    try {
        if (req.body.searchWord === "") req.body.searchWord = "%%"

        let query0 = `SELECT COUNT(*) AS cnt FROM
                    (SELECT t1.id AS id,fromAddress, toAddress, DATE_FORMAT(writeTime,'%y-%m-%d %H:%i:%s') AS writeTime, mainText ,ROW_NUMBER() OVER(ORDER BY writeTime) AS rowNum, t2.name AS fromName, t2.repChickiz AS fromRepChickiz
                            FROM guest_book t1
                            LEFT JOIN (SELECT * FROM user) t2
                            ON (t1.fromAddress = t2.address)
                            WHERE toAddress=?
                            ORDER BY rowNum DESC) a1
                    WHERE (fromAddress LIKE ? OR fromName LIKE ?)`

        let query1 = `SELECT * FROM
                (SELECT t1.id AS id,fromAddress, toAddress, DATE_FORMAT(writeTime,'%y-%m-%d %H:%i:%s') AS writeTime, mainText ,ROW_NUMBER() OVER(ORDER BY writeTime) AS rowNum, t2.name AS fromName, t2.repChickiz AS fromRepChickiz
                    FROM guest_book t1
                    LEFT JOIN (SELECT * FROM user) t2
                    ON (t1.fromAddress = t2.address)
                    WHERE toAddress=?
                    ORDER BY rowNum DESC) a1
                WHERE (fromAddress LIKE ? OR fromName LIKE ?)`

        let query2 = " LIMIT ?,6"

        const [row1, fields1] = await connection.query(
            query0, [req.body.toAddress, req.body.searchWord, req.body.searchWord])

        const [row2, fields2] = await connection.query(
            query1 + query2, [req.body.toAddress, req.body.searchWord, req.body.searchWord, req.body.start])

        res.send({ total: row1[0].cnt, guestBook: row2 })
    } catch (err) {
        console.log(err)
    }
});

// create & update
router.post("/createGuestBook", async (req, res) => {
    try {

        const result1 = await connection.query(
            `INSERT INTO guest_book
                (fromAddress,toAddress,mainText,writeTime) 
                VALUES(?,?,?,NOW())`
            , [req.body.fromAddress, req.body.toAddress, req.body.mainText]
        )
        res.send({ msg: "방명록을 작성했습니다." })
    } catch (err) {
        console.log(err)
    }
});

router.post("/deleteGuestBook", async (req, res) => {
    try {
        const _address = req.body.address;

        const decodeOk = await decodeSign("deleteGuestBook", req.body.sign, _address);
        if (!decodeOk) {
            res.send({ msg: "서명 정보가 일치하지 않습니다." })
            return;
        }

        const [row, fields] = await connection.query(
            `SELECT * FROM guest_book
                WHERE id=?`,
            [req.body.id]
        )

        if (_address.toUpperCase() !== row[0].fromAddress.toUpperCase() && _address.toUpperCase() !== row[0].toAddress.toUpperCase()) {
            res.send({ msg: "삭제 권한이 없습니다." });
            return;
        }

        const result1 = await connection.query(
            `DELETE FROM guest_book WHERE id=?`,
            [req.body.id]
        )

        res.send({ msg: "방명록을 삭제했습니다." })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;