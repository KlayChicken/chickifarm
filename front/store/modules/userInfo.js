import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

import farmerRankList from '../../src/data/farm/FarmerRankList';

const initialState = { lastAccount: '' };

export const getJustName = createAsyncThunk(
    'userInfo/getJustName',
    async (_account) => {
        try {
            const res = await axios.post('/api/db/user/getJustName', { address: _account })
            return (res.data.userName)
        } catch (err) {
            console.error(err)
        }
    }
)

export const getUserInfo = createAsyncThunk(
    "userInfo/getUserInfo",
    async (_account) => {
        try {
            const res1 = await axios.post('/api/db/user/isUser', { address: _account })
            let res2;
            if (res1.data.isUser) {
                res2 = await axios.post('/api/db/user/getUserInfo', { address: _account });
            } else {
                return { account: _account, isUser: res1.data.isUser }
            }

            const _userRankNum = getUserRankNum(res2.data[0].chickizQuan);

            return {
                account: _account,
                isUser: res1.data.isUser,
                userId: res2.data[0].id,
                userName: res2.data[0].name,
                userIntro: res2.data[0].intro,
                repChickiz: res2.data[0].repChickiz,
                userTwitter: res2.data[0].twitter,
                userFarmSign: res2.data[0].farmSign,
                userFarmSkin: res2.data[0].farmSkin,
                userChickizQuan: res2.data[0].chickizQuan,
                userRankNum: _userRankNum,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

function getUserRankNum(chickizQuan) {
    for (let i = 0; i < farmerRankList.length; i++) {
        if (farmerRankList[i].min <= chickizQuan && chickizQuan <= farmerRankList[i].max) {
            return i
        }
    }
}

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getJustName.fulfilled, (state, action) => {

        });
        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            state.lastAccount = action.payload.account;
            if (action.payload.isUser) {
                state[action.payload.account] = {
                    isUser: action.payload.isUser,
                    userName: action.payload.userName,
                    userId: action.payload.userId,
                    userIntro: action.payload.userIntro,
                    repChickiz: action.payload.repChickiz,
                    userTwitter: action.payload.userTwitter,
                    userFarmSign: action.payload.userFarmSign,
                    userFarmSkin: action.payload.userFarmSkin,
                    userChickizQuan: action.payload.userChickizQuan,
                    userRankNum: action.payload.userRankNum,
                }
            } else {
                state[action.payload.account] = { isUser: action.payload.isUser }
            }
        });
        builder.addCase(HYDRATE, (state, action) => {
            if (action.payload.userInfo.lastAccount !== "") {
                state[action.payload.userInfo.lastAccount] =
                    action.payload.userInfo[action.payload.userInfo.lastAccount];
            }
        });
    },
});

//export const { increment, decrement } = userSlice.actions;
export default userSlice.reducer;