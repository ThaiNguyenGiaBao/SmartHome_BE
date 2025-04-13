"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const envLog_controller_1 = __importDefault(require("../../controllers/envLog.controller"));
const router = express_1.default.Router();
router.post("/", (0, utils_1.asyncHandler)(envLog_controller_1.default.createLog));
router.get("/:id", (0, utils_1.asyncHandler)(envLog_controller_1.default.getLogById));
router.get("/", (0, utils_1.asyncHandler)(envLog_controller_1.default.getAllLogs));
router.patch("/update/:id", (0, utils_1.asyncHandler)(envLog_controller_1.default.updateLog));
router.delete("/:id", (0, utils_1.asyncHandler)(envLog_controller_1.default.deleteLog));
router.get("/device/:deviceId", (0, utils_1.asyncHandler)(envLog_controller_1.default.getLogsByDeviceId));
exports.default = router;
