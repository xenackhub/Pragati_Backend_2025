import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";

const clubModule = {
  // Fetch all clubs
  getAllClubs: async () => {
    const db = await pragatiDb.promise().getConnection();
    try {
      // Use READ lock to ensure data consistency during reading
      await db.query("LOCK TABLES clubdata READ");

      const query = "SELECT * FROM clubdata";
      const [result] = await db.query(query);

      return setResponseOk(result);
    } catch (error) {
      logError(error, "clubModule:getAllClubs", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES"); // Unlock tables
      db.release();
    }
  },

  // Check if a duplicate club exists
  checkDuplicateClub: async ({ clubName, clubAbbrevation, excludeClubID = null }) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      let query = `
        SELECT * FROM clubdata
        WHERE (clubName = ? OR clubAbbrevation = ?)
      `;
      const params = [clubName, clubAbbrevation];

      // Exclude the current club ID for edit operations
      if (excludeClubID) {
        query += " AND clubID != ?";
        params.push(excludeClubID);
      }

      const [result] = await db.query(query, params);
      return result.length > 0; // Return true if duplicate exists
    } catch (error) {
      logError(error, "clubModule:checkDuplicateClub", "db");
      throw error;
    } finally {
      db.release();
    }
  },

  // Add a club
  addClub: async (clubData) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      // Use WRITE lock to prevent other processes from modifying the table
      await db.query("LOCK TABLES clubdata WRITE");

      // Check if a duplicate club exists
      const duplicateExists = await clubModule.checkDuplicateClub({
        clubName: clubData.clubName,
        clubAbbrevation: clubData.clubAbbrevation,
      });
      if (duplicateExists) {
        return setResponseBadRequest("A club with the same name or abbreviation already exists.");
      }

      const query = `
        INSERT INTO clubdata (clubName, imageUrl, clubHead, clubAbbrevation, godName)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        clubData.clubName,
        clubData.imageUrl,
        clubData.clubHead,
        clubData.clubAbbrevation,
        clubData.godName,
      ];
      const [result] = await db.query(query, values);

      // Check if insertion was successful
      if (result.affectedRows === 0) {
        return setResponseInternalError("Could not insert club into the database.");
      }

      return setResponseOk({
        message: "Club added successfully",
        clubID: result.insertId,
      });
    } catch (error) {
      logError(error, "clubModule:addClub", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES"); // Unlock tables
      db.release();
    }
  },

  // Edit a club
  editClub: async (clubData) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      // Use WRITE lock to prevent other processes from modifying the table
      await db.query("LOCK TABLES clubdata WRITE");

      // Check if a duplicate club exists
      const duplicateExists = await clubModule.checkDuplicateClub({
        clubName: clubData.clubName,
        clubAbbrevation: clubData.clubAbbrevation,
        excludeClubID: clubData.clubID,
      });
      if (duplicateExists) {
        return setResponseBadRequest("A club with the same name or abbreviation already exists.");
      }

      const query = `
        UPDATE clubdata 
        SET clubName = ?, imageUrl = ?, clubHead = ?, clubAbbrevation = ?, godName = ?
        WHERE clubID = ?
      `;
      const values = [
        clubData.clubName,
        clubData.imageUrl,
        clubData.clubHead,
        clubData.clubAbbrevation,
        clubData.godName,
        clubData.clubID,
      ];
      const [result] = await db.query(query, values);

      if (result.affectedRows === 0) {
        return setResponseBadRequest("Club not found or no changes made.");
      }
      return setResponseOk("Club updated successfully.");
    } catch (error) {
      logError(error, "clubModule:editClub", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES"); // Unlock tables
      db.release();
    }
  },

  // Remove a club
  removeClub: async (clubID) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      // Use WRITE lock to prevent other processes from modifying the table
      await db.query("LOCK TABLES clubdata WRITE");

      const query = "DELETE FROM clubdata WHERE clubID = ?";
      const [result] = await db.query(query, [clubID]);

      if (result.affectedRows === 0) {
        return setResponseBadRequest("Club not found or already deleted.");
      }
      return setResponseOk("Club removed successfully.");
    } catch (error) {
      logError(error, "clubModule:removeClub", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES"); // Unlock tables
      db.release();
    }
  },
};

export default clubModule;
