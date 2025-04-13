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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../model/user/user.model"));
dotenv_1.default.config();
const ACCESS_TOKEN_EXPIRATION = "5000"; // 5 seconds
const REFRESH_TOKEN_EXPIRATION = "1m"; // 1 minute (all for testing purposes)
class AccessService {
    static SignUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password }) {
            if (!email || !username || !password) {
                throw new errorRespone_1.BadRequestError("Email, username, password are required");
            }
            // check if email is already used
            const user = yield user_model_1.default.findUserByEmail(email);
            if (user) {
                throw new errorRespone_1.BadRequestError("Email is already used");
            }
            const avatarUrl = "https://avatar.iran.liara.run/username?username=" + username;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const result = yield user_model_1.default.createUser({
                username,
                email,
                password: hashedPassword,
                avatarUrl
            });
            return result;
        });
    }
    static SignIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            if (!email || !password) {
                throw new errorRespone_1.BadRequestError("Email and password are required");
            }
            const user = yield user_model_1.default.findUserByEmail(email);
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            if (yield bcrypt_1.default.compare(password, user.password)) {
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: ACCESS_TOKEN_EXPIRATION });
                const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_TOKEN_SECRET || "verysecret", { expiresIn: REFRESH_TOKEN_EXPIRATION });
                delete user.password;
                return Object.assign(Object.assign({}, user), { accessToken,
                    refreshToken });
            }
            else {
                throw new errorRespone_1.ForbiddenError("Invalid password");
            }
        });
    }
    static SignOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    static RefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new errorRespone_1.BadRequestError("Refresh token is required");
            }
            try {
                const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || "verysecret");
                const user = yield user_model_1.default.findUserById(payload.id);
                if (!user) {
                    throw new errorRespone_1.NotFoundError("User not found");
                }
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: ACCESS_TOKEN_EXPIRATION });
                return { accessToken };
            }
            catch (error) {
                throw new errorRespone_1.ForbiddenError("Invalid refresh token");
            }
        });
    }
}
exports.default = AccessService;
