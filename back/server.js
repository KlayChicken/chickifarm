const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const app = express();
const api = require('./routes');
const compression = require('compression');

// 무중단 배포를 위한
let isDisableKeepAlive = false;

app.use(function (req, res, next) {
    if (isDisableKeepAlive) {
        res.set('Connection', 'close')
    }
    next();
})

//cors
const whitelist = ['http://chickifarm.com', 'https://chickifarm.com', 'http://localhost:3000', 'http://localhost:8000', 'http://3.36.243.76']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

// json 형태로 parsing || 중첩가능 || 압축해서 전송
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// eventListener & scheduler

if (process.env.CHICKIFARM_ID == 0) {
    const eventListener = require('./routes/klaytn/eventListener');
    const chickiballScheduler = require('./routes/scheduler/chickiballScheduler');

    //eventListener;
    //chickiballScheduler;
}

if (process.env.CHICKIFARM_ID == 1) {
    const raffleScheduler = require('./routes/scheduler/raffleScheduler');

    //raffleScheduler
}

// api 처리는 routes/index.js 에서 함
app.use('/api', api)

// react

app.listen(3060, function () {
    process.send('ready');
    console.log('3060 port is listening!')
});

process.on('SIGINT', function () {
    isDisableKeepAlive = true;
    app.close(function () {
        console.log('server closed');
        process.exit(0);
    })
});