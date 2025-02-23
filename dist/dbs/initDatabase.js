"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db;
// Create a new pool instance
try {
    db = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false // Allows self-signed certificates, set to true in production for security
        }
    });
}
catch (err) {
    console.log("Error in creating pool", err.message);
}
// Connect to the PostgreSQL database
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => {
    console.error("Connection error", err.stack);
});
setInterval(() => {
    db.query("SELECT * FROM users");
    console.log("Query DBS...");
}, 60000);
exports.default = db;
