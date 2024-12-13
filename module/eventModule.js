import {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
  setResponseTimedOut,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { pragatiDb } from "../db/poolConnection.js";

const eventModule = {
  addEvent: async function (
    eventName,
    imageUrl,
    eventFee,
    eventDescription,
    eventDescSmall,
    isGroup,
    eventDate,
    maxRegistrations,
    isPerHeadFee,
    godName,
    organizerIDs,
    tagIDs,
    clubID,
    minTeamSize,
    maxTeamSize
  ) {
    const db = await pragatiDb.promise().getConnection();
    try {
      var transactionStarted = 0;

      await db.beginTransaction();
      // Denotes that server entered the Transaction -> Needs rollback incase of error.
      transactionStarted = 1;
      const query = `
      INSERT INTO eventData (eventName, imageUrl, eventFee, eventDescription, eventDescSmall,
       isGroup, eventDate, maxRegistrations, isPerHeadFee, godName, minTeamSize, maxTeamSize)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const values = [
        eventName,
        imageUrl,
        eventFee,
        eventDescription,
        eventDescSmall,
        isGroup,
        eventDate,
        maxRegistrations,
        isPerHeadFee,
        godName,
        minTeamSize,
        maxTeamSize,
      ];
      const [insertData] = await db.query(query, values);
      const eventID = insertData.insertId;

      // Insert into organizerEventMapping table using a single query
      const organizerValues = organizerIDs.map((organizerID) => [
        organizerID,
        eventID,
      ]);

      await db.query(
        `INSERT INTO organizerEventMapping (organizerID, eventID)
        VALUES ?`,
        [organizerValues]
      );

      // Insert into tagEventMapping table using a single query
      const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);

      await db.query(
        `INSERT INTO tagEventMapping (tagID, eventID)
        VALUES ?`,
        [tagEventMapping]
      );

      // Insert into clubEventMapping table
      await db.query(
        `INSERT INTO clubEventMapping (clubID, eventID) values (?,?)`,
        [clubID, eventID]
      );

      await db.commit();
      return setResponseOk("Event added successfully");
    } catch (err) {
      if(transactionStarted === 1) {
        await db.rollback();
      }
      if(err.code == "ER_DUP_ENTRY") {
        return setResponseBadRequest("Event already found in database")
      }
      logError(err, "eventModule:addEvent", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default eventModule;
