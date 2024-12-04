const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");
const helmet = require("helmet");

const numCPU = os.availableParallelism();

// Imports for database initialization
const createConnection = require("./db/initializeConnection.js");
const initDatabase = require("./db/schema/initDatabase.js");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

if (cluster.isPrimary) {
  console.log(`[LOG]: Parent ${process.pid} is Running.`);
  console.log(`[LOG]: Forking ${numCPU} Processes.`);
  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }

  const[pragatiDB, pragatiTransactionsDB] = createConnection();

  initDatabase(pragatiDB, "Pragati");
  initDatabase(pragatiTransactionsDB, "pragathiTransactions");

} else {
    const port = process.env.SERVER_PORT || 5000;
  app.listen(port, (err) => {
    if (err) {
      console.log(`[ERROR]: Error in Starting Server !!`, err);
    } else {
      console.log(
        `[LOG]: Server ${process.pid} Listening in Port ${process.env.PORT}`
      );
    }
  });
}