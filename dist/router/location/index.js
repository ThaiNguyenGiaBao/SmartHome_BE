"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const location_controller_1 = __importDefault(require("../../controllers/location.controller"));
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const router = express_1.default.Router();
router.get("/", (0, utils_1.asyncHandler)(location_controller_1.default.getLocation));
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.post("/", (0, utils_1.asyncHandler)(location_controller_1.default.insertLocation));
router.patch("/:id", (0, utils_1.asyncHandler)(location_controller_1.default.updateLocation));
router.delete("/:id", (0, utils_1.asyncHandler)(location_controller_1.default.deleteLocation));
exports.default = router;
