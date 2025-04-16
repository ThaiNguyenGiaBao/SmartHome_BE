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
const device_service_1 = __importDefault(require("../services/device.service"));
class DeviceController {
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static createDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::createDevice", req.body);
            return new successResponse_1.Created({
                message: "Device created successfully",
                data: yield device_service_1.default.createDevice(req.body, req.user.id)
            }).send(res);
        });
    }
    // router.get("/async", asyncHandler(DeviceController.syncBlocksDatabaseAdafruitIo));
    static syncBlocksDatabaseAdafruitIo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::asyncBlock");
            return new successResponse_1.OK({
                message: "Async block",
                data: yield device_service_1.default.syncBlocksDatabaseAdafruitIo()
            }).send(res);
        });
    }
    // router.get("/state/:id", asyncHandler(DeviceController.getDeviceStateById));
    static getDeviceStateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::getAllDeviceStateById", req.params.id);
            return new successResponse_1.OK({
                message: "Device state fetched successfully",
                data: yield device_service_1.default.getDeviceStateById(req.params.id)
            }).send(res);
        });
    }
    // router.post("/control/:id?command", asyncHandler(DeviceController.updateDeviceStateById));
    static updateDeviceStateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::updateDeviceStateById", req.params.id, req.query.command);
            return new successResponse_1.OK({
                message: "Device state updated successfully",
                data: yield device_service_1.default.updateDeviceStateById(req.params.id, req.query.command)
            }).send(res);
        });
    }
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static getDeviceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::getDeviceById", req.params.id);
            return new successResponse_1.OK({
                message: "Device fetched successfully",
                data: yield device_service_1.default.getDeviceById(req.params.id)
            }).send(res);
        });
    }
    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static getDeviceByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::getDeviceByUserId", req.user.id);
            return new successResponse_1.OK({
                message: "Device fetched by user id successfully",
                data: yield device_service_1.default.getDeviceByUserId(req.user.id)
            }).send(res);
        });
    }
    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static updateDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::updateDevice", req.params.id, req.body);
            return new successResponse_1.OK({
                message: "Device updated successfully",
                data: yield device_service_1.default.updateDevice(req.params.id, req.body)
            }).send(res);
        });
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static deleteDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::deleteDevice", req.params.id);
            return new successResponse_1.OK({
                message: "Device deleted successfully",
                data: yield device_service_1.default.deleteDevice(req.params.id)
            }).send(res);
        });
    }
    static getAllUniqueRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DeviceController::getAllUniqueRooms");
            return new successResponse_1.OK({
                message: "Device rooms fetched successfully",
                data: yield device_service_1.default.getAllUniqueRooms()
            }).send(res);
        });
    }
}
exports.default = DeviceController;
