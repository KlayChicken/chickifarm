const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get list
router.post("/getFarmList", async (req, res) => {
    try {
        if (req.body.searchWord === "") req.body.searchWord = "%%"

        let query0 = `SELECT COUNT(address) AS cnt
                        FROM user_join_view
                        WHERE 
                            (address LIKE ? OR NAME LIKE ?)`;

        let query1 = `SELECT * 
                        FROM user_join_view
                        WHERE 
                            (address LIKE ? OR NAME LIKE ?)`;
        let query1_1 = `${req.body.filter.chickizQuanMin !== undefined
            ? ('AND chickizQuan>=' + req.body.filter.chickizQuanMin) : ''}
                ${req.body.filter.chickizQuanMax !== undefined
                ? ('AND chickizQuan<=' + req.body.filter.chickizQuanMax) : ''}
                ${req.body.filter.farmSign !== undefined
                ? ('AND farmSign=' + req.body.filter.farmSign) : ''}`;
        let query2;
        const query2_1 = ", id"
        const query3 = " LIMIT ?,8"

        switch (Number(req.body.sortWay)) {
            case 0:
                query2 = " ORDER BY farmUpdated DESC"
                break;
            case 1:
                query2 = " ORDER BY chickizQuan DESC"
                break;
            case 2:
                query2 = " ORDER BY chickizQuan ASC"
                break;
            case 3:
                query2 = " ORDER BY farmLove DESC"
                break;
            case 4:
                query2 = " ORDER BY farmLove ASC"
                break;
            default:
                query2 = " ORDER BY farmLove DESC"
        }

        const [row1, fields1] = await connection.query(
            query0 + query1_1,
            [req.body.searchWord, req.body.searchWord])

        const [row2, fields2] = await connection.query(
            query1 + query1_1 + query2 + query2_1 + query3,
            [req.body.searchWord, req.body.searchWord, req.body.start])

        res.send({ total: row1[0].cnt, userArray: row2 })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getOnlyNeighborFarmList", async (req, res) => {
    try {
        if (req.body.searchWord === "") req.body.searchWord = "%%"

        let query0 = `SELECT COUNT(*) AS cnt
                        FROM love_neighbor t1
                        JOIN (SELECT * FROM user_join_view) t2
                        ON (t1.toAddress=t2.address)
                        WHERE fromAddress=? AND neighbor=1 
                            AND (address LIKE ? OR name LIKE ?)`;

        let query1 = `SELECT t2.*, toAddress, fromAddress ,neighbor
                        FROM love_neighbor t1
                        JOIN (SELECT * FROM user_join_view) t2
                        ON (t1.toAddress=t2.address)
                        WHERE fromAddress=? AND neighbor=1 
                            AND (address LIKE ? OR name LIKE ?)`;
        let query1_1 = `${req.body.filter.chickizQuanMin !== undefined
            ? ('AND chickizQuan>=' + req.body.filter.chickizQuanMin) : ''}
                ${req.body.filter.chickizQuanMax !== undefined
                ? ('AND chickizQuan<=' + req.body.filter.chickizQuanMax) : ''}
                ${req.body.filter.farmSign !== undefined
                ? ('AND farmSign=' + req.body.filter.farmSign) : ''}`;
        let query2;
        const query2_1 = ", id"
        const query3 = " LIMIT ?,8"

        switch (Number(req.body.sortWay)) {
            case 0:
                query2 = " ORDER BY farmUpdated DESC"
                break;
            case 1:
                query2 = " ORDER BY chickizQuan DESC"
                break;
            case 2:
                query2 = " ORDER BY chickizQuan ASC"
                break;
            case 3:
                query2 = " ORDER BY farmLove DESC"
                break;
            case 4:
                query2 = " ORDER BY farmLove ASC"
                break;
            default:
                query2 = " ORDER BY farmLove DESC"
        }

        const [row1, fields1] = await connection.query(
            query0 + query1_1,
            [req.body.myAddress, req.body.searchWord, req.body.searchWord])

        const [row2, fields2] = await connection.query(
            query1 + query1_1 + query2 + query2_1 + query3,
            [req.body.myAddress, req.body.searchWord, req.body.searchWord, req.body.start])

        res.send({ total: row1[0].cnt, userArray: row2 })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getRndFarmList", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            `SELECT * 
            FROM user_join_view
            WHERE 
                (repChickiz IS NOT NULL)
            ORDER BY 
                RAND()
                LIMIT 8;`)

        res.send({ rndArray: row })
    } catch (err) {
        console.log(err)
    }
});

// get position
router.post("/getChickizPosition", async (req, res) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT id,x,y,visible,zIndex FROM chickiz_position WHERE owner=? AND visible=1", [req.body.address]
        )

        res.send({ chickizPosition: row1 })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getOrnamentPosition", async (req, res) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT id,x,y,tokenId,zIndex FROM ornament_position WHERE owner=?", [req.body.address]
        )

        res.send({ ornamentPosition: row1 })
    } catch (err) {
        console.log(err)
    }
});

// create & update
router.post("/updateFarm", async (req, res) => {
    try {
        const decodeOk = await decodeSign("updateFarm", req.body.sign, req.body.address);
        if (!decodeOk) {
            res.send({ msg: "서명 정보가 일치하지 않습니다." })
            return;
        }

        const result1 = await connection.query(
            "DELETE FROM ornament_position WHERE owner=?",
            [req.body.address]
        )

        req.body.ornamentPosition.map(async (a) => {
            const result2 = await connection.query(
                "INSERT INTO ornament_position(owner,tokenId,x,y,zIndex) VALUES(?,?,?,?,?)",
                [req.body.address, a.tokenId, a.x, a.y, a.zIndex]
            )
        })

        req.body.chickizPosition.map(async (a) => {
            const result3 = await connection.query(
                "UPDATE chickiz_position SET x=?,y=?,visible=?,zIndex=? WHERE id=?",
                [a.x, a.y, a.visible, a.zIndex, a.id])
        })

        const result4 = await connection.query(
            "UPDATE user SET farmSkin=?,farmUpdated=NOW() WHERE address=?",
            [req.body.farmSkin, req.body.address]
        )

        res.send({ msg: "농장의 변경사항이 저장되었습니다." })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;