// router.get("/:id", asyncHandler(AutomationController.getAutomationById));

// router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));

// router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
// router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));

// router.post("/", asyncHandler(AutomationController.createAutomation));

import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import AutomationService from "../services/automation.service";

class AutomationController {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static async getAutomationById(req: Request, res: Response) {
        console.log("AutomationController::getAutomationById", req.params.id);
        return new OK({
            message: "Automation fetched successfully",
            data: await AutomationService.getAutomationById(req.params.id, req.user.id)
        }).send(res);
    }

    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static async getAutomationByUserId(req: Request, res: Response) {
        console.log("AutomationController::getAutomationByUserId");
        return new OK({
            message: "Automation fetched successfully",
            data: await AutomationService.getAutomationByUserId(req.user.id)
        }).send(res);
    }

    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static async updateAutomation(req: Request, res: Response) {
        console.log("AutomationController::updateAutomation", req.params.id, req.body);
        return new OK({
            message: "Automation updated successfully",
            data: await AutomationService.updateAutomation(req.params.id, req.body, req.user.id)
        }).send(res);
    }

    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static async getAutomationByDeviceId(req: Request, res: Response) {
        console.log("AutomationController::getAutomationByDeviceId", req.params.deviceId);
        return new OK({
            message: "Automation fetched successfully",
            data: await AutomationService.getAutomationByDeviceId(req.params.deviceId, req.user.id)
        }).send(res);
    }

    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static async deleteAutomation(req: Request, res: Response) {
        console.log("AutomationController::deleteAutomation", req.params.id);
        return new OK({
            message: "Automation deleted successfully",
            data: await AutomationService.deleteAutomation(req.params.id, req.user.id)
        }).send(res);
    }

    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static async createAutomation(req: Request, res: Response) {
        console.log("AutomationController::createAutomation", req.body);
        return new Created({
            message: "Automation created successfully",
            data: await AutomationService.createAutomation(req.body, req.user.id)
        }).send(res);
    }
}

export default AutomationController;
