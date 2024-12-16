import {
  setResponseOk,
  setResponseBadRequest,
  setResponseInternalError,
  setResponseNotFound,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { pragatiDb } from "../db/poolConnection.js";
import { checkClubIDsExists } from "../utilities/dbUtilities/clubUtilities.js";
import { checkOrganizerIDsExists } from "../utilities/dbUtilities/organizerUtilities.js";
import { checkTagIDsExists } from "../utilities/dbUtilities/tagUtilities.js";

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
    var transactionStarted = 0;
    try {
      // Checking if organizer IDs are present in the database
      const organizersExists = await checkOrganizerIDsExists(organizerIDs, db);
      if (organizersExists !== null) {
        await db.rollback();
        return setResponseBadRequest(organizersExists);
      }

      // Checking if club IDs are present in the database
      const clubsExists = await checkClubIDsExists([clubID], db);
      if (clubsExists !== null) {
        console.log("Error Club not found");
        await db.rollback();
        return setResponseBadRequest(clubsExists);
      }

      // Checking if tag IDs are present in the database
      const tagExists = await checkTagIDsExists(tagIDs, db);
      if (tagExists !== null) {
        console.log("Error tag IDs not found");
        await db.rollback();
        return setResponseBadRequest(tagExists);
      }

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
      if (eventID == null) {
        await db.rollback();
        return setResponseInternalError("Could not add event properly");
      }

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
      if (transactionStarted === 1) {
        await db.rollback();
      }
      if (err.code == "ER_DUP_ENTRY") {
        return setResponseBadRequest("Event already found in database");
      }
      logError(err, "eventModule:addEvent", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getAllEvents: async function () {
    const db = await pragatiDb.promise().getConnection();
    try {
      const [events] = await db.query("SELECT * FROM eventData");
      if (events.length == 0) {
        return setResponseNotFound("No events found!");
      }
      return setResponseOk("All events selected", events);
    } catch (err) {
      logError(err, "eventModule:getAllEvents", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },
  getEventDetailsByID: async function (eventID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES eventData READ");
      const [event] = await db.query(
        "SELECT * FROM eventData WHERE eventID = ?",
        [eventID]
      );
      if (event.length == 0) {
        return setResponseNotFound("No events found!");
      }
      return setResponseOk("Event selected", event);
    } catch (err) {
      logError(err, "eventModule:getEventDetailsByID", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default eventModule;
