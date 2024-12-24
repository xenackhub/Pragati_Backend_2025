import { logError } from "../errorLogger.js";

const checkUserIDsExists = async function (studentID, db) {
try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
    "SELECT userID FROM userData WHERE userID IN (?)",
    [studentID]
    );
    await db.query("UNLOCK TABLES");

    if (result.length !== studentID.length) {
    return "UserID not found in database.";
    }
    return null;
} catch (err) {
    logError(err, "checkUserIDsExists", "db");
    return "Error occurred when checking user IDs.";
}
};

export {checkUserIDsExists};
