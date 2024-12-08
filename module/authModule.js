import poolConnectToDb from "../db/poolConnection.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";
import { isUserExistsByEmail } from "../utilities/dbUtilities.js";
import { createToken } from "../middleware/auth/login/tokenGenerator.js";
import { logError } from "../utilities/errorLogger.js";

const authModule = {
  login: async function (email, password) {
    const [pragatiDb, _] = poolConnectToDb();
    const db = await pragatiDb.promise().getConnection();
    try {
      // returns details of user if exists, else null
      const userData = await isUserExistsByEmail(email, db);
      if (userData == null) {
        db.release();
        return setResponseBadRequest("User not found!");
      }
      if (userData[0].userPassword != password) {
        db.release();
        return setResponseBadRequest("Incorrect password for given user..");
      }

      const token = createToken({
        userID: userData[0].userID,
        userEmail: userData[0].userEmail,
        roleID: userData[0].roleID,
      });
      db.release();
      return setResponseOk("Login successful", {
        roleID: userData[0].roleID,
        TOKEN: token,
      });
    } catch (err) {
      logError(err, "authModule:login", "db");
      db.release();
      return setResponseInternalError();
    }
  },

  signup: async function (userData) {
    const {
      email,
      password,
      userName,
      rollNumber,
      phoneNumber,
      collegeName,
      collegeCity,
      userDepartment,
      academicYear,
      degree,
      isAmrita,
    } = userData;

    const [pragatiDb, _] = poolConnectToDb();
    const db = await pragatiDb.promise().getConnection();

    try {
      const emailExist = await isUserExistsByEmail(email, db);
      if (emailExist != null) {
        db.release();
        return setResponseBadRequest("User Email already exists!!");
      }

      const query = `
        INSERT INTO userData 
          (userEmail, userPassword, userName, rollNumber, phoneNumber, collegeName, collegeCity, userDepartment, academicYear, degree, isAmrita)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        email,
        password,
        userName,
        rollNumber,
        phoneNumber,
        collegeName,
        collegeCity,
        userDepartment,
        academicYear,
        degree,
        isAmrita,
      ];
      await db.query("LOCK TABLES userData WRITE");
      const [result] = await db.query(query, values);
      await db.query("UNLOCK TABLES");
      db.release();
      return setResponseOk("Sign up successful", result);
    } catch (err) {
      logError(err, "authModule:signup", "db");
      db.release();
      return setResponseInternalError();
    } finally {
      db.release();
      await db.query("UNLOCK TABLES");
    }
  },
};

export default authModule;
