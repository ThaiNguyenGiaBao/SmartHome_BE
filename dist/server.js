"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const configEnv_1 = __importDefault(require("./configs/configEnv"));
const port = configEnv_1.default.app.port;
const env = process.env.NODE_ENV || "dev";
const server = app_1.default.listen(port, () => {
    console.log(`Environment: ${env}\nServer is running on port ${port}`);
});
process.on("SIGINT", () => {
    server.close(() => console.log("Server has been disconnected"));
});
