"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const adafruit_service_1 = __importDefault(require("./services/adafruit/adafruit.service"));
const subject_1 = __importDefault(require("./services/Observer/subject"));
exports.adafruitService = adafruit_service_1.default.getInstance();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.adafruitService.connect();
    }
    catch (error) {
        console.error("Failed to connect to Adafruit IO:", error);
    }
}))();
const smokeSubject = new subject_1.default("smoke");
smokeSubject.listen();
const lightSubject = new subject_1.default("light");
lightSubject.listen();
const fireSubject = new subject_1.default("fire");
fireSubject.listen();
const hourSubject = new subject_1.default("hour");
hourSubject.listen();
// setInterval(() => {
//     const currentHour = new Date().getHours();
//     // convert hour to floating point number
//     const currentHourFloat = parseFloat(currentHour.toString());
//     console.log("Current hour:", currentHourFloat);
//     hourSubject.notify({ room: "all", rawValue: currentHour });
// }, 1000); // every hour
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
