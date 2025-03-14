import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import { checkUUID } from "../utils";
import { adafruitService } from "../app";
import { DeviceCreate, DeviceUpdate, Feed } from "../model/device/device";
import DeviceModel from "../model/device/device.model";
import axios from "axios";

import { BlockFeed, Block } from "../model/device/device";

class DeviceService {
    static async getDeviceStateById(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }

        const device = await DeviceModel.getDeviceById(id);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        const endpoint = `https://io.adafruit.com/api/v2/${adafruitService.username}/feeds/${device.feed}/data`;
        const response = await axios.get(endpoint, {
            headers: {
                "X-AIO-Key": adafruitService.aioKey
            }
        });

        return response.data;
    }

    static async getCurrentDeviceStateById(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }

        const device = await DeviceModel.getDeviceById(id);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        const endpoint = `https://io.adafruit.com/api/v2/${adafruitService.username}/feeds/${device.feed}/data/last`;
        const response = await axios.get(endpoint, {
            headers: {
                "X-AIO-Key": adafruitService.aioKey
            }
        });

        return response.data;
    }

    static async updateDeviceStateById(id: string, command: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }

        const device = await DeviceModel.getDeviceById(id);
        //console.log("DeviceService::updateDeviceStateById", device);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        adafruitService.publish(device.feet, command);
    }

    // router.post("/", asyncHandler(DeviceController.createDevice));
    static async createDevice({ user_id, name, type, status, room, feet }: DeviceCreate) {
        if (!user_id || !name || !type || !feet) {
            throw new ForbiddenError("user_id, name, type, feet are required");
        }

        const feedData: Feed = {
            name: feet,
            description: "This is a feed for " + name
        };

        const feed = await adafruitService.createFeed(feedData);

        const blockData = {
            name: name,
            description: "This is a block for " + name,
            visual_type: type,
            size_x: 5,
            size_y: 5
        };

        const block = await adafruitService.createBlock(blockData);

        const device = await DeviceModel.createDevice({ user_id, name, type, status, room, feet });
        return device;
    }
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static async getDeviceById(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }
        const device = await DeviceModel.getDeviceById(id);

        return device;
    }

    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static async getDeviceByUserId(userId: string) {
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid user id");
        }

        const device = await DeviceModel.getDeviceByUserId(userId);

        return device;
    }

    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static async updateDevice(id: string, updates: DeviceUpdate) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }

        // Check if there is no update
        if (Object.keys(updates).length === 0) {
            throw new BadRequestError("No update data");
        }

        if (updates.feet) {
            throw new BadRequestError("Cannot update feet");
        }

        const device = await DeviceModel.updateDevice(id, updates);
        if (!device) {
            throw new NotFoundError("Device not found");
        }
        return device;
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static async deleteDevice(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }
        const device = await DeviceModel.deleteDevice(id);
        if (!device) {
            throw new NotFoundError("Device not found");
        }
        return device;
    }
}

export default DeviceService;
