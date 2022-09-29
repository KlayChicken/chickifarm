import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

import chickenList from '../../src/data/etc/ChickenList';

const initialState = {
    announceList: [],
    todayChickenList: [],

    notificationList_guestBook: [],
    loading_notiGuestBook: false,
    start_notiGuestBook: 0,
    notiGuestBookTotal: 0,

    notificationList_neighbor: [],
    loading_notiNeighbor: false,
    start_notiNeighbor: 0,
    notiNeighborTotal: 0,

    notificationList_love: [],
    loading_notiLove: false,
    start_notiLove: 0,
    notiLoveTotal: 0,

    notiGuestBookNum: 0,
    notiNeighborNum: 0,
    notiLoveNum: 0,
    notiAnnounceNum: 0,
};

export const getAnnounce = createAsyncThunk(
    "etc/getAnnounce",
    async () => {
        try {
            const res = await axios.post('/api/db/etc/getAnnouncement')

            return {
                _announce: res.data.announce,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNotification_guestBook = createAsyncThunk(
    "etc/getNotification_guestBook",

    async (account, { getState, requestId }) => {
        try {

            const { start_notiGuestBook: start, loading_notiGuestBook, currentRequestId_notiGuestBook } = getState().etc;

            // 로딩중이 아니거나(pending에서 로딩중으로 변경돼야하니깐) requestId가 다르면 return. 중복된 요청 방지.
            if (!loading_notiGuestBook || requestId !== currentRequestId_notiGuestBook) return;

            const res = await axios.post('/api/db/etc/getNotification_guestBook', { account: account, start: start })

            return { start: start + 12, guestBook: res.data.guestBook, total: res.data.total }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNotification_neighbor = createAsyncThunk(
    "etc/getNotification_neighbor",

    async (account, { getState, requestId }) => {
        try {

            const { start_notiNeighbor: start, loading_notiNeighbor, currentRequestId_notiNeighbor } = getState().etc;

            // 로딩중이 아니거나(pending에서 로딩중으로 변경돼야하니깐) requestId가 다르면 return. 중복된 요청 방지.
            if (!loading_notiNeighbor || requestId !== currentRequestId_notiNeighbor) return;

            const res = await axios.post('/api/db/etc/getNotification_neighbor', { account: account, start: start })

            return { start: start + 12, neighbor: res.data.neighbor, total: res.data.total }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNotification_love = createAsyncThunk(
    "etc/getNotification_love",

    async (account, { getState, requestId }) => {
        try {

            const { start_notiLove: start, loading_notiLove, currentRequestId_notiLove } = getState().etc;

            // 로딩중이 아니거나(pending에서 로딩중으로 변경돼야하니깐) requestId가 다르면 return. 중복된 요청 방지.
            if (!loading_notiLove || requestId !== currentRequestId_notiLove) return;

            const res = await axios.post('/api/db/etc/getNotification_love', { account: account, start: start })

            return { start: start + 12, love: res.data.love, total: res.data.total }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNotificationNum = createAsyncThunk(
    "etc/getNotificationNum",
    async (account) => {
        try {
            const res = await axios.post('/api/db/etc/getNotificationNum', { account: account })

            return res.data
        } catch (err) {
            console.error(err);
        }
    }
)

const getRandomChicken = () => {
    let newArray = [];

    const _chickenList = [...chickenList];

    while (_chickenList.length > 41) {
        let newChickenList = _chickenList.splice(Math.floor(Math.random() * _chickenList.length), 1)[0]
        newArray.push(newChickenList)
    }

    return newArray
}

const etcSlice = createSlice({
    name: 'etc',
    initialState,
    reducers: {
        refreshNoti(state) {
            state.notificationList_guestBook = [];
            state.loading_notiGuestBook = false;
            state.start_notiGuestBook = 0;
            state.notiGuestBookTotal = 0;

            state.notificationList_neighbor = [];
            state.loading_notiNeighbor = false;
            state.start_notiNeighbor = 0;
            state.notiNeighborTotal = 0;

            state.notificationList_love = [];
            state.loading_notiLove = false;
            state.start_notiLove = 0;
            state.notiLoveTotal = 0;

            state.notiGuestBookNum = 0;
            state.notiNeighborNum = 0;
            state.notiLoveNum = 0;
            state.notiAnnounceNum = 0;
        },
        refreshNotiNum(state) {
            state.notiGuestBookNum = 0;
            state.notiNeighborNum = 0;
            state.notiLoveNum = 0;
            state.notiAnnounceNum = 0;
        },
        getTodayChicken(state) {
            state.todayChickenList = getRandomChicken();
        },
        refreshTodayChicken(state) {
            state.todayChickenList = [];
        },
    },
    extraReducers: builder => {
        builder.addCase(getAnnounce.fulfilled, (state, action) => {
            state.announceList = action.payload._announce;
        });
        builder.addCase(getNotificationNum.fulfilled, (state, action) => {
            state.notiGuestBookNum = action.payload.guestNum;
            state.notiNeighborNum = action.payload.neighborNum;
            state.notiLoveNum = action.payload.loveNum;
            state.notiAnnounceNum = action.payload.announceNum;
        });
        builder
            .addCase(getNotification_guestBook.pending, (state, action) => {
                if (!state.loading_notiGuestBook) {
                    state.loading_notiGuestBook = true;
                    state.currentRequestId_notiGuestBook = action.meta.requestId;
                }
            })
            .addCase(getNotification_guestBook.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_notiGuestBook && state.currentRequestId_notiGuestBook === requestId) {
                    state.start_notiGuestBook = action.payload.start;
                    state.notiGuestBookTotal = action.payload.total;
                    state.notificationList_guestBook.push(...action.payload.guestBook);
                    state.loading_notiGuestBook = false;
                    state.currentRequestId_notiGuestBook = undefined
                }
            })
            .addCase(getNotification_guestBook.rejected, (state, action) => {
                if (state.loading_notiGuestBook) {
                    state.loading_notiGuestBook = false;
                    state.currentRequestId_notiGloading_notiGuestBook = undefined
                }
            });
        builder
            .addCase(getNotification_neighbor.pending, (state, action) => {
                if (!state.loading_notiNeighbor) {
                    state.loading_notiNeighbor = true;
                    state.currentRequestId_notiNeighbor = action.meta.requestId;
                }
            })
            .addCase(getNotification_neighbor.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_notiNeighbor && state.currentRequestId_notiNeighbor === requestId) {
                    state.start_notiNeighbor = action.payload.start;
                    state.notiNeighborTotal = action.payload.total;
                    state.notificationList_neighbor.push(...action.payload.neighbor);
                    state.loading_notiNeighbor = false;
                    state.currentRequestId_notiNeighbor = undefined
                }
            })
            .addCase(getNotification_neighbor.rejected, (state, action) => {
                if (state.loading_notiNeighbor) {
                    state.loading_notiNeighbor = false;
                    state.currentRequestId_notiNeighbor = undefined
                }
            });
        builder
            .addCase(getNotification_love.pending, (state, action) => {
                if (!state.loading_notiLove) {
                    state.loading_notiLove = true;
                    state.currentRequestId_notiLove = action.meta.requestId;
                }
            })
            .addCase(getNotification_love.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_notiLove && state.currentRequestId_notiLove === requestId) {
                    state.start_notiLove = action.payload.start;
                    state.notiLoveTotal = action.payload.total;
                    state.notificationList_love.push(...action.payload.love);
                    state.loading_notiLove = false;
                    state.currentRequestId_notiLove = undefined
                }
            })
            .addCase(getNotification_love.rejected, (state, action) => {
                if (state.loading_notiLove) {
                    state.loading_notiLove = false;
                    state.currentRequestId_notiLove = undefined
                }
            });
        builder.addCase(HYDRATE, (state, action) => {
            if (action.payload.etc.announceList.length > 0) {
                state.announceList = action.payload.etc.announceList
            }
        });
    },
});

export const { refreshNoti, refreshNotiNum, getTodayChicken, refreshTodayChicken } = etcSlice.actions;
export default etcSlice.reducer;