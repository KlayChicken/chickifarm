import { bindActionCreators, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// contract 
import KIP17contract from '../../components/chain/contract/KIP17contract';
import KIP37contract from '../../components/chain/contract/KIP37contract';
import ContractAddress from '../../src/data/contract/ContractAddress';

import SignAndOrnament from '../../src/data/contract/SignAndOrnament';

// contract
const chickizContract = new KIP17contract(ContractAddress.chickiz);
const v1boneContract = new KIP17contract(ContractAddress.v1bone);
const v1sunsalContract = new KIP17contract(ContractAddress.v1sunsal);

const signContract = new KIP37contract(ContractAddress.sign);
const ornamentContract = new KIP37contract(ContractAddress.ornament);
const oilContract = new KIP37contract(ContractAddress.oil);

const initialState = {
    chickiz: [],
    sign: [],
    ornament: [],
    bone: [],
    sunsal: [],
    oil: 0,
    oliveOil: 0,
    nftFromChainLoading: false,
};

export const nftFromServer = createAsyncThunk(
    "nft/nftFromServer",
    async (account) => {
        try {
            const chickizList = await getChickiz(account);
            return { chickiz: chickizList }
        } catch (err) {
            console.error(err)
        }
    }
)

export const nftFromChain = createAsyncThunk(
    "nft/nftFromChain",
    async (account) => {
        try {
            const [signList, ornamentList, boneList, sunsalList] =
                await Promise.all([getSign(account), getOrnament(account), getBone(account), getSunsal(account)])
            const _oil = await getOil(account);
            return { sign: signList, ornament: ornamentList, bone: boneList, sunsal: sunsalList, oil: _oil.oil, oliveOil: _oil.olive }
        } catch (err) {
            console.error(err)
        }
    }
)

//nftFromServer
async function getChickiz(account) {
    try {
        const res = await axios.post('/api/db/nft/getChickizList', { address: account })
        return res.data.chickizArray;
    } catch (err) {
        console.error(err)
    }
}

// nftFromChain
async function getSign(account) {
    const _signList = [];
    const _signName = SignAndOrnament.signName;
    for (let i = 0; i < _signName.length; i++) {
        const _signBalance = await signContract.getBalance(account, i);
        if (_signBalance > 0) {
            _signList.push({ tokenId: i, name: _signName[i], quan: _signBalance })
        }
    }

    return _signList
}

async function getOrnament(account) {
    const _ornamentList = []
    const _ornamentName = SignAndOrnament.ornamentName1;

    for (let i = 0; i < _ornamentName.length; i++) {
        const _ornamentBalance = await ornamentContract.getBalance(account, i)
        if (_ornamentBalance > 0) {
            _ornamentList.push({ tokenId: i, name: _ornamentName[i], quan: _ornamentBalance })
        }
    }

    // from Token Number = 1001
    const _ornamentName2 = SignAndOrnament.ornamentName2;

    for (let i = 1001; i < 1001 + _ornamentName2.length; i++) {
        const _ornamentBalance = await ornamentContract.getBalance(account, i)
        if (_ornamentBalance > 0) {
            _ornamentList.push({ tokenId: i, name: _ornamentName2[Number(i - 1001)], quan: _ornamentBalance })
        }
    }

    return _ornamentList
}

async function getOil(account) {
    const oilQuan = await oilContract.getBalance(account, 2001);
    const oliveOilQuan = await oilContract.getBalance(account, 2002);
    return ({ oil: Number(oilQuan), olive: Number(oliveOilQuan) })
}

async function getBone(account) {
    return (await v1boneContract.getList(account))
}

async function getSunsal(account) {
    return (await v1sunsalContract.getList(account))
}

const nftSlice = createSlice({
    name: 'nft',
    initialState,
    reducers: {
        resetMyNFT(state) {
            state.chickiz = [];
            state.sign = [];
            state.ornament = [];
            state.bone = [];
            state.sunsal = [];
            state.oil = 0;
            state.oliveOil = 0;
            state.nftFromChainLoading = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(nftFromServer.fulfilled, (state, action) => {
            state.chickiz = action.payload.chickiz;
        });
        builder
            .addCase(nftFromChain.pending, (state, action) => {
                state.nftFromChainLoading = true;
            })
            .addCase(nftFromChain.fulfilled, (state, action) => {
                state.sign = action.payload.sign;
                state.ornament = action.payload.ornament;
                state.bone = action.payload.bone;
                state.sunsal = action.payload.sunsal;
                state.oil = action.payload.oil;
                state.oliveOil = action.payload.oliveOil;
                state.nftFromChainLoading = false;
            })
            .addCase(nftFromChain.rejected, (state, action) => {
                state.sign = [];
                state.ornament = [];
                state.bone = [];
                state.sunsal = [];
                state.oil = 0;
                state.oliveOil = 0;
                state.nftFromChainLoading = false;
            })
    },
});

export const { resetMyNFT } = nftSlice.actions;
export default nftSlice.reducer;