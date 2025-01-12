import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { isUserExistsByUserID } from "../utilities/dbUtilities/common.js";

const profileModule = {
    getUserProfile: async (userID) => {
        const db= await pragatiDb.promise().getConnection();
        try{

            const userExists = await isUserExistsByUserID(userID, db);
            if (!userExists) {
                db.rollback();
                return setResponseBadRequest("User not found");
            }
            //Locking table to prevent concurrent reads
            await db.query("LOCK TABLES userData READ, registrationData READ");
            const query = `SELECT 
                                userData.userID,
                                userData.userEmail,
                                userData.userName,
                                userData.rollNumber,
                                userData.phoneNumber,
                                userData.collegeName,
                                userData.collegeCity,
                                userData.userDepartment,
                                userData.academicYear,
                                userData.degree,
                                userData.needAccommodationDay1,
                                userData.needAccommodationDay2,
                                userData.needAccommodationDay3,
                                userData.isAmrita,
                                userData.accountStatus,
                                userData.createdAt,
                                userData.updatedAt,
                                registrationData.registrationID,
                                registrationData.eventID,
                                registrationData.txnID,
                                registrationData.amountPaid,
                                registrationData.totalMembers,
                                registrationData.teamName,
                                registrationData.registrationStatus,
                                registrationData.createdAt AS registrationCreatedAt,
                                registrationData.updatedAt AS registrationUpdatedAt
                            FROM 
                                userData 
                            LEFT JOIN registrationData 
                            ON userData.userID = registrationData.userID 
                            WHERE userData.userID = ?;`;
            const [result] = await db.query(query, [userID]);
            if (result.length === 0) {
                return setResponseBadRequest("User not found");
            }
            return setResponseOk("Records fetched successfully", result);
        }catch(error){
            logError(error, "profileModule:getUserProfile","db");
            return setResponseInternalError();
        }finally{
            await db.query("UNLOCK TABLES");
            db.release();

        }
    },
    
    editProfile: async (userID, userData) => {
        const db= await pragatiDb.promise().getConnection();
        try{
            const userExists = await isUserExistsByUserID(userID, db);
            if (!userExists) {
                db.rollback();
                return setResponseBadRequest("User not found");
            }
            //locking table
            await db.query("LOCK TABLES userData WRITE");
            const query = `UPDATE userData SET ? WHERE userID = ?;`;
           
            const [result]=await db.query(query, [userData, userID]);
            if (result.affectedRows === 0) {
                return setResponseBadRequest("User not found or no changes made");
            }
            return setResponseOk("Profile updated successfully");
        }catch(error){
            logError(error, "profileModule:editProfile","db");
            return setResponseInternalError();
        }finally{
            await db.query("UNLOCK TABLES");
            db.release();
        }
    }
};

export default profileModule;