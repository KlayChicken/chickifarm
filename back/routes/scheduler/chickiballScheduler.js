const schedule = require('node-schedule');
const connection = require('../database/dbSetup');

// chickiball 주간 명예의 전당 선출 후 리셋
const job1 = schedule.scheduleJob('59 59 23 * * 7', async () => {
    try {
        const [row1, field1] = await connection.query(
            `SELECT * FROM chickiball_weekRank_view WHERE rank=1`
        );


        const [row2, field2] = await connection.query(
            `SELECT week from chickiball_week`
        )

        for (let i = 0; i < row1.length; i++) {
            await connection.query(
                `INSERT INTO chickiball_hallOfFame (week,user_id,score,date)
                VALUES(?,?,?,NOW())`,
                [row2[0].week, row1[i].user_id, row1[i].score]
            )
        }

        await connection.query(
            `UPDATE chickiball_weekRecord
            SET try1=0,try2=0,try3=0,try4=0,try5=0,try6=0,try7=0,try8=0`
        )

        await connection.query(
            `UPDATE chickiball_week
            SET week = week +1`
        )

        console.log(`WEEK ${row2[0].week} CHICKIBALL WINNER ${row1.length}명 ${row1[0].user_id}번 등...`)
    } catch (err) {
        console.error(err);
    }
})

const chickiballScheduler = { job1: job1 }

module.exports = chickiballScheduler;