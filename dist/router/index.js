"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const printJob_1 = __importDefault(require("./printJob"));
const user_1 = __importDefault(require("./user"));
const file_1 = __importDefault(require("./file"));
const printer_1 = __importDefault(require("./printer"));
const config_1 = __importDefault(require("./config"));
const payment_1 = __importDefault(require("./payment"));
const report_1 = __importDefault(require("./report"));
const location_1 = __importDefault(require("./location"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", access_1.default);
// /api/auth/signup
router.use("/api/printjob", printJob_1.default);
router.use("/api/user", user_1.default);
router.use("/api/file", file_1.default);
router.use("/api/printer", printer_1.default);
router.use("/api/config", config_1.default);
router.use("/api/payment", payment_1.default);
router.use("/api/report", report_1.default);
router.use("/api/location", location_1.default);
exports.default = router;
