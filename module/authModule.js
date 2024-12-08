import crypto from "crypto";
import poolConnectToDb from "../db/poolConnection.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { generateOTP } from "../middleware/OTP/otpGenerator.js";
import { isUserExistsByEmail } from "../utilities/dbUtilities.js";
import { createToken } from "../middleware/auth/tokenGenerator.js";
import { createOTPToken } from "../middleware/OTP/otpTokenGenerator.js";
import { sendForgotPasswordOtp } from "../utilities/mailer/mailer.js"

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

  forgotPassword: async function (userEmail) {
    try {
      const userData = await isUserExistsByEmail(userEmail, db);
      var transactionStarted = 0;
      if (userData == null){
        return setResponseBadRequest("User Not Found !");
      }

      if(userData[0].accountStatus === '0'){
        return setResponseBadRequest("Account Blocked by Admin !");
      } else if(userData[0].accountStatus === '1'){
        return setResponseBadRequest("Account Not Verified");
      }

      await db.beginTransaction();
      await db.query("LOCK TABLE otpTable WRITE");

      transactionStarted = 1;

      await db.query("DELETE FROM otpTable WHERE userID = ?", [userData[0].userID]);
      const OTP = generateOTP();
      console.log("Generated OTP: ", OTP);

      const otpToken = await createOTPToken({
        "userEmail": userData[0].userEmail,
        "userID": userData[0].userID
      });

      const otpHashed = crypto.createHash('sha256').update(OTP).digest('hex');
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      
      await db.query("INSERT INTO otpTable (userID, otp, expiryTime) VALUES (?, ?, ?)", 
        [userData[0].userID, otpHashed, expiryTime]
      );
      
      // Awaiting for mail to be sent will stop the process for a long time. So ignoring it.
      sendForgotPasswordOtp(userData[0].userName, OTP, userEmail);
      await db.commit();
      return setResponseOk("Check Email for Password Reset OTP",{
        TOKEN: otpToken
      });
      
    } catch (error) {
      if(transactionStarted === 1){
        await db.rollback();
      }

      console.log("[ERROR]: Error in Forgot Password Module: ", error);
      logError(err, "authModule:Forgot Password", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default authModule;