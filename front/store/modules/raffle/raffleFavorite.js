import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { isFavorite: 0 };

export const getFavorite = createAsyncThunk(
    "raffle/getFavorite",
    async (data) => {
        try {
            const { raffleId, userId } = data;

            const res = await axios.post('/api/db/raffle/getFavorite', { raffleId: raffleId, userId: userId })

            return { isFavorite: res.data.favorite }
        } catch (err) {
            console.error(err)
        }
    }
)

export const updateFavorite = createAsyncThunk(
    "raffle/updateFavorite",
    async (data) => {
        try {
            const { raffleId, userId } = data;
            const res = await axios.post('/api/db/raffle/updateFavorite',
                { raffleId: raffleId, userId: userId });
            return
        } catch (err) {
            console.error(err)
        }
    }
)

const raffleFavoriteSlice = createSlice({
    name: 'raffleFavorite',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFavorite.fulfilled, (state, action) => {
            state.isFavorite = action.payload.isFavorite;
        });
        builder.addCase(updateFavorite.fulfilled, (state, action) => {
        });
    },
});

export default raffleFavoriteSlice.reducer;