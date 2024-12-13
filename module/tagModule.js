import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseInternalError, setResponseBadRequest } from "../utilities/response.js";

const tagModule = {
  addTag: async (tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES tagData WRITE");
      const [result] = await db.query(
        "INSERT INTO tagData (tagName, tagAbbrevation) VALUES (?, ?)",
        [tagName, tagAbbrevation]
      );
      return setResponseOk("Tag added successfully", {
        id: result.insertId,
        tagName,
        tagAbbrevation,
      });
    } catch (err) {
      console.error("Error adding tag:", err.message);
      return setResponseInternalError("Error adding tag");
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
      console.error("Error fetching tags:", err.message);
      return setResponseInternalError("Error fetching tags");
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
      console.error("Error removing tag:", err.message);
      return setResponseInternalError("Error removing tag");
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
      console.error("Error editing tag:", err.message);
      return setResponseInternalError("Error editing tag");
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default tagModule;
