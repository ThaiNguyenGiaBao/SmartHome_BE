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
const storage_1 = require("firebase/storage");
const firebase_1 = __importDefault(require("../configs/firebase"));
function uploadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the file object is provided
            if (!file) {
                throw new Error("No file provided for upload.");
            }
            // Generate a unique filename using the current timestamp
            const timestamp = Date.now();
            const uniqueFilename = `${timestamp}-${file.originalname}`;
            const storageRef = (0, storage_1.ref)(firebase_1.default, file.originalname);
            // Upload the file to Firebase Storage
            yield (0, storage_1.uploadBytes)(storageRef, file.buffer, {
                contentType: file.mimetype
            });
            // Get the download URL of the uploaded file
            const downloadURL = yield (0, storage_1.getDownloadURL)(storageRef);
            return downloadURL; // Return the download URL
        }
        catch (error) {
            console.error("Upload error:", error.message);
            throw new Error(error.message);
        }
    });
}
exports.default = uploadFile;
