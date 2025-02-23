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
const successResponse_1 = require("../helper/successResponse");
const payment_service_1 = __importDefault(require("../services/payment.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
class PaymentController {
    static insertPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //if(req.user.role != "admin") throw new ForbiddenError("Only admin can insert payment."); 
            const userBalance = yield user_service_1.default.getUserBalance(req.body.user_id);
            const result = yield payment_service_1.default.insertPayment(req.body.user_id, req.body.amount);
            const updatedUser = yield user_service_1.default.updateUserBalance(req.body.user_id, userBalance + req.body.amount);
            return new successResponse_1.OK({
                data: {
                    user: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        coinBalance: updatedUser.coinbalance,
                    },
                    payment: result,
                },
                message: "Insert payment successfully."
            }).send(res);
        });
    }
    static getPaymentByUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
            const offset = (page - 1) * limit;
            const result = yield payment_service_1.default.getPaymentByUserID(req.params.user_id, { offset, limit });
            return new successResponse_1.OK({
                data: result,
                message: "Get payment by user ID successfully."
            }).send(res);
        });
    }
    static getPaymentByTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
            const offset = (page - 1) * limit;
            const startTime = req.query.startTime;
            const endTime = req.query.endTime;
            let result = null;
            if (!startTime && !endTime)
                result = yield payment_service_1.default.getAllPayment({ offset, limit });
            else
                result = yield payment_service_1.default.getPaymentByTime(startTime, endTime, { offset, limit });
            return new successResponse_1.OK({
                data: result,
                message: "Get payment successfully.",
            }).send(res);
        });
    }
}
exports.default = PaymentController;
