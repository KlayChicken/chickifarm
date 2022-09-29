import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading: false
};

export const getUserNeighborFollowers = createAsyncThunk(
    "userNeighborFollowers/getUserNeighborFollowers",
    async (data, { getState, requestId }) => {
        try {
            const { targetAddress } = data;

            const _state = getState().userNeighborFollowers;

            // 로딩중이거나 requestId가 다르면 return. 중복된 요청 방지.
            if (!_state.loading || requestId !== _state.currentRequestId) return;

            const _start = _state[targetAddress] ? _state[targetAddress]?.start : 0;
            const _followers = await getFollowers(_start, targetAddress);

            const originalNeighbor = _state[targetAddress] ? _state[targetAddress]?.followersList : [];

            const followersList = originalNeighbor.concat(_followers.followersList)

            return { account: targetAddress, start: _start + 15, followersNum: _followers.followersNum, followersList: followersList }
        } catch (err) {
            console.error(err)
        }
    }
)

async function getFollowers(_start, _targetAddress, _myAddress = null) {
    try {
        let res = await axios.post('/api/db/neighbor/getFollowers',
            {
                start: _start,
                targetAddress: _targetAddress,
                myAddress: _myAddress
            });
        return { followersNum: res.data.followersNum, followersList: res.data.followersArray }
    } catch (err) {
        console.error(err);
    }
}

const userSlice = createSlice({
    name: 'userNeighborFollowers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getUserNeighborFollowers.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(getUserNeighborFollowers.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading && state.currentRequestId === requestId) {
                    state[action.payload.account] = {
                        start: action.payload.start,
                        followersNum: action.payload.followersNum,
                        followersList: action.payload.followersList,
                    }
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
            .addCase(getUserNeighborFollowers.rejected, (state, action) => {
                if (state.loading) {
                    state.loading = false;
                    state.currentRequestId = undefined
                }
            })
    },
});

export default userSlice.reducer;