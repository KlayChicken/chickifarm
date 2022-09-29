const dbConf = require('../../key/db/dbInfo.json');
const mysql = require('mysql2')


const pool = mysql.createPool({
    host: dbConf.host,
    user: dbConf.user,
    password: dbConf.password,
    port: dbConf.port,
    database: dbConf.database
});

const dbSetup = pool.promise();

module.exports = dbSetup;