"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const report_controller_1 = __importDefault(require("../../controllers/report.controller"));
const router = express_1.default.Router();
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.post("/generateMonthlyReport", (0, utils_1.asyncHandler)(report_controller_1.default.generateMonthlyReport));
router.post("/generateYearlyReport", (0, utils_1.asyncHandler)(report_controller_1.default.generateYearlyReport));
// router.post("/addEvent", asyncHandler(ReportController.addEvent)); // Not really necessary
// router.get("/event", asyncHandler(ReportController.getReportById));
// router.get("/event/:eventId", asyncHandler(ReportController.getReportById));
router.get("/", (0, utils_1.asyncHandler)(report_controller_1.default.getAllReport)); // get all report from date X to Y
router.get("/:reportId", (0, utils_1.asyncHandler)(report_controller_1.default.getReportById));
// router.delete("/event/:eventId", asyncHandler(ReportController.deleteEvent));
router.delete("/:reportId", (0, utils_1.asyncHandler)(report_controller_1.default.deleteReport));
// router.patch("/event/:eventId", asyncHandler(ReportController.updateEvent));
router.patch("/:reportId", (0, utils_1.asyncHandler)(report_controller_1.default.updateReport));
exports.default = router;
