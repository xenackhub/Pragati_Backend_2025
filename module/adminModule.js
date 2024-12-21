import { transactionsDb, pragatiDb } from '../db/poolConnection.js';
import { setResponseOk, setResponseInternalError } from "../utilities/response.js";
import { logError } from '../utilities/errorLogger.js';

const adminModule = {
  getAllTransactions: async () => {
    const db = await transactionsDb.promise().getConnection();
    try {
      // Lock table for READ
      await db.query("LOCK TABLES transactionData READ");
      const query = "SELECT * FROM transactionData";
      const [results] = await db.query(query);

      return setResponseOk("All transactions fetched successfully", results);
    } catch (error) {
      logError(error, "adminModule:getAllTransactions", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getAllRoles: async () => {
    const db = await pragatiDb.promise().getConnection();
    try {
      // Lock table for READ
      await db.query("LOCK TABLES userRole READ");
      const query = "SELECT roleID, roleName, createdAt FROM userRole";
      const [results] = await db.query(query);

      return setResponseOk("All roles fetched successfully", results);
    } catch (error) {
      logError(error, "adminModule:getAllRoles", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default adminModule;