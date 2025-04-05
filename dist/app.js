"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adafruitService = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const index_1 = __importDefault(require("./router/index"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adafruit_service_1 = __importDefault(require("./services/adafruit.service"));
exports.adafruitService = new adafruit_service_1.default();
exports.adafruitService.connect();
//adafruitService.pullEnvLogData();
exports.adafruitService.subscribe("living-room-light-feed-1", (topic, message) => {
    console.log("AdafruitService::subscribe", topic, message);
});
exports.adafruitService.subscribe("living-room-light-feed-1", (topic, message) => {
    console.log("AdafruitService::subscribe", topic, message);
});
const app = (0, express_1.default)();
// init middleware
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true, // This is a security issue, allowing all origins
    credentials: true // This allows cookies to be sent/received
    //methods: ["GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS"] // Allow OPTIONS for preflight
}));
app.use((0, cookie_parser_1.default)());
// init router
app.use("/api", index_1.default);
// handle errors
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log("Error::", error.message);
    res.json({
        status: "error",
        message: error.message
    });
});
exports.default = app;
