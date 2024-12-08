// helper functions for data validation and consistent response
import { validateEmail, validatePassword, validateSignupData } from "../utilities/dataValidator.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";

// authorization module for database access
import authModule from "../module/authModule.js";
import { logError } from "../utilities/errorLogger.js";

const authController = {
  /*
  Login request body
  {
      "email": "string",
      "password": "string"
  }
  */
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      const response = setResponseBadRequest("Email is not found or invalid");
      return res.status(response.responseCode).json(response.responseBody);
    }
    if (!validatePassword(password)) {
      const response = setResponseBadRequest(
        "Password is not found or invalid"
      );
      return res.status(response.responseCode).json(response.responseBody);
    }
    try {
      const response = await authModule.login(email, password);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      logError(err, "authController:login", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  /*
    Signup request body
    {
        "email": "string",
        "password": "string",
        "userName": "string",
        "rollNumber": "string",
        "phoneNumber": "string",
        "collegeName": "string",
        "collegeCity": "string",
        "userDepartment": "string",
        "academicYear": number,
        "degree": "string",
        "needAccommodationDay1" : "boolean",
        "needAccommodationDay2" : "boolean",
        "needAccommodationDay3" : "boolean",
        "isAmrita" : "boolean"
    }
  */
  signup: async (req, res) => {
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
    } = req.body;
    // Validate input data
    const validationErrors = validateSignupData(req.body);
    if (validationErrors != null) {
      const response = setResponseBadRequest(validationErrors);
      return res.status(response.responseCode).json(response.responseBody);
    }

    try {
      const response = await authModule.signup({
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
      });
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      logError(err, "authController:signup", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default authController;
