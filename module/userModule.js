import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";


const userModule = {
  editOrganizer: async (organizerID, organizerData) => {
    const { organizerName, phoneNumber } = organizerData;
    //Connection to db.
    const db = await pragatiDb.promise().getConnection();
    try {
      //Locking the table to prevent concurrent updates to "organizerData"  table.
      await db.query("LOCK TABLES organizerData WRITE");
      const query = `UPDATE organizerData SET organizerName = COALESCE(?, organizerName), phoneNumber = COALESCE(?, phoneNumber) WHERE organizerID = ?`;
      const [result] = await db.query(query, [organizerName, phoneNumber, organizerID]);
      //Should return Bad request if the affectedRows is zero(the case for: organizer not found)
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Organizer not found or no changes made.");
      }
      //Response OK
      return setResponseOk("Organizer updated successfully.");
    } catch (error) {
      logError(error, "userModule:editOrganizer", "db");
      return setResponseInternalError();
    } finally {
      //Ensuring the lock is released.
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default userModule;
