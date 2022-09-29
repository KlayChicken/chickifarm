const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

// get
router.post("/getChickizList", async (req, res) => {
    try {
        const _chickizArray = [];
        const [row, fields] = await connection.query(
            "SELECT id FROM chickiz_position WHERE owner=?", [req.body.address])

        await row.map((a) => (_chickizArray.push(a.id)))
        res.send({ chickizArray: _chickizArray })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;