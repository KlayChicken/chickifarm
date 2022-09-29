import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";

import logger from 'redux-logger';
import axios from 'axios';

import reducer from './modules';

// axios.defaults.baseURL = process.env.NODE_ENV !== 'production'
//     ? 'http://localhost:3060'
//     : 'http://localhost:3060'
//    : 'http://3.38.89.225:3060';

const createStore = () => configureStore({
    reducer,
    middleware: process.env.NODE_ENV !== 'production'
        ? (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
        : (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});

export const wrapper = createWrapper(createStore, {
    debug: process.env.NODE_ENV !== 'production',
});