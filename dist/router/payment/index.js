"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const payment_controller_1 = __importDefault(require("../../controllers/payment.controller"));
const router = express_1.default.Router();
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.get("/", (0, utils_1.asyncHandler)(payment_controller_1.default.getPaymentByTime));
router.get("/:user_id", (0, utils_1.asyncHandler)(payment_controller_1.default.getPaymentByUserID));
router.post("/", (0, utils_1.asyncHandler)(payment_controller_1.default.insertPayment));
exports.default = router;
