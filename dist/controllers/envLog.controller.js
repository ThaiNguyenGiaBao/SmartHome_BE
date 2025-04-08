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
const envLog_service_1 = __importDefault(require("../services/envLog.service"));
class EnvLogController {
    static createLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("EnvLogController::createLog::", req.body);
            const newLog = yield envLog_service_1.default.createLog(req.body);
            return new successResponse_1.Created({
                message: "EnvLog created successfully",
                data: newLog
            }).send(res);
        });
    }
    static getLogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("EnvLogController::getLogById::", req.params);
            const { id } = req.params;
            const log = yield envLog_service_1.default.getLogById(id);
            return new successResponse_1.OK({
                message: "EnvLog retrieved successfully",
                data: log
            }).send(res);
        });
    }
    static updateLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("EnvLogController::updateLog::", req.params, req.body);
            const { id } = req.params;
            const updatedLog = yield envLog_service_1.default.updateLog(id, req.body);
            return new successResponse_1.OK({
                message: "EnvLog updated successfully",
                data: updatedLog
            }).send(res);
        });
    }
    static deleteLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield envLog_service_1.default.deleteLog(id);
            return new successResponse_1.OK({
                message: "EnvLog deleted successfully"
            }).send(res);
        });
    }
    static getAllLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("EnvLogController::getAllLogs::");
            const logs = yield envLog_service_1.default.getAllLogs();
            return new successResponse_1.OK({
                message: "All EnvLogs retrieved",
                data: logs
            }).send(res);
        });
    }
    static getLogsByDeviceId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("EnvLogController::getLogsByDeviceId::", req.params);
            const { deviceId } = req.params;
            const logs = yield envLog_service_1.default.getLogsByDeviceId(deviceId);
            return new successResponse_1.OK({
                message: "EnvLogs by deviceId retrieved",
                data: logs
            }).send(res);
        });
    }
}
exports.default = EnvLogController;
