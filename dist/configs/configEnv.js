"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT || "3001", 10)
    }
};
const product = {
    app: {
        port: parseInt(process.env.PRODUCT_APP_PORT || "3001", 10)
    }
};
const config = { dev, product };
const env = process.env.NODE_ENV || "dev";
exports.default = config[env];
