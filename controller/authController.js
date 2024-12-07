// helper functions for data validation and consistent response
import { validateEmail, validatePassword } from "../utilities/dataValidator.js";
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
};

export default authController;
