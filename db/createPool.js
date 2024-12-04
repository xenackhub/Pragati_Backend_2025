const mysql = require('mysql2');
const connectionLimit = 15;

const pragatiDB_Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.PRAGATI_DB_PWD,
    database: 'pragati',
    waitForConnections: true,
    connectionLimit: connectionLimit,
    queueLimit: 0
});

const transactionsDB_Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.TRANSACTIONS_DB_PWD,
    database: 'pragatiTransactions',
    waitForConnections: true,
    connectionLimit: connectionLimit,
    queueLimit: 0
});

module.exports = [
    pragatiDB_Pool,
    transactionsDB_Pool
];