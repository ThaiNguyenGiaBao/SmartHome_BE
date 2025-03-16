"use strict";
// router.get("/:id", asyncHandler(AutomationController.getAutomationById));
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
const automation_service_1 = __importDefault(require("../services/automation.service"));
class AutomationController {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static getAutomationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::getAutomationById", req.params.id);
            return new successResponse_1.OK({
                message: "Automation fetched successfully",
                data: yield automation_service_1.default.getAutomationById(req.params.id, req.user.id)
            }).send(res);
        });
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static getAutomationByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::getAutomationByUserId");
            return new successResponse_1.OK({
                message: "Automation fetched successfully",
                data: yield automation_service_1.default.getAutomationByUserId(req.user.id)
            }).send(res);
        });
    }
    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static updateAutomation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::updateAutomation", req.params.id, req.body);
            return new successResponse_1.OK({
                message: "Automation updated successfully",
                data: yield automation_service_1.default.updateAutomation(req.params.id, req.body, req.user.id)
            }).send(res);
        });
    }
    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static getAutomationByDeviceId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::getAutomationByDeviceId", req.params.deviceId);
            return new successResponse_1.OK({
                message: "Automation fetched successfully",
                data: yield automation_service_1.default.getAutomationByDeviceId(req.params.deviceId, req.user.id)
            }).send(res);
        });
    }
    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static deleteAutomation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::deleteAutomation", req.params.id);
            return new successResponse_1.OK({
                message: "Automation deleted successfully",
                data: yield automation_service_1.default.deleteAutomation(req.params.id, req.user.id)
            }).send(res);
        });
    }
    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static createAutomation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("AutomationController::createAutomation", req.body);
            return new successResponse_1.Created({
                message: "Automation created successfully",
                data: yield automation_service_1.default.createAutomation(req.body, req.user.id)
            }).send(res);
        });
    }
}
exports.default = AutomationController;
