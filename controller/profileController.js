import {setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import profileModule from "../module/profileModule.js";
import { logError } from "../utilities/errorLogger.js";
import {validateUserID,validateProfileData} from "../utilities/dataValidator/profile.js";

const profileController = {
    /* get user profile
    @param {Object} req
    */
   getUserProfile:async (req, res) => {
        const userID = parseInt(req.params.userID);

        //validate user data
        const validationError = validateUserID(userID);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res.status(response.responseCode).json(response.responseBody);
        }
        try{

            const response = await profileModule.getUserProfile(userID);
            return res.status(response.responseCode).json(response.responseBody);
        }catch(err){
            logError(err, "profileController:getUserProfile","db");
            const response = setResponseInternalError();
            return res.status(response.responseCode).json(response.responseBody);
        }
    } ,
   
    /*editprofile
    {
        userID,
        userEmail,
        userName,
        rollNumber,
        phoneNumber,
        collegeName,
        collegeCity,
        userDepartment,
        academicYear,
        degree,
        needAccommodationDay1,
        needAccommodationDay2,
        needAccommodationDay3,
        isAmrita,
        accountStatus,
        createdAt ,
        updatedAt
    }
    */
    editProfile:async (req, res) => {
        const userID = parseInt(req.body.userID);
        const userData = req.body;
        //validate user data
        const validationErrorID = validateUserID(userID);
        const validationErrordata=validateProfileData(userData);
        if (validationErrorID||validationErrordata){
            const response = setResponseBadRequest(validationErrorID||validationErrordata);
            return res.status(response.responseCode).json(response.responseBody);
        }

        
        try{
            delete userData.userID;
            const response = await profileModule.editProfile(userID, userData);
            return res.status(response.responseCode).json(response.responseBody);
        }catch(err){
            logError(err, "profileController:editProfile","db");
            const response = setResponseInternalError();
            return res.status(response.responseCode).json(response.responseBody);
        }
    } 
};

export default profileController;