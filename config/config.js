import { availableParallelism } from "os";

const numCPU = availableParallelism();

export const appConfig = {
    PORT: process.env.SERVER_PORT || 5000,
    numCPU: numCPU,
    db: {
        pragati: {
            host: 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PWD || 'password',
            database: 'pragati_2025',
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true
        },
        transactions: {
            host: 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PWD || 'password',
            database: 'pragati_transactions_2025',
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true
        }
    },
    tokenSecretKey: process.env.SECRET_KEY
}
