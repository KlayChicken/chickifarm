import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    chickiballRecord: [0, 0, 0, 0, 0, 0, 0, 0],
    totalGame: 0,
    successRate: 0,
    averageTry: 0,
    score: 0,

    boardState: ["", "", "", "", "", "", ""],
    boardResult: [{}, {}, {}, {}, {}, {}, {}],
    gameStatus: "inProgress",
    rowIndex: 0,
    answer: '',

    totalRank: [],
    start_total: 0,
    loading_total: false,
    weekRank: [],
    start_week: 0,
    loading_week: false,
    totalRankNum: 0,

    myWeekRank: '-',
    myWeekScore: '-',
    myTotalRank: '-',
    myTotalScore: '-',

    hallOfFame: [],
    start_hallOfFame: 0,
    loading_hallOfFame: false,
    totalHallOfFameNum: 0,

    week: 1,
};

export const getChickiBallBoard_Server = createAsyncThunk(
    "chickiball/getChickiBallBoard_Server",
    async (id) => {
        try {
            const res = await axios.post('/api/db/chickiball/getChickiballBoard',
                { userId: id });
            return ({
                boardState: res.data.boardState,
                boardResult: res.data.boardResult,
                gameStatus: res.data.gameStatus,
                rowIndex: res.data.rowIndex,
            })
        } catch (err) {
            console.error(err)
        }
    }
)

export const getChickiBallRecord_Server = createAsyncThunk(
    "chickiball/getChickiBallRecord_Server",
    async (id) => {
        try {
            const res = await axios.post('/api/db/chickiball/getChickiballRecord',
                { userId: id });
            const _record = res.data.chickiballRecord;
            const _total = _record.reduce((stack, a, i) => { return stack + a }, 0);

            if (_total === 0) {
                return ({
                    chickiballRecord: [0, 0, 0, 0, 0, 0, 0, 0],
                    totalGame: 0,
                    successRate: 0,
                    averageTry: 0,
                    score: 0,
                })
            }

            const _successRate = Math.round((_total - _record[7]) * 100 / _total);
            const _average = Math.round(_record.reduce((stack, a, i) => { return stack + a * (i + 1) }, 0) * 10 / _total) / 10;
            const _score = 11 * _record[0] + 10 * _record[1] + 9 * _record[2] + 6 * _record[3] + 5 * _record[4] + 3 * _record[5] + 2 * _record[6] + 1 * _record[7];

            return ({
                chickiballRecord: _record,
                totalGame: _total,
                successRate: _successRate,
                averageTry: _average,
                score: _score,
            })
        } catch (err) {
            console.error(err)
        }
    }
)

export const checkAnswer_Server = createAsyncThunk(
    "chickiball/checkAnswer_Server",
    async (data, { getState }) => {
        try {
            const res = await axios.post('/api/db/chickiball/checkChickiballAnswer',
                { value: data.value, userId: data.userId });

            const { boardState, boardResult, rowIndex } = getState().chickiball;

            const _boardState = [...boardState];
            const _boardResult = [...boardResult];

            const gameStatus = res.data.gameStatus;
            _boardState[rowIndex] = res.data.tryValue;
            _boardResult[rowIndex] = res.data.tryResult;

            localStorage.setItem("chickiball_first", "false");

            return (
                {
                    gameStatus: gameStatus,
                    boardState: _boardState,
                    boardResult: _boardResult
                }
            )
        } catch (err) {
            console.error(err)
        }
    }
)

export const getChickiballTotalRank = createAsyncThunk(
    "chickiball/getChickiballRank",
    async (data, { getState, requestId }) => {
        try {
            const { start_total: start, loading_total, currentRequestId_total } = getState().chickiball;

            if (!loading_total || requestId !== currentRequestId_total) return;

            const res = await axios.post('/api/db/chickiball/getChickiballRank', { start: start });

            return ({
                start: start + 12,
                totalRank: res.data.rank,
                totalNum: res.data.totalNum
            })
        } catch (err) {
            console.error(err)
        }
    }
)

export const getChickiballWeekRank = createAsyncThunk(
    "chickiball/getChickiballWeekRank",
    async (data, { getState, requestId }) => {
        try {
            const { start_week: start, loading_week, currentRequestId_week } = getState().chickiball;

            if (!loading_week || requestId !== currentRequestId_week) return;

            const res = await axios.post('/api/db/chickiball/getChickiballRank_week', { start: start });

            return ({
                start: start + 12,
                weekRank: res.data.rank,
                totalNum: res.data.totalNum
            })
        } catch (err) {
            console.error(err)
        }
    }
)

