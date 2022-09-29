import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { msg: '', loading: false };

export const getGuestBook = createAsyncThunk(
    "guestBook/getGusetBook",
    async (data, { getState, requestId }) => {
        try {
            const _guest = getState().guestBook;
            if (!_guest.loading || requestId !== _guest.currentRequestId) return;

            let _start;
            let guestBook;
            let originalBook;
            let _guestBook;

            if (data.start === 0) {
                _start = 0;
                guestBook = await getGuestBookFromServer(_start, data.account, data.searchWord);
                _guestBook = guestBook.guestBook

            } else {
                _start = _guest[data.account] ? _guest[data.account]?.start : 0;
                guestBook = await getGuestBookFromServer(_start, data.account, data.searchWord);
                originalBook = _guest[data.account] ? _guest[data.account]?.guestBook : [];

                _guestBook = originalBook.concat(guestBook.guestBook)
            }

            return { account: data.account, start: _start + 6, total: guestBook.total, guestBook: _guestBook }
        } catch (err) {
            console.error(err)
        }
    }
)

export const createGuestBook = createAsyncThunk(
    "guestBook/createGusetBook",
    async (data, { getState, requestId }) => {
        try {
            const { loading, currentRequestId } = getState().guestBook;
            if (!loading || requestId !== currentRequestId) return;

            const msg = await createGuestBookToServer(data.from, data.to, data.text)
            return { msg: msg }
        } catch (err) {
            console.error(err)
        }
    }
)

export const deleteGuestBook = createAsyncThunk(
    "guestBook/deleteGusetBook",
    async (data) => {
        try {
            const msg = await deleteGusetBookFromServer(data.sign, data.deleteId, data.account)
            return { msg: msg }
        } catch (err) {
            console.error(err)
        }
    }
)

async function getGuestBookFromServer(_start, _account, _searchWord = "") {
    try {
        const res = await axios.post('/api/db/guestBook/getGuestBook', { start: _start, toAddress: _account, searchWord: "%" + _searchWord + "%" });
        return { total: res.data.total, guestBook: res.data.guestBook };
    } catch (err) {
        console.error(err)
    }
}

async function createGuestBookToServer(_from, _to, _text) {
    try {
        const res = await axios.post('/api/db/guestBook/createGuestBook', { fromAddress: _from, toAddress: _to, mainText: _text });
        return res.data.msg;
    } catch (err) {
        console.error(err)
    }
}

async function deleteGusetBookFromServer(_sign, _deleteId, _account) {
    try {
        const res = await axios.post('/api/db/guestBook/deleteGuestBook', { id: Number(_deleteId), sign: _sign, address: _account });
        return res.data.msg;
    } catch (err) {
        console.error(err)
    }
}

const userSlice = createSlice({
    name: 'guestBook',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getGuestBook.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(getGuestBook.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state[action.payload.account] = {
                        start: action.payload.start,
                        total: action.payload.total,
                        guestBook: action.payload.guestBook
                    }
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
            .addCase(getGuestBook.rejected, (state, action) => {
                if (state.loading) {
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            });
        builder
            .addCase(createGuestBook.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(createGuestBook.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state.msg = action.payload.msg;
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
            .addCase(createGuestBook.rejected, (state, action) => {
                if (state.loading) {
                    state.msg = action.payload.msg;
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
            ;
        builder
            .addCase(deleteGuestBook.fulfilled, (state, action) => {
                state.msg = action.payload.msg;
            });
    },
});

export default userSlice.reducer;