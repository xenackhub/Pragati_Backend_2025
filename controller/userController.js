import {setResponseOk,  setResponseBadRequest, setResponseInternalError, } from "../utilities/response.js";
import userModule from "../module/userModule.js";
import { logError } from "../utilities/errorLogger.js";

const userController = {
    /* 
        Edit Organiser request body
        {
            "organizerID": "integer",
            "organizerName": "string",
            "phoneNumber": "string",
        }
    */
    editOrganizer: async (req, res) => {
        const { organizerID, organizerName, phoneNumber } = req.body;
    
        if (!organizerID || !organizerName || !phoneNumber) {
            const response = setResponseBadRequest("Invalid or missing organizer data.");
            return res.status(response.responseCode).json(response.responseBody);
        }
    
        try {
            const response = await userModule.editOrganizer(organizerID, { organizerName, phoneNumber });
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            logError(error, "userController:editOrganizer", "db");
            const response = setResponseInternalError();
            return res.status(response.responseCode).json(response.responseBody);
        }
    },
    removeOrganiser: async (req, res) => {},
    /* 
        Comment for addOrganiser function
    */
    addOrganiser: async (req, res) => {},
    /* 
        Comment for accomodationUpdate function
    */
    accomodationUpdate: async (req, res) => {},

};


export default userController;