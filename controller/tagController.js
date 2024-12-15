import tagModule from "../module/tagModule.js";
import { setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { validateTagData, validateTagId } from "../utilities/tagValidator.js";

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
    const { id } = req.body; 
    const validationError = validateTagId(id);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
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
    const { id, tagName, tagAbbrevation } = req.body; 
    const idValidationError = validateTagId(id);
    if (idValidationError) {
      const response = setResponseBadRequest(idValidationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    const validationError = validateTagData(req.body);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

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
