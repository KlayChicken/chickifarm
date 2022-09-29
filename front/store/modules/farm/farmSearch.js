import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import farmerRankList from '../../../src/data/farm/FarmerRankList';

const initialState = {
    page: 1,
    endNum: 1265,
    sortWay: 3,
    searchWord: "",
    userArray: [],
    rndArray: [],
    onlyNeighbor: false,
    filterFarmerRank: "",
    filterFarmSign: ""
};

export const getRndFarmList = createAsyncThunk(
    "farmSearch/getRndFarmList",
    async () => {
        try {
            const res = await axios.post('/api/db/farm/getRndFarmList')

            return {
                _rndArray: res.data.rndArray,
            }
        } catch (err) {
            console.log(err)
        }
    }
)


export const getFarmList = createAsyncThunk(
    "farmSearch/getFarmList",
    async (data) => {
        try {
            const { page, sortWay, searchWord, farmerRank, farmSign } = data

            const filterInfo = setFilterInfo(farmerRank, farmSign);
            const res = await getFarmListFromServer((page - 1) * 8, sortWay, searchWord, filterInfo)
            const _userArray = res.userArray;
            _userArray.map(a => {
                a.rankNum = getUserRankNum(a.chickizQuan)
            })
            return {
                page: page,
                userArray: _userArray,
                total: res.total,
                sortWay: sortWay,
                searchWord: searchWord,
                farmerRank: farmerRank,
                farmSign: farmSign
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getNeighborFarmList = createAsyncThunk(
    "farmSearch/getNeighborFarmList",
    async (data) => {

        try {
            const { account, page, sortWay, searchWord, farmerRank, farmSign } = data

            const filterInfo = setFilterInfo(farmerRank, farmSign);
            const res = await getFarmListFromServer_onlyNeighbor((page - 1) * 8, sortWay, searchWord, filterInfo, account)
            const _userArray = res.userArray;
            _userArray.map(a => {
                a.rankNum = getUserRankNum(a.chickizQuan)
            })
            return {
                page: page,
                userArray: _userArray,
                total: res.total,
                sortWay: sortWay,
                searchWord: searchWord,
                farmerRank: farmerRank,
                farmSign: farmSign
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const resetFilter = createAsyncThunk(
    "farmSearch/resetFilter",
    async () => {
        const res = await getFarmListFromServer(0, 3, '', {})
        const _userArray = res.userArray;
        _userArray.map(a => {
            a.rankNum = getUserRankNum(a.chickizQuan)
        })
        return { userArray: _userArray, total: res.total }
    }
)

async function getFarmListFromServer(startNum, sortWay, searchWord, filterInfo) {
    const res = await axios.post('/api/db/farm/getFarmList',
        { start: startNum, sortWay: sortWay, searchWord: "%" + searchWord + "%", filter: filterInfo })
    return res.data;
}

async function getFarmListFromServer_onlyNeighbor(startNum, sortWay, searchWord, filterInfo, account) {
    const res = await axios.post('/api/db/farm/getOnlyNeighborFarmList',
        { start: startNum, sortWay: sortWay, searchWord: "%" + searchWord + "%", filter: filterInfo, myAddress: account })
    return res.data;
}

function getUserRankNum(chickizQuan) {
    for (let i = 0; i < farmerRankList.length; i++) {
        if (farmerRankList[i].min <= chickizQuan && chickizQuan <= farmerRankList[i].max) {
            return i
        }
    }
}

function setFilterInfo(farmRank, farmSign) {
    let filter = {};

    if (farmRank !== '') {
        filter.chickizQuanMin = Number(farmerRankList[farmRank].min)
        filter.chickizQuanMax = Number(farmerRankList[farmRank].max)
    }
    if (farmSign !== '') {
        filter.farmSign = Number(farmSign)
    }

    return filter
}

const farmSearchSlice = createSlice({
    name: 'farmSearch',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFarmList.fulfilled, (state, action) => {
            state.endNum = action.payload.total;
            state.userArray = action.payload.userArray;
            state.page = action.payload.page;
            state.sortWay = action.payload.sortWay;
            state.searchWord = action.payload.searchWord;
            state.onlyNeighbor = false;
            state.filterFarmerRank = action.payload.farmerRank;
            state.filterFarmSign = action.payload.farmSign;
        });
        builder.addCase(getNeighborFarmList.fulfilled, (state, action) => {
            state.endNum = action.payload.total;
            state.userArray = action.payload.userArray;
            state.page = action.payload.page;
            state.sortWay = action.payload.sortWay;
            state.searchWord = action.payload.searchWord;
            state.onlyNeighbor = true;
            state.filterFarmerRank = action.payload.farmerRank;
            state.filterFarmSign = action.payload.farmSign;
        });
        builder.addCase(getRndFarmList.fulfilled, (state, action) => {
            state.rndArray = action.payload._rndArray;
        });
        builder.addCase(resetFilter.fulfilled, (state, action) => {
            state.endNum = action.payload.total;
            state.userArray = action.payload.userArray;
            state.page = 1;
            state.sortWay = 3;
            state.searchWord = '';
            state.onlyNeighbor = false;
            state.filterFarmerRank = '';
            state.filterFarmSign = '';
        })
    },
});

//export const { increment, decrement } = userSlice.actions;
export default farmSearchSlice.reducer;