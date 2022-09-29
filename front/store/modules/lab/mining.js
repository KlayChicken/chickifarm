import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BigNumber } from 'ethers';
import caver from '../../../components/chain/CaverChrome';

// data
import miningRate from '../../../src/data/chickiz/miningRate';

//contract
import Miningcontract from '../../../components/chain/contract/Miningcontract';

const mineContract = new Miningcontract();

const initialState = { sortBy: 1, info: [], loading_info: false, selected: [] };

const getMiningAmount = (cp, mentor) => {

    let base;
    let result;

    if (cp < 3) {
        base = miningRate.basic[cp];
    } else {
        base = miningRate.basic[cp - 3];
    }

    if (cp < 3) {
        if (mentor > 899) {
            result = base * 2;
        } else if (mentor > 0) {
            result = base * 1.2;
        } else {
            result = base;
        }
    } else {
        result = base * 3;
    }

    return result
}

const calculateOilTime = (_oilCharged, _cp) => {
    const now = Math.ceil(Date.now() / 1000);
    const _time = Number(_oilCharged) + 2592000 - now;
    if (_cp > 2) return 1
    if (_time < 0) return 0
    return (_time)
}

const sort = (list, _sort) => {
    const _list = [...list];
    switch (_sort) {
        case 0: // id desc
            _list.sort((a, b) => { return (b.id - a.id) })
            break;
        case 1: // id asc
            _list.sort((a, b) => { return (a.id - b.id) })
            break;
        case 2: // oil desc
            _list.sort((a, b) => { return (calculateOilTime(b.oilCharged, b.cp) - calculateOilTime(a.oilCharged, a.cp)) })
            break;
        case 3: // oil asc
            _list.sort((a, b) => { return (calculateOilTime(a.oilCharged, a.cp) - calculateOilTime(b.oilCharged, b.cp)) })
            break;
        case 4: // mentor
            _list.sort((a, b) => { return (b.mentor - a.mentor) })
            break;
        case 5: // super
            _list.sort((a, b) => { return (b.cp - a.cp) })
            break;
        case 6: // cp desc
            _list.sort((a, b) => { return (getMiningAmount(b.cp, b.mentor) - getMiningAmount(a.cp, a.mentor)) })
            break;
        case 7: // cp asc
            _list.sort((a, b) => { return (getMiningAmount(a.cp, a.mentor) - getMiningAmount(b.cp, b.mentor)) })
            break;
        case 8: // total desc
            _list.sort((a, b) => { return (Number(caver.utils.convertFromPeb(b.minable.toString(), 'KLAY')) - Number(caver.utils.convertFromPeb(a.minable.toString(), 'KLAY'))) })
            break;
        case 9: // total asc
            _list.sort((a, b) => { return (Number(caver.utils.convertFromPeb(a.minable.toString(), 'KLAY')) - Number(caver.utils.convertFromPeb(b.minable.toString(), 'KLAY'))) })
            break;
        default:
            break;
    }

    return _list;
}

export const getChickizInfo = createAsyncThunk(
    "mining/getChickizInfo",
    async (data, { getState, requestId }) => {
        try {
            const { chickiz } = getState().nft;
            const { loading_info, currentRequestId_info, sortBy } = getState().mining;

            if (!loading_info || requestId !== currentRequestId_info) return;

            const infos = await mineContract.getChickizInfos(chickiz);
            const minables = await mineContract.getMinables(chickiz);

            let list = [];

            for (let i = 0; i < chickiz.length; i++) {
                list.push({
                    id: chickiz[i],
                    cp: Number(infos[i]._cp),
                    mentor: Number(infos[i]._mentor),
                    mentorKind: Number(infos[i]._mentorKind),
                    oilCharged: Number(infos[i]._oilCharged),
                    lastMined: Number(infos[i]._lastMined),
                    minable: minables[i]
                })
            }

            const _list = sort(list, sortBy);

            return { list: _list }
        } catch (err) {
            console.error(err)
        }
    }
)

const miningSlice = createSlice({
    name: 'mining',
    initialState,
    reducers: {
        sortMining(state, action) {
            state.sortBy = action.payload.sortBy;
            state.info = sort(state.info, action.payload.sortBy);
        },
        addSelected(state, action) {
            const _id = action.payload.id;
            const _arr = state.selected;

            if (_arr.includes(_id)) {
                for (let i = 0; i < _arr.length; i++) {
                    if (_arr[i] === _id)
                        _arr.splice(i, 1);
                }
                state.selected = _arr;
            } else {
                _arr.push(_id);
                if (_arr.length >= 21) {
                    _arr.shift();
                }
                state.selected = _arr;
            }
        },
        selectMine(state, action) {
            const _info = state.info;
            const _selected = [];
            for (let i = 0; i < _info.length; i++) {
                if (Number(caver.utils.convertFromPeb(_info[i].minable, 'KLAY')) > 1) _selected.push(_info[i].id)
                if (_selected.length >= 20) break
            }
            state.selected = _selected;
        },
        selectCharge(state, action) {
            const _info = state.info;
            const _selected = [];
            for (let i = 0; i < _info.length; i++) {
                if (calculateOilTime(_info[i].oilCharged, _info[i].cp) === 0) _selected.push(_info[i].id)
                if (_selected.length >= 20) break
            }
            state.selected = _selected;
        },
        refreshSelected(state, action) {
            state.selected = [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getChickizInfo.pending, (state, action) => {
                if (!state.loading_info) {
                    state.loading_info = true;
                    state.currentRequestId_info = action.meta.requestId;
                }
            })
            .addCase(getChickizInfo.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_info && state.currentRequestId_info === requestId) {
                    state.info = action.payload.list;
                    state.loading_info = false;
                }
            })
            .addCase(getChickizInfo.rejected, (state, action) => {
                if (state.loading_info) {
                    state.loading_info = false;
                    state.currentRequestId_info = undefined
                }
            });
        //builder
        //    .addCase(getGuestBook.pending, (state, action) => {
        //        if (!state.loading) {
        //            state.loading = true;
        //            state.currentRequestId = action.meta.requestId;
        //        }
        //    })
        //    .addCase(getGuestBook.fulfilled, (state, action) => {
        //        const { requestId } = action.meta;
        //        if (state.loading && state.currentRequestId === requestId) {
        //            state[action.payload.account] = {
        //                start: action.payload.start,
        //                total: action.payload.total,
        //                guestBook: action.payload.guestBook
        //            }
        //            state.loading = false;
        //            state.currentRequestId = undefined
        //        }
        //    })
        //    .addCase(getGuestBook.rejected, (state, action) => {
        //        if (state.loading) {
        //            state.loading = false;
        //            state.currentRequestId = undefined
        //        }
        //    });
    },
});

export const { sortMining, addSelected, selectMine, selectCharge, refreshSelected } = miningSlice.actions;
export default miningSlice.reducer;