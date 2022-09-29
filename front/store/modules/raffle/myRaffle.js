import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

// data
// import OtherNFTProjectList from '../../../src/data/contract/OtherNFTProjectList';

// chain
// import Rafflecontract from '../../../components/chain/contract/Rafflecontract';

const initialState = {
    // myRaffle buy live
    myRaffleList_buy_live: [],
    loading_buy_live: false,
    loading_buy_live_more: false,
    cursor_buy_live: '',
    getDone_buy_live: false,

    // myRaffle buy end
    myRaffleList_buy_end: [],
    loading_buy_end: false,
    loading_buy_end_more: false,
    cursor_buy_end: '',
    getDone_buy_end: false,

    // myRaffle buy win
    myRaffleList_buy_win: [],
    loading_buy_win: false,
    loading_buy_win_more: false,
    cursor_buy_win: '',
    getDone_buy_win: false,

    // myRaffle create live
    myRaffleList_create_live: [],
    loading_create_live: false,
    loading_create_live_more: false,
    cursor_create_live: '',
    getDone_create_live: false,

    // myRaffle create end
    myRaffleList_create_end: [],
    loading_create_end: false,
    loading_create_end_more: false,
    cursor_create_end: '',
    getDone_create_end: false,

    // myRaffle favorite live
    myRaffleList_favorite_live: [],
    loading_favorite_live: false,
    loading_favorite_live_more: false,
    cursor_favorite_live: '',
    getDone_favorite_live: false,

    // myRaffle favorite end
    myRaffleList_favorite_end: [],
    loading_favorite_end: false,
    loading_favorite_end_more: false,
    cursor_favorite_end: '',
    getDone_favorite_end: false,

    msg: '',
};


