import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import caver from '../../components/chain/CaverChrome';
import Wallet from '../../components/chain/wallet/Wallet'
import axios from 'axios';
import dynamic from 'next/dynamic'

import farmerRankList from '../../src/data/farm/FarmerRankList';

import Chickcontract from '../../components/chain/contract/Chickcontract';

const initialState = {
    account: "", balance: 0, chickBalance: 0,
    isUser: false,
    isFirst: false,
    myId: null,
    myName: null,
    myIntro: null,
    myRepChickiz: null,
    myTwitter: null,
    myFarmSign: null,
    myFarmSkin: null,
    myRankNum: 0,
    msg: '',
    nameOverlap: false,
    network: null,

    klipRequestKey: '',
    klipQRModalBool: false,
};

let klaytn;

if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
    klaytn = window['klaytn'];
} else {
    klaytn = dynamic(() => window['klaytn'], { ssr: false })
}

export const connectWallet = createAsyncThunk(
    "myInfo/connectWallet",
    async (data) => {
        try {
            const { klipPopOn, klipPopOff } = data
            const account = await Wallet.login(klipPopOn, klipPopOff);

            return ({ account: account })
        } catch (err) {
            console.error(err)
        }
    }
)

export const getBalance = createAsyncThunk(
    "myInfo/getBalance",
    async (account) => {
        try {
            const _balance = await caver.klay.getBalance(account);
            let balance = Number(caver.utils.fromPeb(_balance, 'KLAY'))
            if (_balance.toString() === '-1') {
                balance = -1;
            }

            const chick = new Chickcontract();
            const _chickbalance = await chick.getBalance(account);
            const chickbalance = Number(caver.utils.fromPeb(_chickbalance, 'KLAY'));

            return { balance: balance, chickBalance: chickbalance }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNetwork = createAsyncThunk(
    "myInfo/getNetwork",
    async () => {
        try {
            const network = await Wallet.loadNetwork();
            return { network: network }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyInfo = createAsyncThunk(
    "myInfo/getMyInfo",
    async (account) => {
        try {
            const res1 = await axios.post('/api/db/user/isUser', { address: account })
            let res2;
            if (res1.data.isUser) {
                res2 = await axios.post('/api/db/user/getUserInfo', { address: account });
            } else {
                return {
                    isUser: false,
                    isFirst: true,
                    myId: null,
                    myName: null,
                    myIntro: null,
                    myRepChickiz: null,
                    myTwitter: null,
                    myFarmSign: null,
                    myFarmSkin: null,
                    myRankNum: 0,
                    lastCheck: null,
                }
            }

            const _userRankNum = getUserRankNum(res2.data[0].chickizQuan);

            return {
                isUser: res1.data.isUser,
                isFirst: false,
                myId: res2.data[0].id,
                myName: res2.data[0].name,
                myIntro: res2.data[0].intro,
                myRepChickiz: res2.data[0].repChickiz,
                myTwitter: res2.data[0].twitter,
                myFarmSign: res2.data[0].farmSign,
                myFarmSkin: res2.data[0].farmSkin,
                myRankNum: _userRankNum,
                lastCheck: res2.data[0].lastCheck,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const signUp = createAsyncThunk(
    "myInfo/signUp",
    async (data) => {
        try {
            const res = await axios.post('/api/db/user/createUser', { address: data.account, name: data.name, sign: data.sign })
            console.log(res)
            return { msg: res.data.msg, bool: false }
        } catch (err) {
            console.error(err)
        }
    }
)

export const checkName = createAsyncThunk(
    "myInfo/checkName",
    async (name) => {
        try {
            const nameRes = await checkValidName(name)
            if (nameRes === "사용 가능한 닉네임 입니다.") {
                return { msg: nameRes, bool: true }
            } else {
                return { msg: nameRes, bool: false }
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateUinfo = createAsyncThunk(
    "myInfo/updateUinfo",
    async (data) => {
        try {
            const { account, nickname, twitter, intro, repChickiz, farmSign, sign } = data;
            const res = await axios.post('/api/db/user/updateUinfo',
                {
                    address: account,
                    name: nickname,
                    twitter: twitter,
                    intro: intro,
                    repChickiz: repChickiz,
                    farmSign: farmSign,
                    sign: sign
                })
            return ({ msg: res.data.msg })
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateLastCheck = createAsyncThunk(
    "myInfo/updateLastCheck",
    async (account) => {
        try {
            const res = await axios.post('/api/db/user/updateLastCheck', { address: account })

            return { now: res.data.now }
        } catch (err) {
            console.error(err);
        }
    }
)

async function checkValidName(name) {
    const res = await axios.post('/api/db/user/checkName', { name: name })
    return res.data.msg;
}

function getUserRankNum(chickizQuan) {
    for (let i = 0; i < farmerRankList.length; i++) {
        if (farmerRankList[i].min <= chickizQuan && chickizQuan <= farmerRankList[i].max) {
            return i
        }
    }
}

const userSlice = createSlice({
    name: 'myInfo',
    initialState,
    reducers: {
        resetMyInfo(state) {
            state.balance = 0;
            state.chickBalance = 0;
            state.isUser = false;
            state.isFirst = false;
            state.myId = null;
            state.myName = null;
            state.myIntro = null;
            state.myRepChickiz = null;
            state.myTwitter = null;
            state.myFarmSign = null;
            state.myFarmSkin = null;
            state.myRankNum = 0;
        }
    },
    extraReducers: builder => {
        builder.addCase(connectWallet.fulfilled, (state, action) => {
            state.account = action.payload.account;
        });
        builder.addCase(getBalance.fulfilled, (state, action) => {
            state.balance = action.payload.balance;
            state.chickBalance = action.payload.chickBalance;
        });
        builder.addCase(getNetwork.fulfilled, (state, action) => {
            state.network = action.payload.network;
        });
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            state.isUser = action.payload.isUser;
            state.isFirst = action.payload.isFirst;
            state.myId = action.payload.myId;
            state.myName = action.payload.myName;
            state.myIntro = action.payload.myIntro;
            state.myRepChickiz = action.payload.myRepChickiz;
            state.myTwitter = action.payload.myTwitter;
            state.myFarmSign = action.payload.myFarmSign;
            state.myFarmSkin = action.payload.myFarmSkin;
            state.myRankNum = action.payload.myRankNum;
            state.lastCheck = action.payload.lastCheck;
        })
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
            state.nameOverlap = action.payload.bool;
        })
        builder.addCase(checkName.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
            state.nameOverlap = action.payload.bool;
        })
        builder.addCase(updateUinfo.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
            state.nameOverlap = false;
        })
        builder.addCase(updateLastCheck.fulfilled, (state, action) => {
            state.lastCheck = action.payload.now;
        })
    },
});

export const { resetMyInfo } = userSlice.actions;
export default userSlice.reducer;