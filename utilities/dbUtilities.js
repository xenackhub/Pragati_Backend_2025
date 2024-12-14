import { logError } from "./errorLogger.js";

// Check if a user exists by email
const isUserExistsByEmail = async function (email, db) {
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
      "SELECT * FROM userData WHERE userEmail = ?",
      [email]
    );
    await db.query("UNLOCK TABLES");
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByEmail: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
  }
};

/*
  Response Codes:
  responseCode = 401 -> User Not Found || Account Blocked by Admin,
  responseCode = 403 -> User not Verified,
  responseCode = 200 -> User Exists and Account is Active.
*/
const checkValidUser = async function (userEmail, db, category, userID) {
  const response = {
    responseCode: 200,
    responseBody: { MESSAGE: "User Data Fetched" },
    responseData: null,
  };

  try {
    let userData = null;
    if (category === "userEmail")
      userData = await isUserExistsByEmail(userEmail, db);
    else if (category === "userID")
      userData = await isUserExistsByUserID(userID, db);
    if (userData == null) {
      response.responseCode = 401;
      response.responseBody.MESSAGE = "User Not Found";
      return response;
    }

    if (userData[0].accountStatus === "0") {
      response.responseCode = 401;
      response.responseBody.MESSAGE = "Account Blocked by Admin !";
      return response;
    } else if (userData[0].accountStatus === "1") {
      response.responseCode = 403;
      response.responseBody.MESSAGE = "Account Not Verified";
      return response;
    }

    response.responseData = userData;
    return response;
  } catch (error) {
    console.error("[ERROR]: Error in checkValidUser Utility: ", error);
    throw new Error("Database query failed.");
  }
};

// Check if a user exists by userID
const isUserExistsByUserID = async function (userID, db) {
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query("SELECT * FROM userData WHERE userID = ?", [
      userID,
    ]);
    await db.query("UNLOCK TABLES");
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByUserID: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
  }
};

const checkTagIDsExists = async function (tagIDs, db) {
  try {
    await db.query("LOCK TABLES tagData READ");
    const [result] = await db.query(
      "SELECT tagID FROM tagData WHERE tagID IN (?)",
      [tagIDs]
    );
    await db.query("UNLOCK TABLES");
    if (result.length != tagIDs.length) {
      return "Some or all tag IDs not found in database";
    }
    return null;
  } catch (err) {
    logError(err, "checkTagIDsExists", "db");
    return "Error Occured";
  }
};

const checkOrganizerIDsExists = async function (organizerIDs, db) {
  try {
    await db.query("LOCK TABLES organizerData READ");
    const [result] = await db.query(
      "SELECT organizerID FROM organizerData WHERE organizerID IN (?)",
      [organizerIDs]
    );
    await db.query("UNLOCK TABLES");
    if (result.length != organizerIDs.length) {
      return "Some or all organizer IDs not found in database";
    }
    return null;
  } catch (err) {
    logError(err, "checkOrganizerIDsExists", "db");
    return "Error Occured";
  }
};

const checkClubIDsExists = async function (clubIDs, db) {
  try {
    await db.query("LOCK TABLES clubData READ");
    const [result] = await db.query(
      "SELECT clubID FROM clubData WHERE clubID IN (?)",
      [clubIDs]
    );
    await db.query("UNLOCK TABLES");
    if (result.length != clubIDs.length) {
      return "Some or all club IDs not found in database";
    }
    return null;
  } catch (err) {
    logError(err, "checkClubIDsExists", "db");
    return "Error Occured";
  }
};

export {
  isUserExistsByEmail,
  isUserExistsByUserID,
  checkValidUser,
  checkTagIDsExists,
  checkOrganizerIDsExists,
  checkClubIDsExists,
};
