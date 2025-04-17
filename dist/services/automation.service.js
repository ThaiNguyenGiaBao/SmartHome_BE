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
const automation_model_1 = __importDefault(require("../model/automation/automation.model"));
const device_model_1 = __importDefault(require("../model/device/device.model"));
class AutomationService {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static getAutomationById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid automation id");
            }
            const automation = yield automation_model_1.default.getAutomationById(id);
            if (!automation) {
                throw new errorRespone_1.NotFoundError("Automation not found");
            }
            //console.log(automation);
            const device = yield device_model_1.default.getDeviceById(automation.device_id);
            //console.log(device.user_id, user_id);
            if (!device || device.user_id !== user_id) {
                throw new errorRespone_1.ForbiddenError("Cannot get automation for other user's device");
            }
            return automation;
        });
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static getAutomationByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid user id");
            }
            const automation = yield automation_model_1.default.getAutomationByUserId(userId);
            return automation;
        });
    }
    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static getAutomationByDeviceId(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(deviceId)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.getDeviceById(deviceId);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            if (device.user_id !== userId) {
                throw new errorRespone_1.ForbiddenError("Cannot get automation for other user's device");
            }
            const automation = yield automation_model_1.default.getAutomationByDeviceId(deviceId);
            return automation;
        });
    }
    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static updateAutomation(id, updates, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid automation id");
            }
            // Check if there is no update
            if (Object.keys(updates).length === 0) {
                throw new errorRespone_1.BadRequestError("No update data");
            }
            if (updates.deviceId) {
                throw new errorRespone_1.ForbiddenError("Cannot update device id");
            }
            const automation = yield automation_model_1.default.getAutomationById(id);
            if (!automation) {
                throw new errorRespone_1.NotFoundError("Automation not found");
            }
            const device = yield device_model_1.default.getDeviceById(automation.device_id);
            if (device.user_id !== userId) {
                throw new errorRespone_1.ForbiddenError("Cannot get automation for other user's device");
            }
            return yield automation_model_1.default.updateAutomation(id, updates);
        });
    }
    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static deleteAutomation(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid automation id");
            }
            const automation = yield automation_model_1.default.getAutomationById(id);
            if (!automation) {
                throw new errorRespone_1.NotFoundError("Automation not found");
            }
            const device = yield device_model_1.default.getDeviceById(automation.device_id);
            if (!device || device.user_id !== userId) {
                throw new errorRespone_1.ForbiddenError("Cannot delete automation for other user's device");
            }
            yield automation_model_1.default.deleteAutomation(id);
            return automation;
        });
    }
    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static createAutomation(_a, userId_1) {
        return __awaiter(this, arguments, void 0, function* ({ deviceId, name, low, high, description, action, is_active, category }, userId) {
            if (!(0, utils_1.checkUUID)(deviceId)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            if (!name || low == undefined || high == undefined || !action) {
                throw new errorRespone_1.BadRequestError("name, low, high, action are required");
            }
            if (low > high) {
                throw new errorRespone_1.BadRequestError("low must be less than high");
            }
            const device = yield device_model_1.default.getDeviceById(deviceId);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            if (device.user_id !== userId) {
                throw new errorRespone_1.ForbiddenError("Cannot create automation for other user's device");
            }
            const result = yield automation_model_1.default.createAutomation({ deviceId, name, low, high, description, action, is_active, category });
            return result;
        });
    }
}
exports.default = AutomationService;
