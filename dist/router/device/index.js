"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const device_controller_1 = __importDefault(require("../../controllers/device.controller"));
const router = express_1.default.Router();
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.get("/:id", (0, utils_1.asyncHandler)(device_controller_1.default.getDeviceById));
router.get("/user/:userId", (0, utils_1.asyncHandler)(device_controller_1.default.getDeviceByUserId));
router.patch("/:id", (0, utils_1.asyncHandler)(device_controller_1.default.updateDevice));
router.delete("/:id", (0, utils_1.asyncHandler)(device_controller_1.default.deleteDevice));
router.post("/", (0, utils_1.asyncHandler)(device_controller_1.default.createDevice));
router.get("/state/:id", (0, utils_1.asyncHandler)(device_controller_1.default.getDeviceStateById));
router.post("/control/:id", (0, utils_1.asyncHandler)(device_controller_1.default.updateDeviceStateById));
exports.default = router;
