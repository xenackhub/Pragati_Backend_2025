import { createPool } from "mysql2";
import { appConfig } from "../config/config.js";
import { logError } from "../utilities/errorLogger.js";

const poolConnectToDb = () => {
  let pragatiDbPool = null;
  let transactionsDbPool = null;
  try {
    pragatiDbPool = createPool(appConfig.db.pragati);
    transactionsDbPool = createPool(appConfig.db.transactions);
    return [pragatiDbPool, transactionsDbPool];
  } catch (err) {
    logError(err, "poolConnection", "connection");
  }
};

export default poolConnectToDb;
