import { pragatiDb } from "../db/poolConnection";
import { setResponseNotFound, setResponseOk } from "../utilities/response";

const notificationModule = {
    getAllNotifications: async function () {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES notification READ");
            const [noties] = await db.query(`
            SELECT 
              notificationID,
              title,
              description,
              author,
              venue,
              startDate,
              endDate FROM notification`);
            if (noties.length == 0) {
                return setResponseNotFound("No notifications found");
            }
            return setResponseOk("All notifications selected", noties);
        } catch (err) {
            logError(err, "notificationModule:getAllNotifications", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default notificationModule;
