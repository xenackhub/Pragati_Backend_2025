import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";


const userModule = {
    editOrganizer: async function(organizerID, data) {
      const db = await pragatiDb.promise().getConnection();
      try {
        const query = `UPDATE organizerData SET organizerName = ?, phoneNumber = ?, updatedAt = CURRENT_TIMESTAMP WHERE organizerID = ?`;
  
        const [result] = await db.query(query, [data.organizerName, data.phoneNumber, organizerID]);
        if (result.affectedRows === 0) {
          return setResponseBadRequest("Organizer not found.");
        }
        return setResponseOk("Organizer updated successfully.");
      } catch (error) {
        console.log("[ERROR]: Error in Edit Organiser Module: ", err);
        logError(error, "userModule:editOrganizer", "db");
        return setResponseInternalError();
      } finally {
        db.release();
      }
    },
}

export default userModule;
