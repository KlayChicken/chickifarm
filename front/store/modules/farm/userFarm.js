import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

const initialState = { msg: '', lastAccount: '' };

export const getFarmPosition = createAsyncThunk(
    "userFarm/getFarmPosition",
    async (_account) => {
        try {
            const chickizPosition = await getChickizPosition(_account);
            const ornamentPosition = await getOrnamentPosition(_account);
            return {
                account: _account,
                chickizPosition: chickizPosition,
                ornamentPosition: ornamentPosition
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateFarmPosition = createAsyncThunk(
    "userFarm/updateFarmPosition",
    async (data) => {
        try {
            const { chickiz, ornament, account, farmFinal, sign } = data
            const msg = await savePosition(chickiz, ornament, account, farmFinal, sign)
            return { msg: msg }
        } catch (err) {
            console.error(err)
        }
    }
)

async function getChickizPosition(_account) {
    try {
        const res = await axios.post('/api/db/farm/getChickizPosition', { address: _account });
        return res.data.chickizPosition;
    } catch (err) {
        console.error(err)
    }
}

async function getOrnamentPosition(_account) {
    try {
        const res = await axios.post('/api/db/farm/getOrnamentPosition', { address: _account });
        return res.data.ornamentPosition;
    } catch (err) {
        console.error(err)
    }
}

async function savePosition(chickiz, ornament, account, farmFinal, sign) {
    try {
        const res = await axios.post('/api/db/farm/updateFarm', { chickizPosition: chickiz, ornamentPosition: ornament, address: account, farmSkin: farmFinal, sign: sign });
        console.log(res)
        return res.data.msg;
    } catch (err) {
        console.error(err)
    }
}



const userSlice = createSlice({
    name: 'userFarm',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFarmPosition.fulfilled, (state, action) => {
            state[action.payload.account] = {
                chickizPosition: action.payload.chickizPosition,
                ornamentPosition: action.payload.ornamentPosition
            };
            state.lastAccount = action.payload.account;
        })
        builder.addCase(updateFarmPosition.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
        })
        builder.addCase(HYDRATE, (state, action) => {
            if (action.payload.userFarm.lastAccount !== "") {
                state[action.payload.userFarm.lastAccount] =
                    action.payload.userFarm[action.payload.userFarm.lastAccount];
            }
        });
    },
});

export default userSlice.reducer;