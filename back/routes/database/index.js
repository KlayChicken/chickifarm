const express = require('express');
const router = express.Router();

// semi router
const etc = require('./etc');
const user = require('./user');
const nft = require('./nft');
const neighbor = require('./neighbor');
const farm = require('./farm');
const guestBook = require('./guestBook');
const love = require('./love');
const chickiball = require('./chickiball');
const raffle = require('./raffle');
const makeSuper = require('./makeSuper');

router.use('/etc', etc);
router.use('/user', user);
router.use('/nft', nft);
router.use('/neighbor', neighbor);
router.use('/farm', farm);
router.use('/guestBook', guestBook);
router.use('/love', love);
router.use('/chickiball', chickiball);
router.use('/raffle', raffle);
router.use('/makeSuper', makeSuper)

module.exports = router;