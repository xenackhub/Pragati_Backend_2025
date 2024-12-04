import { createPool } from 'mysql2';
import { appConfig } from '../config/config.js';
import { appendFileSync } from 'fs';

const poolConnectToDb = () => {
    let pragatiDbPool = null
    let transactionsDbPool = null
    try {
        pragatiDbPool = createPool(appConfig.db.pragati)
        transactionsDbPool = createPool(appConfig.db.transactions)
        return [pragatiDbPool, transactionsDbPool]
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`
        console.error(errMessage);
        appendFileSync('./logs/connection/poolConnection.log', `${errMessage}\n`);
    }
}

export default poolConnectToDb;