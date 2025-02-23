"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// configs/multerConfig.ts
const multer_1 = __importDefault(require("multer"));
// Configure Multer for file uploads
const storage = multer_1.default.memoryStorage(); // Use memory storage to hold files in memory
const upload = (0, multer_1.default)({ storage }); // Create the multer instance with storage options
exports.default = upload;
