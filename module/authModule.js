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

const [pragatiDb, _] = poolConnectToDb();
const db = await pragatiDb.promise().getConnection();

const authModule = {
  login: async function (email, password) {
    try {
      // returns details of user if exists, else null
      const userData = await isUserExistsByEmail(email, db)
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
      logError(err, "authModule:login", "db");
      return setResponseInternalError();
    }
  },

  signup : async function (userData) {
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
      accountStatus,
      roleID,
    } = userData;
    
  
    try {
      const emailExist = await isUserExistsByEmail(email,db);
      if (emailExist!=null){
        return setResponseBadRequest("User Email already exists!!")
      }
      const query = `
        INSERT INTO userData 
          (userEmail, userPassword, userName, rollNumber, phoneNumber, collegeName, collegeCity, userDepartment, academicYear, degree, isAmrita, accountStatus, roleID)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        accountStatus,
        roleID,
      ];
      await db.query("LOCK TABLES userData WRITE");
      const [result] = await db.query(query, values);
      await db.query("UNLOCK TABLES");
      return setResponseOk("Sign up successful",result);
      
    } catch (err) {
      console.error("[ERROR]: Error in createUser: ", err);
      throw new Error("Failed to create user.");
    } 
    finally{
      await db.query("UNLOCK TABLES");
    }
  }
};

export default authModule;
