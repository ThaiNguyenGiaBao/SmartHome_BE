"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
const router = express_1.default.Router();
router.get("/me", (0, utils_1.asyncHandler)(user_controller_1.default.getMe));
router.get("/:userId", (0, utils_1.asyncHandler)(user_controller_1.default.getUser));
router.get("/", (0, utils_1.asyncHandler)(user_controller_1.default.getAllUsers));
router.patch("/update/:userId", (0, utils_1.asyncHandler)(user_controller_1.default.updateUser));
// router.delete("/:userId", asyncHandler(UserController.deleteUser));
exports.default = router;
