const fs = require('fs');

const initDatabase = (db, dbName) => {
    if (dbName == "Pragati") {
        try {
            fs.readFile('./db/schema/pragatiSchema.sql', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    db.query(data, (err, result) => {
                        if (err) {
                            console.log(`[ERROR]: ${dbName} Database Initialization Failed.`);
                            console.log(err);
                        }
                        else {
                            console.log(`[INFO]: ${dbName} Database Initialized Successfully.`);
                        }
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    } else if (dbName ==  "pragatiTransactions") {
        try {
            fs.readFile('./db/Schema/transactionSchema.sql', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    db.query(data, (err, result) => {
                        if (err) {
                            console.log(`[ERROR]: ${dbName} Database Initialization Failed.`);
                            console.log(err);
                        }
                        else {
                            console.log(`[INFO]: ${dbName} Database Initialized Successfully.`);
                        }
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
};


module.exports = initDatabase;