import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import profileModule from "../module/profileModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateProfileData } from "../utilities/dataValidator/profile.js";
import { isValidID } from "../utilities/dataValidator/common.js";

const profileController = {
    getUserProfile: async (req, res) => {
        const userID = req.params.userID;
        if (!isValidID(userID)) {
            const response = setResponseBadRequest("Invalid user ID sent!");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await profileModule.getUserProfile(userID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:getUserProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Request Header: Bearer Token
    {
      "userID": "number",
      "userName": "string",
      "rollNumber": "string",
      "phoneNumber": "string",
      "collegeName": "string",
      "collegeCity": "string",
      "userDepartment": "string",
      "academicYear": "string",
      "degree": "string",
      "needAccommodationDay1": "boolean",
      "needAccommodationDay2": "boolean",
      "needAccommodationDay3": "boolean",
      "isAmrita": "boolean",
    }
    */
    editProfile: async (req, res) => {
        const userID = parseInt(req.body.userID);
        const userData = req.body;
        //validate user data
        const validationErrorID = validateUserID(userID);
        const validationErrordata = validateProfileData(userData);
        if (validationErrorID || validationErrordata) {
            const response = setResponseBadRequest(
                validationErrorID || validationErrordata,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            delete userData.userID;
            const response = await profileModule.editProfile(userID, userData);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:editProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default profileController;
