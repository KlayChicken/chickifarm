const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const caver = require('../klaytn/caver_http.js');
const contract = require("../klaytn/contract.js");

// utils
const superSync = require('../utils/superSync.js');

// contract
const miningContract = new caver.contract(contract.mining.abi, contract.mining.address);

// favorite
router.post("/getSuperList", async (req, res) => {
    try {
        const [row, fields] = await connection.query("SELECT chickiz_id FROM super_chickiz")

        const list = [];
        row.map((x) => {
            list.push(Number(x.chickiz_id));
        })
        list.sort((a, b) => a - b)
        res.send({ list: list })
    } catch (err) {
        console.error(err)
    }
});

//  create
router.post("/makeSuperRequest", async (req, res) => {
    try {
        const id = Number(req.body.id);
        const info = await miningContract.call("chickizInfo", id);
        let result;
        if (Number(info._cp) > 2) {
            result = await superSync.super_image_change(id)

            if (result === 'error') {
                res.send({ msg: '오류가 발생되었습니다.' })
            }

            res.send({ msg: '슈퍼치키즈 변신 완료' })
        } else {
            res.send({ msg: '슈퍼 치키즈가 아닙니다.' })
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;