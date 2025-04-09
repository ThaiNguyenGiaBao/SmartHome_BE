const { Pool } = require("pg");
import dotenv from "dotenv";
dotenv.config();

let db: any;
// Create a new pool instance
try {
    db = new Pool({
        connectionString: process.env.DATABASE_URL
    });
} catch (err: any) {
    console.log("Error in creating pool", err.message);
}

// Connect to the PostgreSQL database
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: any) => {
        console.error("Connection error", err.stack);
    });

export default db;
