import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseInternalError, setResponseBadRequest } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js"; 

const tagModule = {
  addTag: async (tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const existingTag = await tagModule.findTagByNameOrAbbreviation(tagName, tagAbbrevation ,null,db);
      if (existingTag) {
        return setResponseBadRequest("Tag name or abbreviation already exists.");
      }

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

       // Ensure the database schema is designed with CASCADE DELETE for foreign key relationships.
      // This prevents integrity constraint violations if the tagID is referenced in other tables.
      // With CASCADE DELETE, deleting a tag from this table will automatically remove dependent rows from related tables.

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

  findTagByNameOrAbbreviation: async (tagName, tagAbbrevation, excludeId = null, db) => {
    try {
      await db.query("LOCK TABLES tagData READ");
  
      let query = "SELECT * FROM tagData WHERE (tagName = ? OR tagAbbrevation = ?)";
      const params = [tagName, tagAbbrevation];
  
      // If excludeId is provided, exclude that tag (useful for updates)
      if (excludeId) {
        query += " AND tagID != ?";
        params.push(excludeId);
      }
  
      const [rows] = await db.query(query, params);
  
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      logError(err, "tagModule.findTagByNameOrAbbreviation", "db");
      return setResponseInternalError(); 
    } finally {
      await db.query("UNLOCK TABLES");
    }
  },

  getTagById: async (tagID, db) => {
    try {
        await db.query("LOCK TABLES tagData READ");

        const [rows] = await db.query("SELECT * FROM tagData WHERE tagID = ?", [tagID]);
        if (rows.length > 0) {
          return rows[0]; 
      } else {
          return null; 
      }

    } catch (err) {
        logError(err, "tagModule.getTagById", "db");
        return setResponseInternalError();
    } finally {
        await db.query("UNLOCK TABLES");
      }
  },

  editTag: async (id, tagName, tagAbbrevation) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const existingTag = await tagModule.getTagById(id, db);
      if (!existingTag) {
        return setResponseBadRequest("Tag not found");
      }

      const duplicateTag = await tagModule.findTagByNameOrAbbreviation(tagName, tagAbbrevation, id, db);
      if (duplicateTag) {
        return setResponseBadRequest("Tag name or abbreviation already exists.");
      }

      await db.query("LOCK TABLES tagData WRITE");

      // Perform the update
      const [result] = await db.query(
        "UPDATE tagData SET tagName = ?, tagAbbrevation = ? WHERE tagID = ?",
        [tagName, tagAbbrevation, id]
      );

      if (result.affectedRows === 0) {
        if (result.matchedRows === 0) {
          return setResponseBadRequest("Tag not found");
        } else {
          return setResponseBadRequest(
            "No changes made. The provided tag name or abbreviation matches the current values."
          );
        }
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
