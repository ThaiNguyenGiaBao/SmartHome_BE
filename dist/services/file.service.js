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
const uploadFile_1 = __importDefault(require("../utils/uploadFile"));
const file_model_1 = __importDefault(require("../model/file.model"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
class FileService {
    static getPdfPageCount(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.mimetype === "application/pdf") {
                try {
                    const pdfData = yield (0, pdf_parse_1.default)(file.buffer);
                    return pdfData.numpages;
                }
                catch (error) {
                    console.error("Error parsing PDF:", error);
                    return null;
                }
            }
            return null; // Return null if the file is not a PDF
        });
    }
    // router.post("/upload", upload.single("file"), asyncHandler(FileController.uploadFile));
    static uploadFile(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const uniqueFilename = `${timestamp}-${file.originalname}`;
            let pageCount = yield this.getPdfPageCount(file);
            const downloadURL = yield (0, uploadFile_1.default)({
                originalname: uniqueFilename,
                buffer: file.buffer,
                mimetype: file.mimetype
            });
            pageCount = pageCount == null ? 1 : pageCount;
            const newFile = yield file_model_1.default.createFile({
                uniqueFilename,
                downloadURL,
                userId,
                file,
                numpage: pageCount
            });
            return newFile;
        });
    }
    //router.get("/", asyncHandler(FileController.getAllFiles));
    static getAllFiles(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            return yield file_model_1.default.getAllFiles({ page, limit });
        });
    }
    static getFileById(userId, fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileId) {
                throw new errorRespone_1.BadRequestError("File Id is required");
            }
            const file = yield file_model_1.default.getFileById(fileId);
            if (!file) {
                throw new errorRespone_1.NotFoundError("File not found");
            }
            return file;
        });
    }
    // router.get("/:userId", asyncHandler(FileController.getFile));
    static getFileByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            const file = yield file_model_1.default.getFileByUserId(userId);
            if (file.length === 0) {
                return [];
            }
            return file;
        });
    }
    // router.delete("/delete", asyncHandler(FileController.deleteFile));
    static deleteFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, fileId }) {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            if (!fileId) {
                throw new errorRespone_1.BadRequestError("File Id is required");
            }
            const file = yield file_model_1.default.getFileById(fileId);
            if (!file) {
                throw new errorRespone_1.NotFoundError("File not found");
            }
            return yield file_model_1.default.softDeleteFile(fileId);
            //return await FileModel.deleteFile(fileId);
        });
    }
}
exports.default = FileService;
