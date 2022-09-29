const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');
const decodeSign = require('../klaytn/decodeSign.js');

//get

router.post('/getJustName', async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            `SELECT name FROM user WHERE address=?`, [req.body.address]
        )
        row.length > 0 ? res.send({ userName: row[0].name }) : res.send({ userName: false })
    } catch (err) {
        console.error(err)
    }
})

router.post("/isUser", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            "SELECT id FROM user WHERE address=?", [req.body.address])
        row.length > 0 ? res.send({ isUser: true }) : res.send({ isUser: false })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getUserInfo", async (req, res) => {
    try {
        const [row, fields] = await connection.query(
            "SELECT * FROM user_join_view WHERE address=?", [req.body.address])
        res.send(row)
    } catch (err) {
        console.log(err)
    }
});

// create & update
router.post("/createUser", async (req, res) => {
    try {
        const decodeOk = await decodeSign("createUser", req.body.sign, req.body.address);
        if (!decodeOk) {
            res.send({ msg: "서명 정보가 일치하지 않습니다." })
            return;
        }
        const [row, fields] = await connection.query(
            "SELECT id FROM user WHERE address=?", [req.body.address])
        if (row.length > 0) {
            res.send({ msg: "이미 존재하는 주소입니다." })
            return;
        }
        const result = await connection.query(
            "INSERT INTO user(address,name,farmCreated,farmUpdated,farmSkin) VALUES(?,?,NOW(),NOW(),0)", [req.body.address, req.body.name])
        res.send({ msg: "치키농장에 오신 것을 환영합니다." })
    } catch (err) {
        console.log(err)
    }
});

router.post("/updateUinfo", async (req, res) => {
    try {

        const decodeOk = await decodeSign("updateUinfo", req.body.sign, req.body.address);
        if (!decodeOk) {
            res.send({ msg: "서명 정보가 일치하지 않습니다." })
            return;
        }
        const [row, fields] = await connection.query(
            "SELECT id FROM user WHERE address=?", [req.body.address])
        if (row.length < 1) {
            res.send({ msg: "먼저 회원가입을 해주세요." })
            return;
        }
        const result = await connection.query(
            "UPDATE user SET name=?,twitter=?,intro=?,repChickiz=?,farmSign=? WHERE address=?",
            [req.body.name, req.body.twitter, req.body.intro, req.body.repChickiz, req.body.farmSign, req.body.address])
        res.send({ msg: "정보 변경이 완료되었습니다." })
    } catch (err) {
        console.log(err)
    }
});

router.post('/updateLastCheck', async (req, res) => {
    try {
        await connection.query(
            "UPDATE user SET lastCheck=NOW() WHERE address=?", [req.body.address])
        const [row, field] = await connection.query(
            'SELECT lastCheck from user WHERE address=?', [req.body.address]
        )

        res.send({ now: row[0].lastCheck })
    } catch (err) {
        console.error(err);
    }
})

// etc
router.post("/checkName", async (req, res) => {
    let check_num = /[0-9]/;
    let check_eng = /[a-zA-Z]/;
    let check_kor = /[가-힣]/;

    let check_special = /[ㄱ-ㅎ|ㅏ-ㅣ| 칰 | 갋 | 걃 | 곝 | 곫 | 갅 | 콬 | 겺 | 겢 | 곥 | 곷 | 갲 | 팗 | 굯 | 겥 | 긑 | 렍 | 걇 | 풏 | 귣 | 괒 | 꿂 | 렏 | 굲 | 픒 | 깉 | 돜 | 댗 | 뱇 | 굷 | 홪 | 넟 | 딹 | 둪 | 벝 | 귴 | 횓 | 떢 | 랎 | 랂 | 벸 | 꿥 | 럳 | 랕 | 밁 | 봌 | 닏 | 맠 | 맅 | 빋 | 붗 | 됒 | 뭋 | 밄 | 샄 | 븡 | 됝 | 슼 | 봈 | 섩 | 뼣 | 둧 | 엋 | 뼏 | 셎 | 쇡 | 맄 | 욷 | 슽 | 쌃 | 슠 | 맢 | 웇 | 슾 | 앑 | 쎙 | 붋 | 윛 | 쌁 | 얕 | 앺 | 샠 | 잌 | 엏 | 옧 | 왅 | 앏 | 짲 | 잩 | 옺 | 웉 | 앾 | 쫆 | 젙 | 옼 | 웾 | 얔 | 칰 | 촠 | 젅 | 쭊 | 엍 | 칽 | 캋 | 츧 | 챆 | 읹 | 컾 | 콫 | 칯 | 춫 | 잋 | 햊 | 탘 | 탵 | 퀫 | 잧 | 혿 | 폳 | 팓 | 팢 | 쥪]/;
    let letterLength = 0;

    let onlyAllowed = /([^가-힣\x20^a-z^A-Z^0-9])/i;

    try {
        if (req.body.name === "" || req.body.name.search(/\s/) != -1) {
            res.send({ msg: "공백의 사용은 불가능 합니다." })
            return;
        }

        const [row, fields] = await connection.query(
            "SELECT name FROM user")

        await row.map(function (a) {
            if (a.name.toUpperCase() === req.body.name.toUpperCase()) {
                res.send({ msg: "중복된 이름 입니다." })
                return;
            }
            return;
        })

        if (!onlyAllowed.test(req.body.name) && !check_special.test(req.body.name)) {
            for (let i = 0; i < req.body.name.length; i++) {
                //한글은 1.5, 영문은 1로 치환
                let oneLetter = req.body.name.charAt(i);
                if (check_kor.test(oneLetter)) {
                    letterLength += 1.5;
                } else {
                    letterLength += 1;
                }
            }

            if (letterLength < 3 || letterLength > 12) {
                res.send({ msg: "한글은 2~8자이내, 영문은 3~12자이내로 작성하셔야 합니다." })
                return;
            }
            res.send({ msg: "사용 가능한 닉네임 입니다." })
            return;
        }
        res.send({ msg: "특수문자 및 기호는 사용 불가능합니다." })
        return;
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;