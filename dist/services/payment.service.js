"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRespone_1 = require("../helper/errorRespone");
const payment_model_1 = __importDefault(require("../model/payment.model"));
const utils_1 = require("../utils");
class PaymentService {
    static getAllPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield payment_model_1.default.getAllPayment({ offset, limit });
            return result;
        });
    }
    static insertPayment(user_id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id || !amount)
                throw new errorRespone_1.BadRequestError("user_id and amount must not be null");
            if (amount <= 0)
                throw new errorRespone_1.BadRequestError("Amount must be larger than 0.");
            const result = yield payment_model_1.default.insertPayment(user_id, amount);
            if (result === null)
                throw new errorRespone_1.BadRequestError("Failed to insert payment.");
            return result;
        });
    }
    static getPaymentByTime(startTime_1, endTime_1, _a) {
        return __awaiter(this, arguments, void 0, function* (startTime, endTime, { offset, limit }) {
            if (startTime && !(0, utils_1.isValidTimestamp)(startTime)) {
                throw new errorRespone_1.BadRequestError('Invalid startTime format.');
            }
            if (endTime && !(0, utils_1.isValidTimestamp)(endTime)) {
                throw new errorRespone_1.BadRequestError('Invalid endTime format..');
            }
            if (startTime && endTime) {
                // Convert startTime and endTime to Date objects for comparison
                const startDate = new Date(startTime);
                const endDate = new Date(endTime);
                // Check if endTime is greater than or equal to startTime
                if (endDate < startDate) {
                    throw new errorRespone_1.BadRequestError('endTime must be greater than or equal to startTime.');
                }
            }
            const result = yield payment_model_1.default.getPaymentByTime(startTime, endTime, { offset, limit });
            return result;
        });
    }
    static getPaymentByUserID(user_id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (user_id, { offset, limit }) {
            if (!user_id)
                throw new errorRespone_1.BadRequestError("User Id cannot be null.");
            const result = yield payment_model_1.default.getPaymentByUserID(user_id, { offset, limit });
            return result;
        });
    }
}
exports.default = PaymentService;
