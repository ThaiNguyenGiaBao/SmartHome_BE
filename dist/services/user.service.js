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
const utils_1 = require("../utils");
const user_model_1 = __importDefault(require("../model/user.model"));
class UserService {
    static getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid input syntax for type uuid");
            }
            const user = yield user_model_1.default.findUserById(userId);
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            return user;
        });
    }
    static getAllUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            const users = yield user_model_1.default.getAllUsers({ page, limit });
            return users;
        });
    }
    // // router.patch("/:userId", asyncHandler(UserController.updateUser));
    static updateUser(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { email, username, password, avatarUrl, coinBalance }) {
            console.log("UpdateUserProfile::", userId, email, username, password, avatarUrl, coinBalance);
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid input syntax for type uuid");
            }
            const user = yield user_model_1.default.findUserById(userId);
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid input syntax for type uuid");
            }
            // Prepare update query parts
            const updates = [];
            const values = [];
            const updatedUser = yield user_model_1.default.updateUser(userId, {
                email,
                username,
                password,
                avatarUrl,
                coinBalance
            });
            console.log("Updated user", updatedUser);
            return updatedUser;
        });
    }
    // // router.delete("/:userId", asyncHandler(UserController.deleteUser));
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid input syntax for type uuid");
            }
            const user = yield user_model_1.default.findUserById(userId);
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            const deletedUser = yield user_model_1.default.deleteUser(userId);
            return deletedUser;
        });
    }
    static getUserBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findUserById(userId);
            if (!user)
                throw new errorRespone_1.NotFoundError("User not found");
            return user.coinbalance;
        });
    }
    static updateUserBalance(userId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.updateUser(userId, { coinBalance: value });
            return user;
        });
    }
}
exports.default = UserService;
