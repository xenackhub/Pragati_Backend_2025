// helper functions for data validation and consistent response
import { validateEmail, validatePassword } from "../utilities/authValidator.js";
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
} from "../utilities/response.js";

// authorization module for database access
import authModule from "../module/authModule.js";

const authController = {
  // Login controller
  login: async (req, res) => {
    // parsing necessary values
    const { email, password } = req.body;
    // validate email
    if (!validateEmail(email)) {
      const response = setResponseBadRequest("Email is not found or invalid");
      return res.status(response.responseCode).json(response.responseBody);
    }
    // validate password
    if (!validatePassword(password)) {
      const response = setResponseBadRequest(
        "Password is not found or invalid"
      );
      return res.status(response.responseCode).json(response.responseBody);
    }
    // database access logic wrapped in try catch block
    try {
      const response = await authModule.login(email, password);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      console.log("[ERROR]: Error in authController:login ", err);
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default authController;
