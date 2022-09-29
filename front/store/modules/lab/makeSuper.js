import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

// data
import OtherNFTProjectList from '../../../src/data/contract/OtherNFTProjectList';

// chain
import Rafflecontract from '../../../components/chain/contract/Rafflecontract';

const initialState = {
    superList: [],
    msg: '',
};


// get
export const getSuperList = createAsyncThunk(
    "makeSuper/getSuperList",
    async (data) => {
        try {
            const res = await axios.post('/api/db/makeSuper/getSuperList')
            return {
                list: res.data.list
            }
        } catch (err) {
            console.error(err)
        }
    }
);


// create
export const makeSuperRequest = createAsyncThunk(
    "makeSuper/makeSuperRequest",
    async (data) => {
        try {
            const res = await axios.post('/api/db/makeSuper/makeSuperRequest', { id: data.id })
            return {
                msg: res.data.msg
            }
        } catch (err) {
            console.error(err)
        }
    }
);

const makeSuperSlice = createSlice({
    name: 'makeSuper',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(getSuperList.fulfilled, (state, action) => {
            state.superList = action.payload.list;
        });
        builder.addCase(makeSuperRequest.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
        });
    },
});

export default makeSuperSlice.reducer;