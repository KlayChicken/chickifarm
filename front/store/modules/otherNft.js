import { bindActionCreators, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// contract 
import KIP17contract from '../../components/chain/contract/KIP17contract';
import OtherNFTProjectList from '../../src/data/contract/OtherNFTProjectList';

// contract
const contractList = {}

for (let i = 0; i < OtherNFTProjectList.length; i++) {
    contractList[OtherNFTProjectList[i].name] = new KIP17contract(OtherNFTProjectList[i].address)
}


const initialState = {
    otherNFTBalances: [],
    otherNFTBalances_loading: false,
    otherNFT_onStage: null,
    otherNFTList: [],
    otherNFTList_loading: false,
};

export const getOtherNFTBalances = createAsyncThunk(
    "otherNft/getOtherNFTBalances",
    async (account, { getState, requestId }) => {
        try {
            const { otherNFTBalances_loading, currentRequestId_otherNFTBalances } = getState().otherNft;
            if (!otherNFTBalances_loading || requestId !== currentRequestId_otherNFTBalances) return;

            const contractNames = [];
            const contractPromises = [];
            const contractBalances = [];

            for (const value in contractList) {
                contractNames.push(value);
                contractPromises.push(makePromise_getBalance(contractList[value], account));
            }

            const _contractBalances = await Promise.all(contractPromises);

            for (let i = 0; i < _contractBalances.length; i++) {
                if (_contractBalances[i] > 0) {
                    contractBalances.push({
                        name: contractNames[i],
                        balance: _contractBalances[i]
                    })
                }
            }

            return { balances: contractBalances }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getOtherNFTList = createAsyncThunk(
    "otherNft/getOtherNFTList",
    async (data, { getState, requestId }) => {
        try {
            const { account, projectName } = data;
            const { otherNFTList, otherNFTList_loading, currentRequestId_otherNFTList } = getState().otherNft;

            // 로딩중이 아니거나(pending에서 로딩중으로 변경돼야하니깐) requestId가 다르면 return. 중복된 요청 방지.
            if (!otherNFTList_loading || requestId !== currentRequestId_otherNFTList) return;

            let indexNum;
            const alreadyList = otherNFTList.filter((list, index) => {
                if (list.name === projectName) {
                    indexNum = index;
                }
                return (list.name === projectName)
            });

            if (alreadyList.length > 0) {
                const already = alreadyList[0];
                if (already.list.length === already.meta.length) {
                    return { pushWay: 2, nftName: projectName }
                } else {
                    const newMeta = await getNFTMeta(contractList[projectName], already.list.slice(already.start, already.start + 9));
                    return { pushWay: 1, nftName: projectName, newStart: already.start + 9, newMeta: newMeta, indexNum: indexNum }
                }

            }

            const _nft = {}
            _nft.name = projectName;
            _nft.list = await getNFTList(contractList[projectName], account);
            _nft.meta = await getNFTMeta(contractList[projectName], _nft.list.slice(0, 18));
            _nft.start = 18;

            const etcInfo = findProject(OtherNFTProjectList, projectName)

            _nft.address = etcInfo.address;
            _nft.twitter = etcInfo.twitterUrl;
            _nft.discord = etcInfo.discordUrl;

            return { pushWay: 0, nft: _nft }
        } catch (err) {
            console.error(err)
        }
    }
)

async function makePromise_getBalance(contract, account) {
    return new Promise((resolve) => {
        resolve(contract.getBalanceOf(account))
    })
}

function findProject(targetArray, name) {
    return targetArray.filter((project) => project.name === name)[0];
}

async function getNFTList(contract, account) {
    return (await contract.getList(account))
}

async function getNFTMeta(contract, list) {
    return (await contract.getMetaData(list))
}

const otherNftSlice = createSlice({
    name: 'otherNft',
    initialState,
    reducers: {
        resetOtherNFT(state) {
            state.otherNFT_onStage = null;
            state.otherNFTBalances = [];
            state.otherNFTList = [];
            state.otherNFTBalances_loading = false;
            state.otherNFTList_loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getOtherNFTBalances.pending, (state, action) => {
                if (!state.otherNFTBalances_loading) {
                    state.otherNFTBalances_loading = true;

                    state.currentRequestId_otherNFTBalances = action.meta.requestId;
                }
            })
            .addCase(getOtherNFTBalances.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.otherNFTBalances_loading && state.currentRequestId_otherNFTBalances === requestId) {
                    state.otherNFTBalances = action.payload.balances;
                    state.otherNFTBalances_loading = false;

                    state.currentRequestId_otherNFTBalances = undefined
                }
            })
            .addCase(getOtherNFTBalances.rejected, (state, action) => {
                if (state.otherNFTBalances_loading) {
                    state.otherNFTBalances_loading = false;

                    state.currentRequestId_otherNFTBalances = undefined
                }
            })
        builder
            .addCase(getOtherNFTList.pending, (state, action) => {
                if (!state.otherNFTList_loading) {
                    state.otherNFTList_loading = true;

                    state.currentRequestId_otherNFTList = action.meta.requestId;
                }
            })
            .addCase(getOtherNFTList.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.otherNFTList_loading && state.currentRequestId_otherNFTList === requestId) {
                    if (action.payload.pushWay === 0) {
                        state.otherNFTList.push(action.payload.nft);
                        state.otherNFT_onStage = action.payload.nft.name;
                        state.otherNFTList_loading = false;

                        state.currentRequestId_otherNFTList = undefined
                    } else if (action.payload.pushWay === 1) {
                        state.otherNFTList[action.payload.indexNum].start = action.payload.newStart;
                        state.otherNFTList[action.payload.indexNum].meta.push(...action.payload.newMeta);
                        state.otherNFT_onStage = action.payload.nftName;
                        state.otherNFTList_loading = false;

                        state.currentRequestId_otherNFTList = undefined
                    } else if (action.payload.pushWay === 2) {
                        state.otherNFT_onStage = action.payload.nftName;
                        state.otherNFTList_loading = false;

                        state.currentRequestId_otherNFTList = undefined
                    }
                }
            })
            .addCase(getOtherNFTList.rejected, (state, action) => {
                if (state.otherNFTList_loading) {
                    state.otherNFTList_loading = false;

                    state.currentRequestId_otherNFTList = undefined
                }
            })
    },
});

export const { resetOtherNFT } = otherNftSlice.actions;
export default otherNftSlice.reducer;