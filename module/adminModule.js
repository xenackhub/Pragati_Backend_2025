import { transactionsDb } from '../db/poolConnection.js';
import { logError } from '../utilities/errorLogger.js';

export const getAllTransactionsData = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM transactionData';
    transactionsDb.query(query, (err, results) => {
      if (err) {
        logError(err, 'getAllTransactionsData (adminModule)', 'db');
        return reject(err);
      }
      resolve(results);
    });
  });
};
