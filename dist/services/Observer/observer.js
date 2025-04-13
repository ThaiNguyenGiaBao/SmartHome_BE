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
const device_model_1 = __importDefault(require("../../model/device/device.model"));
const device_service_1 = __importDefault(require("../device.service"));
class DeviceObserver {
    static update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ room, device_id, action }) {
            const device = yield device_model_1.default.getDeviceById(device_id);
            if (room == "all" || (device && device.room === room)) {
                console.log("Automation triggered on device:: ", device.name);
                device_service_1.default.updateDeviceStateById(device.id, action);
            }
        });
    }
}
exports.default = DeviceObserver;
