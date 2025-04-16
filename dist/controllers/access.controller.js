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
const access_service_1 = __importDefault(require("../services/access.service"));
const successResponse_1 = require("../helper/successResponse");
const errorRespone_1 = require("../helper/errorRespone");
class AccessController {
    static SignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AccessController::SignUp", req.body);
            const { username, email, password } = req.body;
            return new successResponse_1.Created({
                message: "User created successfully",
                data: yield access_service_1.default.SignUp({
                    username,
                    email,
                    password
                })
            }).send(res);
        });
    }
    static SignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AccessController::SignIn", req.body);
            const data = yield access_service_1.default.SignIn(req.body);
            return new successResponse_1.OK({
                message: "User signed in successfully",
                data: data
            }).send(res);
        });
    }
    static SignOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AccessController::SignOut", req.body);
            yield access_service_1.default.SignOut();
            return new successResponse_1.OK({
                message: "User signed out successfully",
                data: null
            }).send(res);
        });
    }
    static RefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AccessController::RefreshToken", req.body);
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                throw new errorRespone_1.BadRequestError("Refresh token is required");
            }
            const data = yield access_service_1.default.RefreshToken(refreshToken);
            return new successResponse_1.OK({
                message: "Token refreshed successfully",
                data: data
            }).send(res);
        });
    }
    static VerifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("AccessController::VerifyToken", req.body);
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                throw new errorRespone_1.BadRequestError("Token is required");
            }
            const data = yield access_service_1.default.VerifyToken(token);
            return new successResponse_1.OK({
                message: "Token verified successfully",
                data: data
            }).send(res);
        });
    }
}
exports.default = AccessController;
