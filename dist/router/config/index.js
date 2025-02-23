"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const config_controller_1 = __importDefault(require("../../controllers/config.controller"));
const router = express_1.default.Router();
// Get config 
router.get("/", (0, utils_1.asyncHandler)(config_controller_1.default.getConfigSettings));
router.get("/filetype", (0, utils_1.asyncHandler)(config_controller_1.default.getPermitedFile));
router.get("/page", (0, utils_1.asyncHandler)(config_controller_1.default.getPageConfig));
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
// Set Filetype config
router.post("/filetype", (0, utils_1.asyncHandler)(config_controller_1.default.addPermitedFile));
router.patch("/filetype/:type", (0, utils_1.asyncHandler)(config_controller_1.default.updatePermitedFile));
router.delete("/filetype/:type", (0, utils_1.asyncHandler)(config_controller_1.default.deletePermitedFile));
// Update given page settings
router.patch("/page", (0, utils_1.asyncHandler)(config_controller_1.default.updatePageConfig));
exports.default = router;
