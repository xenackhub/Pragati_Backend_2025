import poolConnectToDb from "../db/poolConnection.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";
import { isUserExistsByEmail } from "../utilities/dbUtilities.js";
import { createToken } from "../middleware/auth/login/tokenGenerator.js";

const authModule = {
  login: async function (email, password) {
    const [pragatiDb, transactionsDb] = poolConnectToDb();
    const db = await pragatiDb.promise().getConnection();
    try {
      // check if user is present in the database
      if (!(await isUserExistsByEmail(email))) {
        return setResponseBadRequest("User not found!");
      }

      // Query to select user
      await db.query("LOCK TABLES userData READ");
      const [userData] = await db.query(
        "SELECT userID, userEmail, roleID FROM userData WHERE userEmail = ? AND userPassword = ?",
        [email, password]
      );
      console.log(userData);
      await db.query("UNLOCK TABLES");

      // user is not found
      if (userData.length == 0) {
        return setResponseBadRequest("Incorrect password for given user..");
      }
      const token = createToken({
        userID: userData[0].userID,
        userEmail: userData[0].userEmail,
        roleID: userData[0].roleID,
      });
      return setResponseOk("Login successful", {
        userID: userData[0].userID,
        TOKEN: token,
      });
    } catch (err) {
      console.log("[ERROR]: Error in authModule:login ", err);
      return setResponseInternalError();
    }
  },
};

export default authModule;
