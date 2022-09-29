import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading: false
};

export const getUserNeighborFollowing = createAsyncThunk(
    "userNeighborFollowing/getUserNeighborFollowing",
    async (data, { getState, requestId }) => {
        try {
            const { targetAddress } = data;

            const _state = getState().userNeighborFollowing;

            // 로딩중이거나 requestId가 다르면 return. 중복된 요청 방지.
            if (!_state.loading || requestId !== _state.currentRequestId) return;

            const _start = _state[targetAddress] ? _state[targetAddress]?.start : 0;
            const _following = await getFollowing(_start, targetAddress);

            const originalNeighbor = _state[targetAddress] ? _state[targetAddress]?.followingList : [];

            const followingList = originalNeighbor.concat(_following.followingList)

            return { account: targetAddress, start: _start + 15, followingNum: _following.followingNum, followingList: followingList }
        } catch (err) {
            console.error(err)
        }
    }
)

async function getFollowing(_start, _targetAddress, _myAddress = null) {
    try {
        let res = await axios.post('/api/db/neighbor/getFollowing',
            {
                start: _start,
                targetAddress: _targetAddress,
                myAddress: _myAddress
            });
        return { followingNum: res.data.followingNum, followingList: res.data.followingArray }
    } catch (err) {
        console.error(err);
    }
}


const userSlice = createSlice({
    name: 'userNeighborFollowing',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getUserNeighborFollowing.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(getUserNeighborFollowing.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state[action.payload.account] = {
                        start: action.payload.start,
                        followingNum: action.payload.followingNum,
                        followingList: action.payload.followingList,
                    }
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
            .addCase(getUserNeighborFollowing.rejected, (state, action) => {
                if (state.loading) {
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            });
    },
});

export default userSlice.reducer;