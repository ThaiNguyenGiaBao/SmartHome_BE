"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const app_1 = __importDefault(require("./app"));
const app_2 = require("./app");
const socket_io_1 = require("socket.io");
const configEnv_1 = __importDefault(require("./configs/configEnv"));
const port = configEnv_1.default.app.port;
const env = process.env.NODE_ENV || "dev";
const server = app_1.default.listen(port, () => {
    console.log(`Environment: ${env}\nServer is running on port ${port}`);
});
//adafruitService.pullEnvLogData();   // TEMPORARY TURNED OFF
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
exports.io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});
app_2.adafruitService.on("newReading", (data) => {
    exports.io.emit("newReading", data);
    console.log("New reading:", data);
});
process.on("SIGINT", () => {
    app_2.adafruitService.stopPullEnvLogData();
    server.close(() => console.log("Server has been disconnected"));
});
