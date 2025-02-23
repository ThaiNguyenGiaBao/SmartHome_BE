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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorRespone_1 = require("../helper/errorRespone");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        throw new errorRespone_1.UnauthorizedError("No token provided");
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret", (err, member) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw new errorRespone_1.UnauthorizedError("Invalid token");
        }
        req.user = member;
        console.log("User authenticated::", req.user);
        next();
    }));
});
exports.authenticateToken = authenticateToken;
