const mysql = require('mysql2');

const createConnection = () => {
    const pragatiDB = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.PRAGATI_DB_PWD,
        database: 'pragati',
        multipleStatements: true
    });

    const pragatiTransactionsDB = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.TRANSACTIONS_DB_PWD,
        database: 'pragatiTransactions',
        multipleStatements: true
    });

    pragatiDB.connect((err) => {
        if (err) {
            console.log("[ERROR]: Failed to connect to Pragati DB.");
            console.log(err);
        }
        else {
            console.log("[INFO]: Connected to Pragati DB.");
        }
    });

    pragatiTransactionsDB.connect((err) => {
        if (err) {
            console.log("[ERROR]: Failed to connect to Pragati Transactions DB.");
            console.log(err);
        }
        else {
            console.log("[INFO]: Connected to Pragati Transactions DB.");
        }
    });

    return [pragatiDB, pragatiTransactionsDB];
}

module.exports = createConnection;