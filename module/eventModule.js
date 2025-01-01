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
import { getEventQueryFormatter } from "../utilities/dbUtilities/eventUtilities.js";

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
        return setResponseBadRequest(organizersExists);
      }

      // Checking if club IDs are present in the database
      const clubsExists = await checkClubIDsExists([clubID], db);
      if (clubsExists !== null) {
        // console.log("Error Club not found");
        return setResponseBadRequest(clubsExists);
      }

      // Checking if tag IDs are present in the database
      const tagExists = await checkTagIDsExists(tagIDs, db);
      if (tagExists !== null) {
        // console.log("Error tag IDs not found");
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
      const [insertData] = await db.query(query, values); // explicit lock and unlock is not necessary in transactions
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
      await db.query(
        `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ`
      );
      const query = getEventQueryFormatter();
      const [events] = await db.query(query);
      if (events.length == 0) {
        return setResponseNotFound("No events found!");
      }
      return setResponseOk("All events selected", events);
    } catch (err) {
      logError(err, "eventModule:getAllEvents", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getEventDetailsByID: async function (eventID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query(
        `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ`
      );
      let query = getEventQueryFormatter({ eventID: eventID });
      const [event] = await db.query(query);
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
  getEventForClub: async function (clubID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query(
        `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ`
      );
      const query = getEventQueryFormatter({ clubID: clubID });
      const [events] = await db.query(query);

      if (events.length == 0) {
        return setResponseNotFound("No events found for the given club!");
      }
      return setResponseOk("Event selected", events);
    } catch (err) {
      logError(err, "eventModule:getEventDetailsByID", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getEventsRegisteredByUser: async function (userID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query(
        `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ,
        registrationData READ`
      );
      const [eventIDs] = await db.query(
        "SELECT eventID FROM registrationData WHERE userID = ?",
        [userID]
      );
      if (eventIDs.length == 0) {
        return setResponseNotFound("No registered events found for user.");
      }
      const eventIDsNew = eventIDs.map(
        (eventIDObject) => eventIDObject.eventID
      );
      const query = getEventQueryFormatter({ eventIDs: eventIDsNew });
      const [events] = await db.query(query);
      if (events.length == 0) {
        return setResponseNotFound("No registered events found for user.");
      }
      return setResponseOk("Registered events fetched", events);
    } catch (err) {
      logError(err, "eventModule:getEventsRegisteredByUser", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  editEvent: async function (
    eventID,
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
        return setResponseBadRequest(organizersExists);
      }

      // Checking if club IDs are present in the database
      const clubsExists = await checkClubIDsExists([clubID], db);
      if (clubsExists !== null) {
        // console.log("Error Club not found");
        return setResponseBadRequest(clubsExists);
      }

      // Checking if tag IDs are present in the database
      const tagExists = await checkTagIDsExists(tagIDs, db);
      if (tagExists !== null) {
        // console.log("Error tag IDs not found");
        return setResponseBadRequest(tagExists);
      }

      await db.beginTransaction();
      // Denotes that server entered the Transaction -> Needs rollback incase of error.
      transactionStarted = 1;
      // Update the event data
      const query = `
      UPDATE eventData
      SET 
      eventName = ?, 
      imageUrl = ?, 
      eventFee = ?, 
      eventDescription = ?, 
      eventDescSmall = ?, 
      isGroup = ?, 
      eventDate = ?, 
      maxRegistrations = ?, 
      isPerHeadFee = ?, 
      godName = ?, 
      minTeamSize = ?, 
      maxTeamSize = ?
      WHERE eventID = ?
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
        eventID,
      ];
      const [updateResult] = await db.query(query, values); // explicit lock and unlock is not necessary in transactions

      if (updateResult.affectedRows === 0) {
        await db.rollback();
        return setResponseBadRequest("Event not found or update failed");
      }

      // Clear existing mappings
      await db.query(`DELETE FROM organizerEventMapping WHERE eventID = ?`, [
        eventID,
      ]);
      await db.query(`DELETE FROM tagEventMapping WHERE eventID = ?`, [
        eventID,
      ]);
      await db.query(`DELETE FROM clubEventMapping WHERE eventID = ?`, [
        eventID,
      ]);

      // Re-inserting updated mappings
      const organizerValues = organizerIDs.map((organizerID) => [
        organizerID,
        eventID,
      ]);
      await db.query(
        `INSERT INTO organizerEventMapping (organizerID, eventID) VALUES ?`,
        [organizerValues]
      );

      const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);
      await db.query(`INSERT INTO tagEventMapping (tagID, eventID) VALUES ?`, [
        tagEventMapping,
      ]);

      await db.query(
        `INSERT INTO clubEventMapping (clubID, eventID) VALUES (?, ?)`,
        [clubID, eventID]
      );

      await db.commit();
      return setResponseOk("Event updated successfully");
    } catch (err) {
      if (transactionStarted === 1) {
        await db.rollback();
      }
      logError(err, "eventModule:editEvent", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  toggleStatus: async function (eventID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES eventData WRITE");
      const query = `UPDATE eventData
      SET eventStatus = CASE
          WHEN eventStatus = 1 THEN 0
          WHEN eventStatus = 0 THEN 1
          ELSE eventStatus
      END
      WHERE eventID = ?;`;
      const [updated] = await db.query(query, [eventID]);
      if (updated.affectedRows == 0)
        return setResponseBadRequest("Event not found!!");
      return setResponseOk("Event status updated successfully!");
    } catch (err) {
      logError(err, "eventModule:toggleStatus", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default eventModule;
