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
            res.cookie("token", data.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
            return new successResponse_1.OK({
                message: "User signed in successfully",
                data: data
            }).send(res);
        });
    }
}
exports.default = AccessController;
