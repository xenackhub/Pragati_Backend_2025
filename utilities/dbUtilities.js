import poolConnectToDb from "../db/poolConnection.js";

// Check if a user exists by email
const isUserExistsByEmail = async function (email) {
  const [pragatiDb] = poolConnectToDb();
  const db = await pragatiDb.promise().getConnection();
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
      "SELECT COUNT(*) AS count FROM userData WHERE userEmail = ?",
      [email]
    );
    await db.query("UNLOCK TABLES");
    return result[0].count > 0;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByEmail: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
    db.release();
  }
};

// Check if a user exists by userID
const isUserExistsByUserID = async function (userID) {
  const [pragatiDb] = poolConnectToDb();
  const db = await pragatiDb.promise().getConnection();
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
      "SELECT COUNT(*) AS count FROM userData WHERE userID = ?",
      [userID]
    );
    await db.query("UNLOCK TABLES");
    return result[0].count > 0;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByUserID: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
    db.release();
  }
};

export { isUserExistsByEmail, isUserExistsByUserID };
