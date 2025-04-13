"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const user_1 = __importDefault(require("./user"));
const device_1 = __importDefault(require("./device"));
const automation_1 = __importDefault(require("./automation"));
const envLog_1 = __importDefault(require("./envLog"));
const utils_1 = require("../utils");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Hello World huidcsdcsdc" });
});
router.use("/auth", access_1.default);
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.use("/user", user_1.default);
router.use("/device", device_1.default);
router.use("/automation", automation_1.default);
router.use("/envlog", envLog_1.default);
exports.default = router;
