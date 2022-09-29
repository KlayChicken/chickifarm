import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

// data
import OtherNFTProjectList from '../../../src/data/contract/OtherNFTProjectList';

// chain
import Rafflecontract from '../../../components/chain/contract/Rafflecontract';

const initialState = {
    sortWay: 0,
    searchWord: '',
    filterRaffleStatus: 0,
    filterRaffleCollection: '',
    cursor: '',
    raffleList: [],
    loading: false,

    loading_more: false,
    getDone: false,

    msg: '',

    // buyer
    buyQuan: '',
    buyerList: [],
    getDone_buyer: false,
    cursor_buyer: '',
    loading_buyer: false,

    // raffleDetail
    loading_raffleDetail: false,
    raffleDetail: {},
    raffleDetail_twitter: '',
    raffleDetail_discord: '',

    loading_raffleDetail_chain: false,
    raffleDetail_rafflerClaim: true,
    raffleDetail_winnerClaim: true,
    raffleDetail_soldTickets: '',
};


// get
export const getRaffleList_first = createAsyncThunk(
    "raffle/getRaffleList_first",
    async (data, { getState, requestId }) => {
        try {
            const _raffle = getState().raffle;

            if (!_raffle.loading || requestId !== _raffle.currentRequestId) return;

            const res = await axios.post('/api/db/raffle/getRaffleList',
                {
                    searchWord: "%" + data.searchWord + "%",
                    sortWay: data.sortWay,
                    sortStatus: data.filterRaffleStatus,
                    sortCollection: data.filterRaffleCollection,
                    cursor: '',
                })


            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                searchWord: data.searchWord,
                sortWay: data.sortWay,
                filterRaffleStatus: data.filterRaffleStatus,
                filterRaffleCollection: data.filterRaffleCollection,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)
export const getRaffleList_more = createAsyncThunk(
    "raffle/getRaffleList_more",
    async (data, { getState, requestId }) => {
        try {
            const _raffle = getState().raffle;

            if (!_raffle.loading_more || requestId !== _raffle.currentRequestId_more || _raffle.getDone) return;

            const res = await axios.post('/api/db/raffle/getRaffleList',
                {
                    searchWord: "%" + _raffle.searchWord + "%",
                    sortWay: _raffle.sortWay,
                    sortStatus: _raffle.filterRaffleStatus,
                    sortCollection: _raffle.filterRaffleCollection,
                    cursor: _raffle.cursor,
                })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                raffleList: raffleList,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getSingleRaffle = createAsyncThunk(
    'raffle/getSingleRaffle',
    async (data) => {
        try {
            const res = await axios.post('/api/db/raffle/getSingleRaffle', { raffleId: data.raffleId })
            const _raffleDetail = res.data.raffleDetail;
            const info = OtherNFTProjectList.filter((each) => each.address.toUpperCase() === _raffleDetail.nftAddress.toUpperCase())[0];

            _raffleDetail.nftMeta = JSON.parse(res.data.raffleDetail.nftMeta)

            return {
                raffleDetail: _raffleDetail,
                twitter: info.twitterUrl,
                discord: info.discordUrl,
            }
        } catch (err) {
            console.error(err);
        }
    }
)

export const getSingleRaffle_chain = createAsyncThunk(
    'raffle/getSingleRaffle_chain',
    async (data, { getState, requestId }) => {
        try {
            const raffleCon = new Rafflecontract();

            const { raffleDetail } = getState().raffle;
            const { isUser, account } = data;
            let soldTickets;

            if (raffleDetail.raffleStatus === 0 || raffleDetail.raffleStatus === 2) {
                soldTickets = await raffleCon.getSoldTickets(raffleDetail.id);
            } else if (isUser && account.toUpperCase() === raffleDetail.raffler.toUpperCase()) {
                soldTickets = await raffleCon.getSoldTickets(raffleDetail.id);
            } else {
                soldTickets = raffleDetail.ticketSell;
            }

            let rafflerClaim = true;
            let winnerClaim = true;

            if (raffleDetail.raffleStatus === 1) {
                if (isUser && account.toUpperCase() === raffleDetail.raffler.toUpperCase()) {
                    rafflerClaim = await raffleCon.getClaimByRaffler(raffleDetail.id);
                }
            } else if (raffleDetail.raffleStatus === 3) {
                if (isUser && account.toUpperCase() === raffleDetail.raffler.toUpperCase()) {
                    rafflerClaim = await raffleCon.getClaimByRaffler(raffleDetail.id);
                } else if (isUser && account.toUpperCase() === raffleDetail.winner.toUpperCase()) {
                    winnerClaim = await raffleCon.getClaimByWinner(raffleDetail.id);
                }
            }

            return {
                soldTickets: soldTickets,
                rafflerClaim: rafflerClaim,
                winnerClaim: winnerClaim,
            }
        } catch (err) {
            console.error(err);
        }
    }
)

export const getBuyerList_first = createAsyncThunk(
    "raffle/getBuyerList_first",
    async (data, { getState, requestId }) => {
        try {
            const { loading_buyer, currentRequestId_buyer } = getState().raffle;

            if (!loading_buyer || requestId !== currentRequestId_buyer) return;

            const res = await axios.post('/api/db/raffle/getBuyerList', { raffleId: data.raffleId, cursor: '' });

            let _getDone = false;

            if (res.data.buyerList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                buyerList: res.data.buyerList,
                buyQuan: res.data.buyQuan,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getBuyerList_more = createAsyncThunk(
    "raffle/getBuyerList_more",
    async (data, { getState, requestId }) => {
        try {
            const { cursor_buyer, getDone_buyer, loading_buyer, currentRequestId_buyer } = getState().raffle;

            if (!loading_buyer || requestId !== currentRequestId_buyer || getDone_buyer) return;

            const res = await axios.post('/api/db/raffle/getBuyerList', { raffleId: data.raffleId, cursor: cursor_buyer });

            let _getDone = false;

            if (res.data.buyerList.length < 12) {
                _getDone = true
            }

            return {
                cursor: res.data.cursor,
                buyerList: res.data.buyerList,
                buyQuan: res.data.buyQuan,
                getDone: _getDone,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

// make transaction
export const createRaffle = createAsyncThunk(
    "raffle/createRaffle",
    async (data) => {
        try {
            const res = await axios.post('/api/db/raffle/createRaffle')
            return {
                msg: res.data.msg
            }
        } catch (err) {
            console.error(err)
        }
    }
);

export const buyRaffleTicket = createAsyncThunk(
    "raffle/buyRaffleTicket",
    async (data) => {
        try {
            const res = await axios.post('/api/db/raffle/buyTicket', { buyer: data.buyer, raffleId: data.raffleId })

            return {
                msg: res.data.msg,
            }
        } catch (err) {
            console.error(err)
        }
    }
)

export const resetFilter = createAsyncThunk(
    "raffle/resetFilter",
    async (data, { getState, requestId }) => {
        try {
            const _raffle = getState().raffle;

            if (!_raffle.loading || requestId !== _raffle.currentRequestId) return;

            const res = await axios.post('/api/db/raffle/getRaffleList', { searchWord: "%%", sortWay: 0, sortStatus: 0, sortCollection: "", cursor: '' })

            let _getDone = false;

            const raffleList = res.data.raffleList;
            raffleList.map((a) => {
                a.nftMeta = JSON.parse(a.nftMeta)
                return a
            })

            if (res.data.raffleList.length < 12) {
                _getDone = true
            }


            return {
                raffleList: raffleList,
                getDone: _getDone
            }
        } catch (err) {
            console.error(err)
        }
    }
)

const raffleSlice = createSlice({
    name: 'raffle',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        // get
        builder
            .addCase(getRaffleList_first.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(getRaffleList_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state.cursor = action.payload.cursor;
                    state.raffleList = action.payload.raffleList;
                    state.searchWord = action.payload.searchWord;
                    state.sortWay = action.payload.sortWay;
                    state.filterRaffleStatus = action.payload.filterRaffleStatus;
                    state.filterRaffleCollection = action.payload.filterRaffleCollection;
                    state.getDone = action.payload.getDone;
                    state.loading = false;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(getRaffleList_first.rejected, (state, action) => {
                if (state.loading) {
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            });
        builder
            .addCase(getRaffleList_more.pending, (state, action) => {
                if (!state.loading_more) {
                    state.loading_more = true;
                    state.currentRequestId_more = action.meta.requestId;
                }
            })
            .addCase(getRaffleList_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_more && state.currentRequestId_more === requestId && !state.getDone) {
                    state.cursor = action.payload.cursor;
                    state.raffleList.push(...action.payload.raffleList);
                    state.getDone = action.payload.getDone;

                    state.loading_more = false;
                    state.currentRequestId_more = undefined;
                }
            })
            .addCase(getRaffleList_more.rejected, (state, action) => {
                if (state.loading_more) {
                    state.loading_more = false;
                    state.currentRequestId_more = undefined
                }
            })
        builder
            .addCase(getBuyerList_first.pending, (state, action) => {
                if (!state.loading_buyer) {
                    state.loading_buyer = true;
                    state.currentRequestId_buyer = action.meta.requestId;
                }
            })
            .addCase(getBuyerList_first.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buyer && state.currentRequestId_buyer === requestId) {
                    state.cursor_buyer = action.payload.cursor;
                    state.buyerList = action.payload.buyerList;
                    state.buyQuan = action.payload.buyQuan;
                    state.getDone_buyer = action.payload.getDone;

                    state.loading_buyer = false;
                    state.currentRequestId_buyer = undefined;
                }
            })
            .addCase(getBuyerList_first.rejected, (state, action) => {
                if (state.loading_buyer) {
                    state.loading_buyer = false;
                    state.currentRequestId_buyer = undefined
                }
            });
        builder
            .addCase(getBuyerList_more.pending, (state, action) => {
                if (!state.loading_buyer) {
                    state.loading_buyer = true;
                    state.currentRequestId_buyer = action.meta.requestId;
                }
            })
            .addCase(getBuyerList_more.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_buyer && state.currentRequestId_buyer === requestId && !state.getDone_buyer) {
                    state.cursor_buyer = action.payload.cursor;
                    state.buyerList.push(...action.payload.buyerList)
                    state.buyQuan = action.payload.buyQuan;
                    state.getDone_buyer = action.payload.getDone;

                    state.loading_buyer = false;
                    state.currentRequestId_buyer = undefined;
                }
            })
            .addCase(getBuyerList_more.rejected, (state, action) => {
                if (state.loading_buyer) {
                    state.loading_buyer = false;
                    state.currentRequestId_buyer = undefined
                }
            });
        builder
            .addCase(getSingleRaffle.pending, (state, action) => {
                state.loading_raffleDetail = true;
            })
            .addCase(getSingleRaffle.fulfilled, (state, action) => {
                state.loading_raffleDetail = false;
                state.raffleDetail = action.payload.raffleDetail;
                state.raffleDetail_twitter = action.payload.twitter;
                state.raffleDetail_discord = action.payload.discord;
            })
            .addCase(getSingleRaffle.rejected, (state, action) => {
                state.loading_raffleDetail = false;
            });
        builder
            .addCase(getSingleRaffle_chain.pending, (state, action) => {
                state.loading_raffleDetail_chain = true;
            })
            .addCase(getSingleRaffle_chain.fulfilled, (state, action) => {
                state.loading_raffleDetail_chain = false;
                state.raffleDetail_soldTickets = action.payload.soldTickets;
                state.raffleDetail_rafflerClaim = action.payload.rafflerClaim;
                state.raffleDetail_winnerClaim = action.payload.winnerClaim;
            })
            .addCase(getSingleRaffle_chain.rejected, (state, action) => {
                state.loading_raffleDetail_chain = false;
            });

        // create
        builder.addCase(createRaffle.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
        });
        builder.addCase(buyRaffleTicket.fulfilled, (state, action) => {
            state.msg = action.payload.msg;
        });
        builder
            .addCase(resetFilter.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(resetFilter.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state.raffleList = action.payload.raffleList;
                    state.loading = false;
                    state.getDone = action.payload.getDone;

                    state.sortWay = 0;
                    state.searchWord = '';
                    state.filterRaffleStatus = 0;
                    state.filterRaffleCollection = '';

                    state.currentRequestId = undefined;
                }
            })
            .addCase(resetFilter.rejected, (state, action) => {
                if (!state.loading) {
                    state.loading = false;
                    state.currentRequestId = undefined;
                }
            })
    },
});

export default raffleSlice.reducer;