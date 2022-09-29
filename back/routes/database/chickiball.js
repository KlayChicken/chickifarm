const express = require('express');
const router = express.Router();
const connection = require('./dbSetup.js');

// create & update
router.post("/getChickiballBoard", async (req, res) => {
    try {
        const [row, filed] = await connection.query(
            `SELECT * 
            FROM chickiball_board 
            WHERE user_id = ?`
            , [req.body.userId]
        )

        const _lastDate = getToday();
        const _answer = getAnswer();

        if (row.length < 1) {
            await connection.query(
                `INSERT INTO chickiball_board(user_id,answer,lastDate)
                VALUES(?,?,?)`
                , [req.body.userId, _answer, _lastDate]
            )
            res.send({ boardState: ["", "", "", "", "", "", ""], boardResult: [{}, {}, {}, {}, {}, {}, {}], gameStatus: "inProgress", rowIndex: 0 })
            return
        }

        const board = row[0];

        if (board.lastDate !== _lastDate) {
            await connection.query(
                `UPDATE chickiball_board
                SET answer=?,lastDate=?,rowIndex=0,gameStatus='inProgress',
                row1='',row2='',row3='',row4='',row5='',row6='',row7=''
                WHERE user_id=?`
                , [_answer, _lastDate, req.body.userId]
            )
            res.send({ boardState: ["", "", "", "", "", "", ""], boardResult: [{}, {}, {}, {}, {}, {}, {}], gameStatus: "inProgress", rowIndex: 0 })
            return
        }

        const boardState = [board.row1, board.row2, board.row3, board.row4, board.row5, board.row6, board.row7];
        const answer = board.answer;
        const boardResult = getBoardResult(boardState, answer, board.rowIndex);

        res.send({ boardState: boardState, boardResult: boardResult, gameStatus: board.gameStatus, rowIndex: board.rowIndex })
    } catch (err) {
        console.log(err)
    }
});

router.post("/getChickiballRecord", async (req, res) => {
    try {
        const [row, filed] = await connection.query(
            `SELECT * 
            FROM chickiball_record
            WHERE user_id = ?`
            , [req.body.userId]
        )

        if (row.length < 1) {
            await connection.query(
                `INSERT INTO chickiball_record(user_id)
                VALUES(?)`
                , [req.body.userId]
            )
            await connection.query(
                `INSERT INTO chickiball_weekRecord(user_id)
                VALUES(?)`
                , [req.body.userId]
            )
            res.send({ chickiballRecord: [0, 0, 0, 0, 0, 0, 0, 0] })
            return
        }

        const record = [row[0].try1, row[0].try2, row[0].try3, row[0].try4,
        row[0].try5, row[0].try6, row[0].try7, row[0].try8]

        res.send({ chickiballRecord: record })
    } catch (err) {
        console.log(err)
    }
});

router.post("/checkChickiballAnswer", async (req, res) => {
    try {
        const value = req.body.value.toString();
        const userId = req.body.userId;

        const [row, filed] = await connection.query(
            `SELECT * 
            FROM chickiball_board 
            WHERE user_id = ?`
            , [userId]
        )

        const answer = row[0].answer;

        let strike = 0;
        let ball = 0;
        const _rowIndex = row[0].rowIndex;
        const _sqlRow = 'row' + (_rowIndex + 1).toString();
        const _sqlTry = 'try' + (_rowIndex + 1).toString();

        for (let i = 0; i < 4; i++) {
            if (answer[i] === value[i]) {
                strike = strike + 1;
            } else if (answer.includes(value[i])) {
                ball = ball + 1;
            }
        }

        // 정답
        if (strike === 4) {
            await connection.query(
                `UPDATE chickiball_board
                SET rowIndex=?,gameStatus='WIN',${_sqlRow}=?
                WHERE user_id=?`
                , [_rowIndex + 1, value, userId]
            );

            await connection.query(
                `UPDATE chickiball_record
                SET ${_sqlTry} = ${_sqlTry} + 1
                WHERE user_id=?`
                , [userId]
            );

            // 주간 점수 해당 것에 1 더해주기
            await connection.query(
                `UPDATE chickiball_weekRecord
                SET ${_sqlTry} = ${_sqlTry} + 1
                WHERE user_id=?`
                , [userId]
            );

            res.send({ gameStatus: 'WIN', tryValue: value, tryResult: { ball: ball, strike: strike } })
            return
        }

        // 실패
        if (_rowIndex === 6) {
            await connection.query(
                `UPDATE chickiball_board
                SET rowIndex=?,gameStatus='LOSE',${_sqlRow}=?
                WHERE user_id=?`
                , [_rowIndex + 1, value, userId]
            )
            await connection.query(
                `UPDATE chickiball_record
                SET try8 = try8 + 1
                WHERE user_id=?`
                , [userId]
            );

            // 주간 점수 실패에 1 더해주기
            await connection.query(
                `UPDATE chickiball_weekRecord
                SET try8 = try8 + 1
                WHERE user_id=?`
                , [userId]
            );

            res.send({ gameStatus: 'LOSE', tryValue: value, tryResult: { ball: ball, strike: strike } })
            return
        }

        // 계속 진행
        await connection.query(
            `UPDATE chickiball_board
            SET rowIndex=?, ${_sqlRow}=?
            WHERE user_id=?`
            , [_rowIndex + 1, value, userId]
        );
        res.send({ gameStatus: 'inProgress', tryValue: value, tryResult: { ball: ball, strike: strike } })

    } catch (err) {
        console.log(err)
    }
});

