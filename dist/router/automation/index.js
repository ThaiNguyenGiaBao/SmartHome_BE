"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const automation_controller_1 = __importDefault(require("../../controllers/automation.controller"));
const router = express_1.default.Router();
router.get("/user", (0, utils_1.asyncHandler)(automation_controller_1.default.getAutomationByUserId));
router.get("/device/:deviceId", (0, utils_1.asyncHandler)(automation_controller_1.default.getAutomationByDeviceId));
router.get("/:id", (0, utils_1.asyncHandler)(automation_controller_1.default.getAutomationById));
router.patch("/:id", (0, utils_1.asyncHandler)(automation_controller_1.default.updateAutomation));
router.delete("/:id", (0, utils_1.asyncHandler)(automation_controller_1.default.deleteAutomation));
router.post("/", (0, utils_1.asyncHandler)(automation_controller_1.default.createAutomation));
exports.default = router;
