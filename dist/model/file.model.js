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
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
class FileModel {
    static createFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uniqueFilename, downloadURL, userId, file, numpage }) {
            const newFile = yield initDatabase_1.default.query("INSERT INTO file (filename, url, userId, type, numpage) VALUES ($1,$2, $3, $4, $5) RETURNING *", [
                uniqueFilename,
                downloadURL,
                userId,
                file.mimetype,
                numpage
            ]);
            return newFile.rows[0];
        });
    }
    static getAllFiles(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            const files = yield initDatabase_1.default.query("SELECT * FROM file LIMIT $1 OFFSET $2", [limit, (page - 1) * limit]);
            return files.rows;
        });
    }
    static getFileByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield initDatabase_1.default.query("SELECT * FROM file WHERE userId = $1", [userId]);
            return file.rows;
        });
    }
    static deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield initDatabase_1.default.query("DELETE FROM file WHERE id = $1 RETURNING *", [fileId]);
            return file.rows[0];
        });
    }
    static softDeleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield initDatabase_1.default.query("UPDATE file SET isDeleted = true WHERE id = $1 RETURNING *", [fileId]);
            return file.rows[0];
        });
    }
    static getFileById(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield initDatabase_1.default.query("SELECT * FROM file WHERE id = $1", [fileId]);
            return file.rows[0];
        });
    }
}
exports.default = FileModel;
