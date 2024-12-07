import { appendFileSync } from "fs";

const logError = (err, location, type) => {
  const timeStamp = new Date().toLocaleString();
  const errMessage = `[ERROR]: Occured at ${location} \n ${timeStamp} - ${err.message}`;
  console.error(errMessage);
  if (type == "connection") {
    appendFileSync("./logs/connection/poolConnection.log", `${errMessage}\n`);
  } else if (type == "db") {
    appendFileSync("./logs/db/dbErrors.log", `${errMessage}\n`);
  }
};

export { logError };
