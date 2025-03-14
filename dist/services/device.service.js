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
const app_1 = require("../app");
const device_model_1 = __importDefault(require("../model/device/device.model"));
class DeviceService {
    static getDeviceStateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
        });
    }
    static updateDeviceStateById(id, command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.getDeviceById(id);
            //console.log("DeviceService::updateDeviceStateById", device);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            app_1.adafruitService.publish(device.feet, command);
        });
    }
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static createDevice(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, name, type, status, room, feet }) {
            if (!user_id || !name || !type || !feet) {
                throw new errorRespone_1.ForbiddenError("user_id, name, type, feet are required");
            }
            const feedData = {
                name: feet,
                description: "This is a feed for " + name
            };
            const feed = yield app_1.adafruitService.createFeed(feedData);
            const blockData = {
                name: name,
                description: "This is a block for " + name,
                visual_type: type,
                size_x: 5,
                size_y: 5
            };
            const block = yield app_1.adafruitService.createBlock(blockData);
            const device = yield device_model_1.default.createDevice({ user_id, name, type, status, room, feet });
            return device;
        });
    }
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static getDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.getDeviceById(id);
            return device;
        });
    }
    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static getDeviceByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid user id");
            }
            const device = yield device_model_1.default.getDeviceByUserId(userId);
            return device;
        });
    }
    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static updateDevice(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            // Check if there is no update
            if (Object.keys(updates).length === 0) {
                throw new errorRespone_1.BadRequestError("No update data");
            }
            if (updates.feet) {
                throw new errorRespone_1.BadRequestError("Cannot update feet");
            }
            const device = yield device_model_1.default.updateDevice(id, updates);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            return device;
        });
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static deleteDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.deleteDevice(id);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            return device;
        });
    }
}
exports.default = DeviceService;
