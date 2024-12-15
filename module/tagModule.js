import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseInternalError, setResponseBadRequest } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js"; 

const tagModule = {
  addTag: async (tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES tagData WRITE");
      const [result] = await db.query(
        "INSERT INTO tagData (tagName, tagAbbrevation) VALUES (?, ?)",
        [tagName, tagAbbrevation]
      );
      if (result.affectedRows === 1) {
        return setResponseOk("Tag added successfully", {
          id: result.insertId,
          tagName,
          tagAbbrevation,
        });
      } else {
        return setResponseBadRequest("Failed to add tag");
      }
    } catch (err) {
      logError(err, "tagModule.addTag", "db");
      return setResponseInternalError(); 
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },

  getAllTags: async () => {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES tagData READ");
      const [rows] = await db.query("SELECT * FROM tagData");
      return setResponseOk("Tags fetched successfully", rows);
    } catch (err) {
      logError(err, "tagModule.getAllTags", "db");
      return setResponseInternalError(); 
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },

  removeTag: async (id) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES tagData WRITE");
      const [result] = await db.query("DELETE FROM tagData WHERE tagID = ?", [id]);
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Tag not found");
      }
      return setResponseOk("Tag removed successfully");
    } catch (err) {
      logError(err, "tagModule.removeTag", "db");
      return setResponseInternalError(); 
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },

  editTag: async (id, tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES tagData WRITE");
      const [result] = await db.query(
        "UPDATE tagData SET tagName = ?, tagAbbrevation = ? WHERE tagID = ?",
        [tagName, tagAbbrevation, id]
      );
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Tag not found");
      }
      return setResponseOk("Tag updated successfully", {
        id,
        tagName,
        tagAbbrevation,
      });
    } catch (err) {
      logError(err, "tagModule.editTag", "db");
      return setResponseInternalError(); 
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default tagModule;
