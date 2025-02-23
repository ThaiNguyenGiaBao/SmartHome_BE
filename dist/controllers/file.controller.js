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
const errorRespone_1 = require("../helper/errorRespone");
const file_service_1 = __importDefault(require("../services/file.service"));
class FileController {
    static uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FileController::uploadFile", req.body);
            if (!req.file) {
                throw new errorRespone_1.BadRequestError("File is required");
            }
            return new successResponse_1.Created({
                message: "File uploaded successfully",
                data: yield file_service_1.default.uploadFile(req.user.id, {
                    originalname: req.file.originalname,
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype
                })
            }).send(res);
        });
    }
    static getFileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FileController::getFileById", req.params.fileId);
            if (!req.user.id && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting file by id");
            }
            return new successResponse_1.OK({
                message: "Get file successfully",
                data: yield file_service_1.default.getFileById(req.user.id, req.params.fileId)
            }).send(res);
        });
    }
    // authenticate token
    // if(req.body.userRole == "admin")
    static deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FileController::deleteFile", req.body);
            if (!req.user.id && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Permission denied on deleting file");
            }
            return new successResponse_1.OK({
                message: "File deleted successfully",
                data: yield file_service_1.default.deleteFile({ userId: req.user.id, fileId: req.body.fileId })
            }).send(res);
        });
    }
    //router.get("/", asyncHandler(FileController.getAllFiles));
    static getAllFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FileController::getAllFiles");
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting all files");
            }
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            return new successResponse_1.OK({
                message: "Get all files successfully",
                data: yield file_service_1.default.getAllFiles({ page, limit })
            }).send(res);
        });
    }
    // router.get("/:userId", asyncHandler(FileController.getFile));
    static getFileByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FileController::getFile", req.params.userId);
            if (req.user.id != req.params.userId && req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting file");
            }
            return new successResponse_1.OK({
                message: "Get file successfully",
                data: yield file_service_1.default.getFileByUserId(req.params.userId)
            }).send(res);
        });
    }
}
exports.default = FileController;
