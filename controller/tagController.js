import tagModule from "../module/tagModule.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { validateTagData } from "../validators/tagValidator.js"; // Importing the tag validator

const tagController = {
  addTag: async (req, res) => {
    const validationError = validateTagData(req.body);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    const { tagName, tagAbbrevation } = req.body;

    try {
      const response = await tagModule.addTag(tagName, tagAbbrevation);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  getAllTags: async (req, res) => {
    try {
      const response = await tagModule.getAllTags();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  removeTag: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      const response = setResponseBadRequest("Tag ID is required");
      return res.status(response.responseCode).json(response.responseBody);
    }
    if (isNaN(id)) {
      const response = setResponseBadRequest("Tag ID must be a valid number");
      return res.status(response.responseCode).json(response.responseBody);
    }
    try {
      const response = await tagModule.removeTag(id);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  editTag: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      const response = setResponseBadRequest("Tag ID is required");
      return res.status(response.responseCode).json(response.responseBody);
    }
  
    if (isNaN(id)) {
      const response = setResponseBadRequest("Tag ID must be a valid number");
      return res.status(response.responseCode).json(response.responseBody);
    }
  
    // Validate the request body using validateTagData
    const validationError = validateTagData(req.body);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    const { tagName, tagAbbrevation } = req.body;

    try {
      const response = await tagModule.editTag(id, tagName, tagAbbrevation);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (err) {
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default tagController;
