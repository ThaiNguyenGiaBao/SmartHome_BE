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
exports.ConfigService = void 0;
const errorRespone_1 = require("../helper/errorRespone");
const page_model_1 = __importDefault(require("../model/page.model"));
const permitedFile_model_1 = __importDefault(require("../model/permitedFile.model"));
class ConfigService {
    static getPermitedFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield permitedFile_model_1.default.findAllPermitedFiles({ offset, limit });
            return result;
        });
    }
    static addPermitedFile(permitedFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (permitedFile.type === undefined) {
                throw new errorRespone_1.BadRequestError("Permited File Type must be neither null nor undefined");
            }
            const result = yield permitedFile_model_1.default.addPermitedFile(permitedFile);
            if (result === null) {
                throw new errorRespone_1.BadRequestError("Cannot add this file type!");
            }
            return result;
        });
    }
    static updatePermitedFile(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type)
                throw new errorRespone_1.BadRequestError("File type is required.");
            const values = Object.values(data);
            values.forEach((value) => {
                if (!value)
                    throw new errorRespone_1.BadRequestError("Updated value cannot be null | undefined!");
            });
            const result = yield permitedFile_model_1.default.updatePermitedFile(type, data);
            if (result === null)
                throw new errorRespone_1.BadRequestError("Cannot update this permited file config.");
            return result;
        });
    }
    static deletePermitedFile(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield permitedFile_model_1.default.deletePermitedFile(type);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot find that permited file type!");
            return result;
        });
    }
    static getPageConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield page_model_1.default.getPageConfig();
            if (config === null) {
                throw new errorRespone_1.NotFoundError("Configuration not found!");
            }
            return config;
        });
    }
    static updatePageConfig(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.dategivenpage === undefined && data.defaultnumpage === undefined)
                throw new errorRespone_1.BadRequestError("'dategivenpage' or 'defaultNumPage' must be given.");
            if (data.dategivenpage && isNaN(Date.parse(data.dategivenpage)))
                throw new errorRespone_1.BadRequestError("Not valid date format!");
            const result = yield page_model_1.default.updatePageConfig(data);
            if (result === null)
                throw new errorRespone_1.BadRequestError("Update unsuccessfully");
            return result;
        });
    }
}
exports.ConfigService = ConfigService;