router.post("/getChickiballRank", async (req, res) => {
    try {
        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) AS cnt FROM chickiball_record`
        )

        const [row1, field1] = await connection.query(
            `SELECT * FROM chickiball_totalRank_view
            LIMIT ?,12`
            , [req.body.start]
        );

        res.send({ rank: row1, totalNum: row0[0].cnt });
    } catch (err) {
        console.log(err);
    }
});

router.post("/getChickiballRank_week", async (req, res) => {
    try {
        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) AS cnt FROM chickiball_weekRecord`
        )

        const [row1, field1] = await connection.query(
            `SELECT * FROM chickiball_weekRank_view
            LIMIT ?,12`
            , [req.body.start]
        );

        res.send({ rank: row1, totalNum: row0[0].cnt });
    } catch (err) {
        console.log(err);
    }
});

router.post("/getHallOfFame", async (req, res) => {
    try {
        const [row0, field0] = await connection.query(
            `SELECT COUNT(*) AS cnt FROM chickiball_hallOfFame`
        )

        const [row1, field1] = await connection.query(
            `SELECT * FROM chickiball_hallOfFame_view
            LIMIT ?,12`
            , [req.body.start]
        );

        res.send({ hallOfFame: row1, totalNum: row0[0].cnt });
    } catch (err) {
        console.error(err);
    }
})

router.post("/getMyRank", async (req, res) => {
    try {
        const [row1, field1] = await connection.query(
            `SELECT * FROM chickiball_weekRank_view WHERE user_id=?`
            , [req.body.userId]
        );

        const [row2, field2] = await connection.query(
            `SELECT * FROM chickiball_totalRank_view WHERE user_id=?`
            , [req.body.userId]
        );
        if (row1 < 1 || row2 < 1) {
            res.send({ myWeekRank: { rank: '-', name: "-", repChickiz: null, score: "-" }, myTotalRank: { rank: '-', name: "-", repChickiz: null, score: "-" } })
            return
        }

        res.send({ myWeekRank: row1[0], myTotalRank: row2[0] });
    } catch (err) {
        console.log(err);
    }
});

router.post("/getWeek", async (req, res) => {
    try {
        const [row, field] = await connection.query(
            `SELECT week FROM chickiball_week`
        );

        res.send({ week: row[0].week });
    } catch (err) {
        console.log(err);
    }
});

function getBoardResult(state, answer, rowIndex) {

    let boardResult = [{}, {}, {}, {}, {}, {}, {}];

    let strike = 0;
    let ball = 0;
    let value;

    for (let i = 0; i < rowIndex; i++) {
        value = state[i];
        for (let j = 0; j < 4; j++) {
            if (answer[j] === value[j]) {
                strike = strike + 1;
            } else if (answer.includes(value[j])) {
                ball = ball + 1;
            }
        }
        boardResult[i] = { ball: ball, strike: strike };
        ball = 0;
        strike = 0;
    }

    return boardResult;
}

function getAnswer() {
    const candidate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const array = [];
    for (let i = 0; i < 4; i++) {
        const chosen = candidate.splice(Math.floor(Math.random() * (10 - i)), 1)[0];
        array.push(chosen);
    }

    return array.join("")
}

function getToday() {
    const now = new Date();
    const Y = now.getFullYear().toString();
    let M = now.getMonth() + 1;
    let D = now.getDate();

    if (M < 10) {
        M = '0' + M.toString()
    }
    if (D < 10) {
        D = '0' + D.toString()
    }
    return ((Y + M + D))
}

module.exports = router;