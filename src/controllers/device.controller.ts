import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import DeviceService from "../services/device.service";

class DeviceController {
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static async createDevice(req: Request, res: Response) {
        console.log("DeviceController::createDevice", req.body);
        return new Created({
            message: "Device created successfully",
            data: await DeviceService.createDevice(req.body, req.user.id)
        }).send(res);
    }

    // router.get("/async", asyncHandler(DeviceController.syncBlocksDatabaseAdafruitIo));
    static async syncBlocksDatabaseAdafruitIo(req: Request, res: Response) {
        console.log("DeviceController::asyncBlock");
        return new OK({
            message: "Async block",
            data: await DeviceService.syncBlocksDatabaseAdafruitIo()
        }).send(res);
    }

    // router.get("/state/:id", asyncHandler(DeviceController.getDeviceStateById));
    static async getDeviceStateById(req: Request, res: Response) {
        console.log("DeviceController::getAllDeviceStateById", req.params.id);
        return new OK({
            message: "Device state fetched successfully",
            data: await DeviceService.getDeviceStateById(req.params.id)
        }).send(res);
    }

    static async getAllRooms(req: Request, res: Response) {
        console.log("DeviceController::getAllRooms");
        return new OK({
            message: "Device rooms fetched successfully",
            data: await DeviceService.getAllRooms()
        }).send(res);
    }

    static async getAllCategory(req: Request, res: Response) {
        console.log("DeviceController::getAllCategory");
        return new OK({
            message: "Device categories fetched successfully",
            data: await DeviceService.getAllCategory()
        }).send(res);
    }

    // router.post("/control/:id?command", asyncHandler(DeviceController.updateDeviceStateById));
    static async updateDeviceStateById(req: Request, res: Response) {
        console.log("DeviceController::updateDeviceStateById", req.params.id, req.query.command);
        return new OK({
            message: "Device state updated successfully",
            data: await DeviceService.updateDeviceStateById(req.params.id, req.query.command as string)
        }).send(res);
    }

    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static async getDeviceById(req: Request, res: Response) {
        console.log("DeviceController::getDeviceById", req.params.id);
        return new OK({
            message: "Device fetched successfully",
            data: await DeviceService.getDeviceById(req.params.id)
        }).send(res);
    }

    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static async getDeviceByUserId(req: Request, res: Response) {
        console.log("DeviceController::getDeviceByUserId", req.user.id);
        return new OK({
            message: "Device fetched by user id successfully",
            data: await DeviceService.getDeviceByUserId(req.user.id)
        }).send(res);
    }

    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static async updateDevice(req: Request, res: Response) {
        console.log("DeviceController::updateDevice", req.params.id, req.body);
        return new OK({
            message: "Device updated successfully",
            data: await DeviceService.updateDevice(req.params.id, req.body)
        }).send(res);
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static async deleteDevice(req: Request, res: Response) {
        console.log("DeviceController::deleteDevice", req.params.id);
        return new OK({
            message: "Device deleted successfully",
            data: await DeviceService.deleteDevice(req.params.id)
        }).send(res);
    }

    static async getAllUniqueRooms(req: Request, res: Response) {
        console.log("DeviceController::getAllUniqueRooms");
        return new OK({
            message: "Device rooms fetched successfully",
            data: await DeviceService.getAllUniqueRooms()
        }).send(res);
    }
}

export default DeviceController;
