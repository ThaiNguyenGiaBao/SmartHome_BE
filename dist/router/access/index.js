"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_controller_1 = __importDefault(require("../../controllers/access.controller"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const router = express_1.default.Router();
router.post("/signin", (0, utils_1.asyncHandler)(access_controller_1.default.SignIn));
router.post("/signup", (0, utils_1.asyncHandler)(access_controller_1.default.SignUp));
router.post("/refresh", (0, utils_1.asyncHandler)(access_controller_1.default.RefreshToken));
router.get("/verify", (0, utils_1.asyncHandler)(access_controller_1.default.VerifyToken));
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.post("/signout", (0, utils_1.asyncHandler)(access_controller_1.default.SignOut));
// /api/auth/
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
exports.default = router;
