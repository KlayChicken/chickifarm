import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { isLove: 0, loves: 0 };

export const getLove = createAsyncThunk(
    "love/getLove",
    async (data) => {
        try {
            const { isUser, from, to } = data;
            let res;
            if (isUser) {
                res = await axios.post('/api/db/love/getLove', { fromAddress: from, toAddress: to })
            } else {
                res = await axios.post('/api/db/love/getLove', { fromAddress: null, toAddress: to })
            }

            return { isLove: res.data.love, loves: res.data.loves }
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateLove = createAsyncThunk(
    "love/updateLove",
    async (data) => {
        try {
            const { from, to, nowLove } = data
            const res = await axios.post('/api/db/love/updateLove',
                { fromAddress: from, toAddress: to, love: nowLove });
            return
        } catch (err) {
            console.error(err)
        }
    }
)

const loveSlice = createSlice({
    name: 'love',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getLove.fulfilled, (state, action) => {
            state.isLove = action.payload.isLove;
            state.loves = action.payload.loves;
        });
        builder.addCase(updateLove.fulfilled, (state, action) => {
        });
    },
});

export default loveSlice.reducer;