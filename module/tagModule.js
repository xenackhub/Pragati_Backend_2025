import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseInternalError, setResponseBadRequest } from "../utilities/response.js";

const tagModule = {
  addTag: async (tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const [result] = await pragatiDb.execute(
        "INSERT INTO tagData (tagName, tagAbbrevation) VALUES (?, ?)",
        [tagName, tagAbbrevation]
      );
      return setResponseOk("Tag added successfully", {
        id: result.insertId,
        tagName,
        tagAbbrevation,
      });
    } catch (err) {
      throw new Error("Error adding tag");
    }
  },

  getAllTags: async () => {
    try {
      const [rows] = await pragatiDb.execute("SELECT * FROM tagData");
      return setResponseOk("Tags fetched successfully", rows);
    } catch (err) {
      throw new Error("Error fetching tags");
    }
  },

  removeTag: async (id) => {
    try {
      const [result] = await pragatiDb.execute("DELETE FROM tagData WHERE tagID = ?", [id]);
      if (result.affectedRows === 0) return setResponseBadRequest("Tag not found");
      return setResponseOk("Tag removed successfully");
    } catch (err) {
      throw new Error("Error removing tag");
    }
  },

  editTag: async (id, tagName, tagAbbrevation) => {
    try {
      const [result] = await pragatiDb.execute(
        "UPDATE tagData SET tagName = ?, tagAbbrevation = ? WHERE tagID = ?",
        [tagName, tagAbbrevation, id]
      );
      if (result.affectedRows === 0) return setResponseBadRequest("Tag not found");
      return setResponseOk("Tag updated successfully", {
        id,
        tagName,
        tagAbbrevation,
      });
    } catch (err) {
      throw new Error("Error editing tag");
    }
  },
};

export default tagModule;