// get buy
export const getMyRaffleList_buy_live_first = createAsyncThunk(
    "raffle/getMyRaffleList_buy_live_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_buy_live, currentRequestId_buy_live } = getState().myRaffle;

            if (!loading_buy_live || requestId !== currentRequestId_buy_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 0,
                    account: data.account,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_buy_live_more = createAsyncThunk(
    "raffle/getMyRaffleList_buy_live_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_buy_live, loading_buy_live_more, currentRequestId_buy_live_more, getDone_buy_live } = getState().myRaffle;

            if (!loading_buy_live_more || requestId !== currentRequestId_buy_live_more || getDone_buy_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 0,
                    account: data.account,
                    cursor: cursor_buy_live,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyRaffleList_buy_end_first = createAsyncThunk(
    "raffle/getMyRaffleList_buy_end_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_buy_end, currentRequestId_buy_end } = getState().myRaffle;

            if (!loading_buy_end || requestId !== currentRequestId_buy_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 1,
                    account: data.account,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_buy_end_more = createAsyncThunk(
    "raffle/getMyRaffleList_buy_end_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_buy_end, loading_buy_end_more, currentRequestId_buy_end_more, getDone_buy_end } = getState().myRaffle;

            if (!loading_buy_end_more || requestId !== currentRequestId_buy_end_more || getDone_buy_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 1,
                    account: data.account,
                    cursor: cursor_buy_end,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)


export const getMyRaffleList_buy_win_first = createAsyncThunk(
    "raffle/getMyRaffleList_buy_win_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_buy_win, currentRequestId_buy_win } = getState().myRaffle;

            if (!loading_buy_win || requestId !== currentRequestId_buy_win) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 2,
                    account: data.account,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_buy_win_more = createAsyncThunk(
    "raffle/getMyRaffleList_buy_win_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_buy_win, loading_buy_win_more, currentRequestId_buy_win_more, getDone_buy_win } = getState().myRaffle;

            if (!loading_buy_win_more || requestId !== currentRequestId_buy_win_more || getDone_buy_win) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_buy',
                {
                    sort: 2,
                    account: data.account,
                    cursor: cursor_buy_win,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

// get create
export const getMyRaffleList_create_live_first = createAsyncThunk(
    "raffle/getMyRaffleList_create_live_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_create_live, currentRequestId_create_live } = getState().myRaffle;

            if (!loading_create_live || requestId !== currentRequestId_create_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_create',
                {
                    sort: 0,
                    account: data.account,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_create_live_more = createAsyncThunk(
    "raffle/getMyRaffleList_create_live_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_create_live, loading_create_live_more, currentRequestId_create_live_more, getDone_create_live } = getState().myRaffle;

            if (!loading_create_live_more || requestId !== currentRequestId_create_live_more || getDone_create_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_create',
                {
                    sort: 0,
                    account: data.account,
                    cursor: cursor_create_live,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyRaffleList_create_end_first = createAsyncThunk(
    "raffle/getMyRaffleList_create_end_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_create_end, currentRequestId_create_end } = getState().myRaffle;

            if (!loading_create_end || requestId !== currentRequestId_create_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_create',
                {
                    sort: 1,
                    account: data.account,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_create_end_more = createAsyncThunk(
    "raffle/getMyRaffleList_create_end_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_create_end, loading_create_end_more, currentRequestId_create_end_more, getDone_create_end } = getState().myRaffle;

            if (!loading_create_end_more || requestId !== currentRequestId_create_end_more || getDone_create_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_create',
                {
                    sort: 1,
                    account: data.account,
                    cursor: cursor_create_end,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

// get favorite
export const getMyRaffleList_favorite_live_first = createAsyncThunk(
    "raffle/getMyRaffleList_favorite_live_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_favorite_live, currentRequestId_favorite_live } = getState().myRaffle;

            if (!loading_favorite_live || requestId !== currentRequestId_favorite_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_favorite',
                {
                    sort: 0,
                    userId: data.userId,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_favorite_live_more = createAsyncThunk(
    "raffle/getMyRaffleList_favorite_live_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_favorite_live, loading_favorite_live_more, currentRequestId_favorite_live_more, getDone_favorite_live } = getState().myRaffle;

            if (!loading_favorite_live_more || requestId !== currentRequestId_favorite_live_more || getDone_favorite_live) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_favorite',
                {
                    sort: 0,
                    userId: data.userId,
                    cursor: cursor_favorite_live,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyRaffleList_favorite_end_first = createAsyncThunk(
    "raffle/getMyRaffleList_favorite_end_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_favorite_end, currentRequestId_favorite_end } = getState().myRaffle;

            if (!loading_favorite_end || requestId !== currentRequestId_favorite_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_favorite',
                {
                    sort: 1,
                    userId: data.userId,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getMyRaffleList_favorite_end_more = createAsyncThunk(
    "raffle/getMyRaffleList_favorite_end_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_favorite_end, loading_favorite_end_more, currentRequestId_favorite_end_more, getDone_favorite_end } = getState().myRaffle;

            if (!loading_favorite_end_more || requestId !== currentRequestId_favorite_end_more || getDone_favorite_end) return;

            const res = await axios.post('/api/db/raffle/getRaffleList_favorite',
                {
                    sort: 1,
                    userId: data.userId,
                    cursor: cursor_favorite_end,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

const myRaffleSlice = createSlice({
    name: 'myRaffle',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        // get buy
        builder
            .addCase(getMyRaffleList_buy_live_first.pending, (state, action) => {
                if (!state.loading_buy_live) {
                    state.loading_buy_live = true;
                    state.currentRequestId_buy_live = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_live_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_live && state.currentRequestId_buy_live === requestId) {
                    state.cursor_buy_live = action.payload.cursor;
                    state.myRaffleList_buy_live = action.payload.raffleList;
                    state.getDone_buy_live = action.payload.getDone;
                    state.loading_buy_live = false;
                    state.currentRequestId_buy_live = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_live_first.rejected, (state, action) => {
                if (state.loading_buy_live) {
                    state.loading_buy_live = false;
                    state.currentRequestId_buy_live = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_buy_live_more.pending, (state, action) => {
                if (!state.loading_buy_live_more) {
                    state.loading_buy_live_more = true;
                    state.currentRequestId_buy_live_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_live_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_live_more && state.currentRequestId_buy_live_more === requestId && !state.getDone_buy_live) {
                    state.cursor_buy_live = action.payload.cursor;
                    state.myRaffleList_buy_live.push(...action.payload.raffleList);
                    state.getDone_buy_live = action.payload.getDone;

                    state.loading_buy_live_more = false;
                    state.currentRequestId_buy_live_more = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_live_more.rejected, (state, action) => {
                if (state.loading_buy_live_more) {
                    state.loading_buy_live_more = false;
                    state.currentRequestId_more = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_buy_end_first.pending, (state, action) => {
                if (!state.loading_buy_end) {
                    state.loading_buy_end = true;
                    state.currentRequestId_buy_end = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_end_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_end && state.currentRequestId_buy_end === requestId) {
                    state.cursor_buy_end = action.payload.cursor;
                    state.myRaffleList_buy_end = action.payload.raffleList;
                    state.getDone_buy_end = action.payload.getDone;
                    state.loading_buy_end = false;
                    state.currentRequestId_buy_end = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_end_first.rejected, (state, action) => {
                if (state.loading_buy_end) {
                    state.loading_buy_end = false;
                    state.currentRequestId_buy_end = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_buy_end_more.pending, (state, action) => {
                if (!state.loading_buy_end_more) {
                    state.loading_buy_end_more = true;
                    state.currentRequestId_buy_end_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_end_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_end_more && state.currentRequestId_buy_end_more === requestId && !state.getDone_buy_end) {
                    state.cursor_buy_end = action.payload.cursor;
                    state.myRaffleList_buy_end.push(...action.payload.raffleList);
                    state.getDone_buy_end = action.payload.getDone;

                    state.loading_buy_end_more = false;
                    state.currentRequestId_buy_end_more = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_end_more.rejected, (state, action) => {
                if (state.loading_buy_end_more) {
                    state.loading_buy_end_more = false;
                    state.currentRequestId_more = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_buy_win_first.pending, (state, action) => {
                if (!state.loading_buy_win) {
                    state.loading_buy_win = true;
                    state.currentRequestId_buy_win = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_win_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_win && state.currentRequestId_buy_win === requestId) {
                    state.cursor_buy_win = action.payload.cursor;
                    state.myRaffleList_buy_win = action.payload.raffleList;
                    state.getDone_buy_win = action.payload.getDone;
                    state.loading_buy_win = false;
                    state.currentRequestId_buy_win = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_win_first.rejected, (state, action) => {
                if (state.loading_buy_win) {
                    state.loading_buy_win = false;
                    state.currentRequestId_buy_win = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_buy_win_more.pending, (state, action) => {
                if (!state.loading_buy_win_more) {
                    state.loading_buy_win_more = true;
                    state.currentRequestId_buy_win_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_buy_win_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buy_win_more && state.currentRequestId_buy_win_more === requestId && !state.getDone_buy_win) {
                    state.cursor_buy_win = action.payload.cursor;
                    state.myRaffleList_buy_win.push(...action.payload.raffleList);
                    state.getDone_buy_win = action.payload.getDone;

                    state.loading_buy_win_more = false;
                    state.currentRequestId_buy_win_more = undefined;
                }
            })
            .addCase(getMyRaffleList_buy_win_more.rejected, (state, action) => {
                if (state.loading_buy_win_more) {
                    state.loading_buy_win_more = false;
                    state.currentRequestId_more = undefined
                }
            });

        // get create
        builder
            .addCase(getMyRaffleList_create_live_first.pending, (state, action) => {
                if (!state.loading_create_live) {
                    state.loading_create_live = true;
                    state.currentRequestId_create_live = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_create_live_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_create_live && state.currentRequestId_create_live === requestId) {
                    state.cursor_create_live = action.payload.cursor;
                    state.myRaffleList_create_live = action.payload.raffleList;
                    state.getDone_create_live = action.payload.getDone;
                    state.loading_create_live = false;
                    state.currentRequestId_create_live = undefined;
                }
            })
            .addCase(getMyRaffleList_create_live_first.rejected, (state, action) => {
                if (state.loading_create_live) {
                    state.loading_create_live = false;
                    state.currentRequestId_create_live = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_create_live_more.pending, (state, action) => {
                if (!state.loading_create_live_more) {
                    state.loading_create_live_more = true;
                    state.currentRequestId_create_live_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_create_live_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_create_live_more && state.currentRequestId_create_live_more === requestId && !state.getDone_create_live) {
                    state.cursor_create_live = action.payload.cursor;
                    state.myRaffleList_create_live.push(...action.payload.raffleList);
                    state.getDone_create_live = action.payload.getDone;

                    state.loading_create_live_more = false;
                    state.currentRequestId_create_live_more = undefined;
                }
            })
            .addCase(getMyRaffleList_create_live_more.rejected, (state, action) => {
                if (state.loading_create_live_more) {
                    state.loading_create_live_more = false;
                    state.currentRequestId_more = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_create_end_first.pending, (state, action) => {
                if (!state.loading_create_end) {
                    state.loading_create_end = true;
                    state.currentRequestId_create_end = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_create_end_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_create_end && state.currentRequestId_create_end === requestId) {
                    state.cursor_create_end = action.payload.cursor;
                    state.myRaffleList_create_end = action.payload.raffleList;
                    state.getDone_create_end = action.payload.getDone;
                    state.loading_create_end = false;
                    state.currentRequestId_create_end = undefined;
                }
            })
            .addCase(getMyRaffleList_create_end_first.rejected, (state, action) => {
                if (state.loading_create_end) {
                    state.loading_create_end = false;
                    state.currentRequestId_create_end = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_create_end_more.pending, (state, action) => {
                if (!state.loading_create_end_more) {
                    state.loading_create_end_more = true;
                    state.currentRequestId_create_end_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_create_end_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_create_end_more && state.currentRequestId_create_end_more === requestId && !state.getDone_create_end) {
                    state.cursor_create_end = action.payload.cursor;
                    state.myRaffleList_create_end.push(...action.payload.raffleList);
                    state.getDone_create_end = action.payload.getDone;

                    state.loading_create_end_more = false;
                    state.currentRequestId_create_end_more = undefined;
                }
            })
            .addCase(getMyRaffleList_create_end_more.rejected, (state, action) => {
                if (state.loading_create_end_more) {
                    state.loading_create_end_more = false;
                    state.currentRequestId_more = undefined
                }
            });


        // get favorite
        builder
            .addCase(getMyRaffleList_favorite_live_first.pending, (state, action) => {
                if (!state.loading_favorite_live) {
                    state.loading_favorite_live = true;
                    state.currentRequestId_favorite_live = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_favorite_live_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_favorite_live && state.currentRequestId_favorite_live === requestId) {
                    state.cursor_favorite_live = action.payload.cursor;
                    state.myRaffleList_favorite_live = action.payload.raffleList;
                    state.getDone_favorite_live = action.payload.getDone;
                    state.loading_favorite_live = false;
                    state.currentRequestId_favorite_live = undefined;
                }
            })
            .addCase(getMyRaffleList_favorite_live_first.rejected, (state, action) => {
                if (state.loading_favorite_live) {
                    state.loading_favorite_live = false;
                    state.currentRequestId_favorite_live = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_favorite_live_more.pending, (state, action) => {
                if (!state.loading_favorite_live_more) {
                    state.loading_favorite_live_more = true;
                    state.currentRequestId_favorite_live_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_favorite_live_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_favorite_live_more && state.currentRequestId_favorite_live_more === requestId && !state.getDone_favorite_live) {
                    state.cursor_favorite_live = action.payload.cursor;
                    state.myRaffleList_favorite_live.push(...action.payload.raffleList);
                    state.getDone_favorite_live = action.payload.getDone;

                    state.loading_favorite_live_more = false;
                    state.currentRequestId_favorite_live_more = undefined;
                }
            })
            .addCase(getMyRaffleList_favorite_live_more.rejected, (state, action) => {
                if (state.loading_favorite_live_more) {
                    state.loading_favorite_live_more = false;
                    state.currentRequestId_more = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_favorite_end_first.pending, (state, action) => {
                if (!state.loading_favorite_end) {
                    state.loading_favorite_end = true;
                    state.currentRequestId_favorite_end = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_favorite_end_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_favorite_end && state.currentRequestId_favorite_end === requestId) {
                    state.cursor_favorite_end = action.payload.cursor;
                    state.myRaffleList_favorite_end = action.payload.raffleList;
                    state.getDone_favorite_end = action.payload.getDone;
                    state.loading_favorite_end = false;
                    state.currentRequestId_favorite_end = undefined;
                }
            })
            .addCase(getMyRaffleList_favorite_end_first.rejected, (state, action) => {
                if (state.loading_favorite_end) {
                    state.loading_favorite_end = false;
                    state.currentRequestId_favorite_end = undefined
                }
            });
        builder
            .addCase(getMyRaffleList_favorite_end_more.pending, (state, action) => {
                if (!state.loading_favorite_end_more) {
                    state.loading_favorite_end_more = true;
                    state.currentRequestId_favorite_end_more = action.meta.requestId;
                }
            })
            .addCase(getMyRaffleList_favorite_end_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_favorite_end_more && state.currentRequestId_favorite_end_more === requestId && !state.getDone_favorite_end) {
                    state.cursor_favorite_end = action.payload.cursor;
                    state.myRaffleList_favorite_end.push(...action.payload.raffleList);
                    state.getDone_favorite_end = action.payload.getDone;

                    state.loading_favorite_end_more = false;
                    state.currentRequestId_favorite_end_more = undefined;
                }
            })
            .addCase(getMyRaffleList_favorite_end_more.rejected, (state, action) => {
                if (state.loading_favorite_end_more) {
                    state.loading_favorite_end_more = false;
                    state.currentRequestId_more = undefined
                }
            });
    },
});


export default myRaffleSlice.reducer;