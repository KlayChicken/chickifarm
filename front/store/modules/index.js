import { combineReducers } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

// import reducers
import etc from './etc';
import myInfo from './myInfo';
import nft from './nft';
import otherNft from './otherNft';
import love from './love';
import myNeighbor from './neighbor/myNeighbor';
import userNeighborFollowers from './neighbor/userNeighborFollowers';
import userNeighborFollowing from './neighbor/userNeighborFollowing';
import userInfo from './userInfo';
import userFarm from './farm/userFarm';
import farmSearch from './farm/farmSearch';
import guestBook from './guestBook/guestBook';
import chickiball from './land/chickiball';
import raffle from './raffle/raffle';
import myRaffle from './raffle/myRaffle';
import raffleFavorite from './raffle/raffleFavorite';
import rarity from './rarity';
import modal from './modal';
import mining from './lab/mining';
import makeSuper from './lab/makeSuper';

import klipstore from './klipstore'

const reducer = (state, action) => {
    switch (action.type) {
        //case HYDRATE:
        //    return { ...state, ...action.payload }
        default:
            const combineReducer = combineReducers({
                etc,
                myInfo,
                nft,
                otherNft,
                love,
                myNeighbor,
                userNeighborFollowers,
                userNeighborFollowing,
                userInfo,
                userFarm,
                guestBook,
                farmSearch,
                chickiball,
                klipstore,
                raffle,
                myRaffle,
                raffleFavorite,
                rarity,
                modal,
                mining,
                makeSuper,
            })
            return combineReducer(state, action);
    }
}

export default reducer;