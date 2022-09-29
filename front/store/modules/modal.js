import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    smallModalBool: false,
    msg: '',
    modalTemplate: '',
    confirmState: false,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setSmallModalBool(state, action) {
            state.smallModalBool = action.payload.bool;
            state.msg = action.payload.msg;
            state.modalTemplate = action.payload.modalTemplate;
        },
        setConfirmState(state, action) {
            state.confirmState = action.payload.confirmState;
        }
    },
    extraReducers: builder => {

    },
});

export const { setSmallModalBool, setConfirmState } = modalSlice.actions;
export default modalSlice.reducer;