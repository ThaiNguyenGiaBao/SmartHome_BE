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
        connectionString: process.env.DATABASE_URL
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
exports.default = db;
