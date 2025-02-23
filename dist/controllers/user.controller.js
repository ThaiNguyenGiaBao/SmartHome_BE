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
const user_service_1 = __importDefault(require("../services/user.service"));
const errorRespone_1 = require("../helper/errorRespone");
class UserController {
    //router.get("/:userId", asyncHandler(UserController.getUser));
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("GetUserProfile::", req.params);
            if (req.params.userId == "me") {
                return new successResponse_1.Created({
                    message: "Get user profile successfully",
                    data: yield user_service_1.default.getUser(req.user.id)
                }).send(res);
            }
            if (req.user.id != req.params.userId && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("You are not allowed to access this resource");
            }
            return new successResponse_1.Created({
                message: "Get user profile successfully",
                data: yield user_service_1.default.getUser(req.params.userId)
            }).send(res);
        });
    }
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("GetAllUsers::", req.query);
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("You are not allowed to get all users");
            }
            return new successResponse_1.OK({
                message: "Get all users successfully",
                data: yield user_service_1.default.getAllUsers({ page, limit })
            }).send(res);
        });
    }
    // router.patch("/:userId", asyncHandler(UserController.updateUser));
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("UpdateUserProfile::", req.params, req.body);
            if (req.user.id != req.params.userId && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("You are not allowed to update this resource");
            }
            return new successResponse_1.OK({
                message: "Update user profile successfully",
                data: yield user_service_1.default.updateUser(req.params.userId, req.body)
            }).send(res);
        });
    }
    // router.delete("/:userId", asyncHandler(UserController.deleteUser));
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeleteUserProfile::", req.params);
            if (req.user.id != req.params.userId && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("You are not allowed to delete this resource");
            }
            return new successResponse_1.OK({
                message: "Delete user profile successfully",
                data: yield user_service_1.default.deleteUser(req.params.userId)
            }).send(res);
        });
    }
}
exports.default = UserController;
