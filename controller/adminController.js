import { setResponseInternalError, setResponseBadRequest} from "../utilities/response.js";
import adminModule from "../module/adminModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateEditUserStatusData } from "../utilities/dataValidator/admin.js";

const adminController = {

  getAllTransactions : async (req, res) => {
  
    try {
      const response = await adminModule.getAllTransactions();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getAllTransactions", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  getAllRoles: async (req, res) => {
    try {
      const response = await adminModule.getAllRoles();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getAllRoles", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  getEventWiseAmountGenerated: async (req, res) => {
    try {
      const response = await adminModule.getEventWiseAmountGenerated();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getEventWiseAmountGenerated", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
  changeStatusOfUser: async (req, res) => {
        /* 
        Edit accountStatus request body
        {
            "studentID": "integer"
            "accountStatus": "integer"
        }
    */
    const { studentID, accountStatus } = req.body;
    // Ensure userID is a number, and accountStatus is one of '0', '1', or '2'
    const validationError = validateEditUserStatusData( studentID, accountStatus);
    if (validationError !=null) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    try {
      const response = await adminModule. editUserAccountStatus(studentID, accountStatus);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:changeStatusOfUser", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default adminController;