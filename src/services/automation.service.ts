import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import { checkUUID } from "../utils";
import axios from "axios";
import { AutomationCreate, AutomationUpdate } from "../model/automation/automation";
import AutomationModel from "../model/automation/automation.model";
import DeviceModel from "../model/device/device.model";

class AutomationService {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static async getAutomationById(id: string, user_id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid automation id");
        }

        const automation = await AutomationModel.getAutomationById(id);
        if (!automation) {
            throw new NotFoundError("Automation not found");
        }
        //console.log(automation);

        const device = await DeviceModel.getDeviceById(automation.device_id);
        //console.log(device.user_id, user_id);
        if (!device || device.user_id !== user_id) {
            throw new ForbiddenError("Cannot get automation for other user's device");
        }

        return automation;
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static async getAutomationByUserId(userId: string) {
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid user id");
        }

        const automation = await AutomationModel.getAutomationByUserId(userId);
        return automation;
    }

    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static async getAutomationByDeviceId(deviceId: string, userId: string) {
        if (!checkUUID(deviceId)) {
            throw new BadRequestError("Invalid device id");
        }

        const device = await DeviceModel.getDeviceById(deviceId);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        if (device.user_id !== userId) {
            throw new ForbiddenError("Cannot get automation for other user's device");
        }

        const automation = await AutomationModel.getAutomationByDeviceId(deviceId);
        return automation;
    }

    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static async updateAutomation(id: string, updates: AutomationUpdate, userId: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid automation id");
        }

        // Check if there is no update
        if (Object.keys(updates).length === 0) {
            throw new BadRequestError("No update data");
        }

        if (updates.deviceId) {
            throw new ForbiddenError("Cannot update device id");
        }

        const automation = await AutomationModel.getAutomationById(id);
        if (!automation) {
            throw new NotFoundError("Automation not found");
        }

        const device = await DeviceModel.getDeviceById(automation.device_id);

        if (device.user_id !== userId) {
            throw new ForbiddenError("Cannot get automation for other user's device");
        }

        return await AutomationModel.updateAutomation(id, updates);
    }
    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static async deleteAutomation(id: string, userId: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid automation id");
        }

        const automation = await AutomationModel.getAutomationById(id);
        if (!automation) {
            throw new NotFoundError("Automation not found");
        }

        const device = await DeviceModel.getDeviceById(automation.device_id);

        if (!device || device.user_id !== userId) {
            throw new ForbiddenError("Cannot delete automation for other user's device");
        }

        await AutomationModel.deleteAutomation(id);

        return automation;
    }
    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static async createAutomation({ deviceId, name, low, high, description, action, isActive }: AutomationCreate, userId: string) {
        if (!checkUUID(deviceId)) {
            throw new BadRequestError("Invalid device id");
        }
        if (!name || !low || !high || !action) {
            throw new BadRequestError("name, low, high, action are required");
        }
        if (low > high) {
            throw new BadRequestError("low must be less than high");
        }

        const device = await DeviceModel.getDeviceById(deviceId);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        if (device.user_id !== userId) {
            throw new ForbiddenError("Cannot create automation for other user's device");
        }

        const result = await AutomationModel.createAutomation({ deviceId, name, low, high, description, action, isActive });
        return result;
    }
}

export default AutomationService;
