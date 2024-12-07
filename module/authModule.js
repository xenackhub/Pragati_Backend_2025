import poolConnectToDb from "../db/poolConnection.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";
import { isUserExistsByEmail } from "../utilities/dbUtilities.js";
import { createToken } from "../middleware/auth/login/tokenGenerator.js";

const [pragatiDb, _] = poolConnectToDb();
const db = await pragatiDb.promise().getConnection();

const authModule = {
  login: async function (email, password) {
    try {
      // returns details of user if exists, else null
      const userData = await isUserExistsByEmail(email, db)
      console.log(userData)
      if (userData == null) {
        return setResponseBadRequest("User not found!");
      }
      if (userData[0].userPassword != password) {
        return setResponseBadRequest("Incorrect password for given user..");
      }

      const token = createToken({
        userID: userData[0].userID,
        userEmail: userData[0].userEmail,
        roleID: userData[0].roleID,
      });
      return setResponseOk("Login successful", {
        roleID: userData[0].roleID,
        TOKEN: token,
      });
    } catch (err) {
      console.log("[ERROR]: Error in authModule:login ", err);
      return setResponseInternalError();
    }
  },
};

export default authModule;
