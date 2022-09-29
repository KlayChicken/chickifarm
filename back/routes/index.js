const express = require('express');
const router = express.Router();
const db = require('./database')

// /api/db => db 처리는 database/dbChange.js 에서 함
router.use('/db', db)

module.exports = router;