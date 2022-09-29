import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading_following: false, loading_followers: false,
    start_following: 0, start_followers: 0,
    myFollowingNum: 0, myFollowersNum: 0,
    myFollowingList: [], myFollowersList: [],
    isNeighbor: 0
};


export const getMyNeighborFollowing = createAsyncThunk(
    "myNeighbor/getMyNeighborFollowing",
    async (data, { getState, requestId }) => {
        try {
            const { targetAddress, myAddress } = data;

            const { start_following: start, loading_following, currentRequestId_following } = getState().myNeighbor;

            // 로딩중이 아니거나(pending에서 로딩중으로 변경돼야하니깐) requestId가 다르면 return. 중복된 요청 방지.
            if (!loading_following || requestId !== currentRequestId_following) return;

            const _following = await getFollowing(start, targetAddress, myAddress);

            return { start: start + 15, followingNum: _following.followingNum, followingList: _following.followingList }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getMyNeighborFollowers = createAsyncThunk(
    "myNeighbor/getMyNeighborFollowers",
    async (data, { getState, requestId }) => {
        try {
            const { targetAddress, myAddress } = data;

            const { start_followers: start, loading_followers, currentRequestId_followers } = getState().myNeighbor;

            // 로딩중이거나 requestId가 다르면 return. 중복된 요청 방지.
            if (!loading_followers || requestId !== currentRequestId_followers) return;

            const _followers = await getFollowers(start, targetAddress, myAddress);

            return { start: start + 15, followersNum: _followers.followersNum, followersList: _followers.followersList }
        } catch (err) {
            console.error(err)
        }
    }
)

export const getIsNeighbor = createAsyncThunk(
    "myNeighbor/getIsNeighbor",
    async (data) => {
        try {
            const { from, to } = data
            if (from?.toUpperCase() === to?.toUpperCase()) {
                return { isNeighbor: 0 }
            }
            const res = await axios.post('/api/db/neighbor/isNeighbor', { fromAddress: from, toAddress: to });

            return { isNeighbor: res.data.isNeighbor }
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateNeighbor = createAsyncThunk(
    "myNeighbor/updateNeighbor",
    async (data) => {
        try {
            const { from, to, nowBool } = data
            const res = await axios.post('/api/db/neighbor/updateNeighbor',
                { fromAddress: from, toAddress: to, neighborBool: nowBool });
            return
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
    name: 'myNeighbor',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getMyNeighborFollowing.pending, (state, action) => {
                if (!state.loading_following) {
                    state.loading_following = true;
                    state.currentRequestId_following = action.meta.requestId;
                }
            })
            .addCase(getMyNeighborFollowing.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_following && state.currentRequestId_following === requestId) {
                    state.start_following = action.payload.start;
                    state.myFollowingNum = action.payload.followingNum;
                    state.myFollowingList.push(...action.payload.followingList);
                    state.loading_following = false;
                    state.currentRequestId_following = undefined
                }
            })
            .addCase(getMyNeighborFollowing.rejected, (state, action) => {
                if (state.loading_following) {
                    state.loading_following = false;
                    state.currentRequestId_following = undefined
                }
            });
        builder
            .addCase(getMyNeighborFollowers.pending, (state, action) => {
                if (!state.loading_followers) {
                    state.loading_followers = true;
                    state.currentRequestId_followers = action.meta.requestId;
                }
            })
            .addCase(getMyNeighborFollowers.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (state.loading_followers && state.currentRequestId_followers === requestId) {
                    state.start_followers = action.payload.start;
                    state.myFollowersNum = action.payload.followersNum;
                    state.myFollowersList.push(...action.payload.followersList);
                    state.loading_followers = false;
                    state.currentRequestId_followers = undefined
                }
            })
            .addCase(getMyNeighborFollowers.rejected, (state, action) => {
                if (state.loading_followers) {
                    state.loading_followers = false;
                    state.currentRequestId_followers = undefined
                }
            });
        builder
            .addCase(getIsNeighbor.fulfilled, (state, action) => {
                state.isNeighbor = action.payload.isNeighbor;
            });
        builder
            .addCase(updateNeighbor.fulfilled, (state, action) => {
            });
    },
});

export default userSlice.reducer;