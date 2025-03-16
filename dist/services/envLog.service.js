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
const utils_1 = require("../utils");
const envLog_model_1 = __importDefault(require("../model/envLog/envLog.model"));
class EnvLogService {
    static createLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.deviceId || !(0, utils_1.checkUUID)(data.deviceId)) {
                throw new errorRespone_1.BadRequestError("Invalid device ID.");
            }
            return envLog_model_1.default.createLog(data);
        });
    }
    static getLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid Log ID.");
            }
            const log = yield envLog_model_1.default.getLogById(id);
            if (!log) {
                throw new errorRespone_1.NotFoundError("EnvLog not found.");
            }
            return log;
        });
    }
    static updateLog(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid Log ID.");
            }
            if (data.deviceId && !(0, utils_1.checkUUID)(data.deviceId)) {
                throw new errorRespone_1.BadRequestError("Invalid device ID.");
            }
            const updatedLog = yield envLog_model_1.default.updateLog(id, data);
            if (!updatedLog) {
                throw new errorRespone_1.NotFoundError("EnvLog not found for update.");
            }
            return updatedLog;
        });
    }
    static deleteLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid Log ID.");
            }
            const deleted = yield envLog_model_1.default.deleteLog(id);
            if (!deleted) {
                throw new errorRespone_1.NotFoundError("EnvLog not found to delete.");
            }
            return true;
        });
    }
    static getAllLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return envLog_model_1.default.getAllLogs();
        });
    }
    static getLogsByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(deviceId)) {
                throw new errorRespone_1.BadRequestError("Invalid device ID.");
            }
            return envLog_model_1.default.getLogsByDeviceId(deviceId);
        });
    }
}
exports.default = EnvLogService;