export const refreshRank = createAsyncThunk(
    'chickiball/refreshRank',
    async () => {
        try {

            const res1 = await axios.post('/api/db/chickiball/getChickiballRank', { start: 0 });

            const res2 = await axios.post('/api/db/chickiball/getChickiballRank_week', { start: 0 });

            return ({
                totalRank: res1.data.rank,
                weekRank: res2.data.rank,
                totalNum: res1.data.totalNum
            })
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyRank = createAsyncThunk(
    "chickiball/getMyRank",
    async (userId) => {
        try {
            const res = await axios.post('/api/db/chickiball/getMyRank', { userId: userId });

            return ({
                myWeekRank: res.data.myWeekRank, myTotalRank: res.data.myTotalRank
            })
        } catch (err) {
            console.error(err);
        }
    }
)

export const getHallOfFame = createAsyncThunk(
    "chickiball/getHallOfFame",
    async (data, { getState, requestId }) => {
        try {
            const { start_hallOfFame: start, loading_hallOfFame, currentRequestId_hallOfFame } = getState().chickiball;

            if (!loading_hallOfFame || requestId !== currentRequestId_hallOfFame) return;

            const res = await axios.post('/api/db/chickiball/getHallOfFame', { start: start });

            return ({
                start: start + 12,
                hallOfFame: res.data.hallOfFame,
                totalNum: res.data.totalNum
            })
        } catch (err) {
            console.error(err)
        }
    }
);

export const getChickiballWeek = createAsyncThunk(
    "chickiball/getChickiballWeek",
    async () => {
        try {
            const res = await axios.post('/api/db/chickiball/getWeek');

            return ({
                week: res.data.week
            })
        } catch (err) {
            console.error(err);
        }
    }
)

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
    return (Number(Y + M + D))
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

const chickiballSlice = createSlice({
    name: 'chickiball',
    initialState,
    reducers: {
        getChickiBallRecord_Local(state) {
            //const _record = JSON.parse(localStorage.getItem('chickiball_record'));
            //if (_record === null) {
            //    localStorage.setItem('chickiball_record', '[0,0,0,0,0,0,0,0]');
            //    state.chickiballRecord = [0, 0, 0, 0, 0, 0, 0, 0];
            //    state.totalGame = 0;
            //    state.successRate = 0;
            //    state.averageTry = 0;
            //    state.rank = '-';
            //    return
            //}
            //const _total = _record.reduce((stack, a, i) => { return stack + a }, 0);
            //if (_total === 0) {
            //    localStorage.setItem('chickiball_record', '[0,0,0,0,0,0,0,0]');
            //    state.chickiballRecord = [0, 0, 0, 0, 0, 0, 0, 0];
            //    state.totalGame = 0;
            //    state.successRate = 0;
            //    state.averageTry = 0;
            //    state.rank = '-';
            //    return
            //}
            //const _successRate = Math.round((_total - _record[7]) * 100 / _total);
            //const _average = Math.round(_record.reduce((stack, a, i) => { return stack + a * (i + 1) }, 0) * 10 / _total) / 10;
            //state.chickiballRecord = _record;
            //state.totalGame = _total;
            //state.successRate = _successRate;
            //state.averageTry = _average;
            //state.rank = '-';

            state.chickiballRecord = [0, 0, 0, 0, 0, 0, 0, 0];
            state.totalGame = 0;
            state.successRate = 0;
            state.averageTry = 0;
            state.rank = '-';
        },
        getChickiBallBoard_Local(state) {
            const today = getToday();
            const answer = getAnswer();
            const board = JSON.parse(localStorage.getItem("chickiball_board"))

            const newInfo = `{"boardState":["","","","","","",""],"boardResult":[{},{},{},{},{},{},{}],"rowIndex":0,"gameStatus":"inProgress","lastDate":${today},"answer":"${answer}"}`

            if (board === null) {
                localStorage.setItem('chickiball_board', newInfo)
                state.boardState = ["", "", "", "", "", "", ""];
                state.boardResult = [{}, {}, {}, {}, {}, {}, {}];
                state.gameStatus = "inProgress";
                state.rowIndex = 0;
                state.answer = answer;
                return
            }
            if (board.lastDate !== today) {
                localStorage.setItem('chickiball_board', newInfo)
                state.boardState = ["", "", "", "", "", "", ""];
                state.boardResult = [{}, {}, {}, {}, {}, {}, {}];
                state.gameStatus = "inProgress";
                state.rowIndex = 0;
                state.answer = answer;
                return
            }

            state.boardState = board.boardState;
            state.boardResult = board.boardResult;
            state.gameStatus = board.gameStatus;
            state.rowIndex = board.rowIndex;
            state.answer = board.answer;
        },
        checkAnswer_Local(state, action) {
            const value = action.payload.value.toString();
            const answer = state.answer;

            let strike = 0;
            let ball = 0;

            for (let i = 0; i < 4; i++) {
                if (answer[i] === value[i]) {
                    strike = strike + 1;
                } else if (answer.includes(value[i])) {
                    ball = ball + 1;
                }
            }

            const _rowIndex = state.rowIndex;

            // localstorage에 저장
            let board = JSON.parse(localStorage.getItem("chickiball_board"));
            board.boardState[_rowIndex] = value;
            board.boardResult[_rowIndex] = { ball: ball, strike: strike };
            board.rowIndex = _rowIndex + 1;


            // let record = JSON.parse(localStorage.getItem("chickiball_record"));

            if (strike === 4) {
                board.gameStatus = "WIN";
                localStorage.setItem("chickiball_first", "false");
                // record[_rowIndex] = record[_rowIndex] + 1;
                // localStorage.setItem('chickiball_record', JSON.stringify(record))
                localStorage.setItem("chickiball_board", JSON.stringify(board))
                return
            }
            if (_rowIndex === 6) {
                board.gameStatus = "LOSE";
                localStorage.setItem("chickiball_first", "false");
                // record[7] = record[7] + 1;
                // localStorage.setItem('chickiball_record', JSON.stringify(record))
                localStorage.setItem("chickiball_board", JSON.stringify(board))
                return
            }

            localStorage.setItem("chickiball_board", JSON.stringify(board))
        }
    },
    extraReducers: builder => {
        builder.addCase(getChickiBallBoard_Server.fulfilled, (state, action) => {
            state.boardState = action.payload.boardState;
            state.boardResult = action.payload.boardResult;
            state.gameStatus = action.payload.gameStatus;
            state.rowIndex = action.payload.rowIndex;
            state.answer = '';
        });
        builder.addCase(getChickiBallRecord_Server.fulfilled, (state, action) => {
            state.chickiballRecord = action.payload.chickiballRecord;
            state.totalGame = action.payload.totalGame;
            state.successRate = action.payload.successRate;
            state.averageTry = action.payload.averageTry;
            state.score = action.payload.score;
        });
        builder.addCase(checkAnswer_Server.fulfilled, (state, action) => {
            state.boardState = action.payload.boardState;
            state.boardResult = action.payload.boardResult;
            state.gameStatus = action.payload.gameStatus;
            state.rowIndex += 1;
        });
        builder
            .addCase(getChickiballTotalRank.pending, (state, action) => {
                if (!state.loading_total) {
                    state.loading_total = true;
                    state.currentRequestId_total = action.meta.requestId;
                }
            })
            .addCase(getChickiballTotalRank.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_total && state.currentRequestId_total === requestId) {
                    state.start_total = action.payload.start;
                    state.totalRank.push(...action.payload.totalRank);
                    state.totalRankNum = action.payload.totalNum;
                    state.loading_total = false;
                    state.currentRequestId_total = undefined;
                }
            })
            .addCase(getChickiballTotalRank.rejected, (state, action) => {
                if (state.loading_total) {
                    state.loading_total = false;
                    state.currentRequestId_total = undefined
                }
            });
        builder
            .addCase(getChickiballWeekRank.pending, (state, action) => {
                if (!state.loading_week) {
                    state.loading_week = true;
                    state.currentRequestId_week = action.meta.requestId;
                }
            })
            .addCase(getChickiballWeekRank.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_week && state.currentRequestId_week === requestId) {
                    state.start_week = action.payload.start;
                    state.weekRank.push(...action.payload.weekRank);
                    state.totalRankNum = action.payload.totalNum;
                    state.loading_week = false;
                    state.currentRequestId_week = undefined;
                }
            })
            .addCase(getChickiballWeekRank.rejected, (state, action) => {
                if (state.loading_week) {
                    state.loading_week = false;
                    state.currentRequestId_week = undefined
                }
            });
        builder
            .addCase(refreshRank.fulfilled, (state, action) => {
                state.start_total = 12;
                state.start_week = 12;
                state.totalRank = action.payload.totalRank;
                state.weekRank = action.payload.weekRank;
                state.totalRankNum = action.payload.totalNum;
            });
        builder
            .addCase(getMyRank.fulfilled, (state, action) => {
                state.myWeekRank = action.payload.myWeekRank.rank;
                state.myWeekScore = action.payload.myWeekRank.score;
                state.myTotalRank = action.payload.myTotalRank.rank;
                state.myTotalScore = action.payload.myTotalRank.score;
            })
        builder
            .addCase(getHallOfFame.pending, (state, action) => {
                if (!state.loading_hallOfFame) {
                    state.loading_hallOfFame = true;
                    state.currentRequestId_hallOfFame = action.meta.requestId;
                }
            })
            .addCase(getHallOfFame.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_hallOfFame && state.currentRequestId_hallOfFame === requestId) {
                    state.start_hallOfFame = action.payload.start;
                    state.hallOfFame.push(...action.payload.hallOfFame);
                    state.totalHallOfFameNum = action.payload.totalNum;
                    state.loading_hallOfFame = false;
                    state.currentRequestId_hallOfFame = undefined;
                }
            })
            .addCase(getHallOfFame.rejected, (state, action) => {
                if (state.loading_hallOfFame) {
                    state.loading_hallOfFame = false;
                    state.currentRequestId_hallOfFame = undefined
                }
            });
        builder.addCase(getChickiballWeek.fulfilled, (state, action) => {
            state.week = action.payload.week;
        });
    },
});

export const { getChickiBallRecord_Local, getChickiBallBoard_Local, checkAnswer_Local } = chickiballSlice.actions;
export default chickiballSlice.reducer;