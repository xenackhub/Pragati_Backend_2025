import tagModule from "../module/tagModule.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";

const tagController = {
  addTag: async (req, res) => {
    const { tagName, tagAbbrevation } = req.body;
    if (!tagName || !tagAbbrevation) {
      const response = setResponseBadRequest("Tag name and abbreviation are required");
      return res.status(response.responseCode).json(response.responseBody);
    }

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
    const { tagName, tagAbbrevation } = req.body;

    if (!id || !tagName || !tagAbbrevation) {
      const response = setResponseBadRequest("Tag ID, name, and abbreviation are required");
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
