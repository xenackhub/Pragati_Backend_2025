import "dotenv/config.js";
import { appConfig } from "./config/config.js";
import { validateEnv } from "./config/new.js";

if(!validate()){
  console.error("[ERROR]: env varaiables validator failed!!")
}



// Imports for Express, CORS, Helmet
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";

// Multi-Processing.
import cluster from "cluster";

// Imports for database initialization
import initDatabase from "./db/schema/initDatabase.js"

// import function to create log directories.
import { initLog } from "./logs/initLog.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(json());

if (cluster.isPrimary) {
  console.info(`[LOG]: Parent ${process.pid} is Running.`);

  // Initialize the log directories.
  initLog();

  // Initialize the database with the schema.
  try {
    await initDatabase(appConfig.db.pragati.database);
    await initDatabase(appConfig.db.transactions.database);
  } catch (err) {
    console.error(`[ERROR]: Error in Initializing Database.`);
    console.error(err);
  }

  // Fork the processes.
  console.log(`[LOG]: Forking ${appConfig.numCPU} Processes.`);
  for (let i = 0; i < appConfig.numCPU; i++) {
    cluster.fork();
  }

  // If a worker dies, fork a new one.
  cluster.on('exit', (worker, code, signal) => {
    console.info('worker %d died (%s). restarting...', worker.process.pid, signal || code);
    cluster.fork();
  });

} else {
  app.listen(appConfig.PORT, (err) => {
    if (err) {
      console.error(`[ERROR]: Error in Starting Server !!`, err);
    } else {
      console.info(
        `[LOG]: Server ${process.pid} Listening in Port ${appConfig.PORT}`
      );
    }
  });
}
