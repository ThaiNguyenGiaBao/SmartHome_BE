"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const file_controller_1 = __importDefault(require("../../controllers/file.controller"));
const multer_1 = __importDefault(require("../../configs/multer"));
const router = express_1.default.Router();
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.get("/", (0, utils_1.asyncHandler)(file_controller_1.default.getAllFiles));
router.get("/:fileId", (0, utils_1.asyncHandler)(file_controller_1.default.getFileById));
router.get("/user/:userId", (0, utils_1.asyncHandler)(file_controller_1.default.getFileByUserId));
router.post("/upload", multer_1.default.single("file"), (0, utils_1.asyncHandler)(file_controller_1.default.uploadFile));
router.delete("/delete", (0, utils_1.asyncHandler)(file_controller_1.default.deleteFile));
exports.default = router;
