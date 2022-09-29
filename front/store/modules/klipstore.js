import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    klipRequestKey: '',
    klipQRModalBool: false,
};

//export const getLove = createAsyncThunk(
//    "love/getLove",
//    async (data) => {
//        try {
//            const { isUser, from, to } = data;
//            let res;
//            if (isUser) {
//                res = await axios.post('/api/db/love/getLove', { fromAddress: from, toAddress: to })
//            } else {
//                res = await axios.post('/api/db/love/getLove', { fromAddress: null, toAddress: to })
//            }
//
//            return { isLove: res.data.love, loves: res.data.loves }
//        } catch (err) {
//            console.error(err)
//        }
//    }
//)

const klipstoreSlice = createSlice({
    name: 'klipstore',
    initialState,
    reducers: {
        setRequestKey(state, action) {
            state.klipRequestKey = action.payload.rk;
        },
        setKlipModalBool(state, action) {
            state.klipQRModalBool = action.payload.kmo;
        }
    },
    //extraReducers: builder => {
    //    builder.addCase(getLove.fulfilled, (state, action) => {
    //        state.isLove = action.payload.isLove;
    //        state.loves = action.payload.loves;
    //    });
    //    builder.addCase(updateLove.fulfilled, (state, action) => {
    //    });
    //},
});

export const { setRequestKey, setKlipModalBool } = klipstoreSlice.actions;
export default klipstoreSlice.reducer;