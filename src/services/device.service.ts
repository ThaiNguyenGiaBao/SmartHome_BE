import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import { checkUUID } from "../utils";
import { adafruitService } from "../app";
import { BlockService } from "./adafruit/block.service";
import { FeedService } from "./adafruit/feed.service";
import Device, { DeviceCreate, DeviceUpdate, Feed } from "../model/device/device";
import DeviceModel from "../model/device/device.model";
import axios from "axios";

class DeviceService {
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static async createDevice({ name, type, room, category }: DeviceCreate, user_id: string) {
        if (!user_id || !name || !type) {
            throw new ForbiddenError("user_id, name, type, feet are required");
        }

        const blockData = {
            name: name,
            description: "This is a block for " + name,
            visual_type: type,
            size_x: 3,
            size_y: 3,
            x: 0,
            y: 0
        };

        const block = await BlockService.createBlock(blockData);

        const feedData: Feed = {
            name: name, // Feed name is the same as device name
            description: "This is a feed for " + name
        };

        const feed = await FeedService.createFeed(feedData);
        const device = await DeviceModel.createDevice({ user_id, name, type, room, feed_key: feed.key, block_id: block.id, category });
        return device;
    }

    static async syncBlocksDatabaseAdafruitIo() {
        const blocks = await BlockService.getAllBlocks();
        //console.log("Blocks", blocks.data);
        for (const block of blocks.data) {
            const device = await DeviceModel.getDeviceByBlockId(block.id);
            if (!device) {
                // Delete the block if the device is not found
                await BlockService.deleteBlockById(block.id);
            }
        }

        const feeds = await FeedService.getAllFeeds();
        //console.log("Feeds", feeds.data);
        for (const feed of feeds.data) {
            const device = await DeviceModel.getDeviceIdByFeed(feed.key);
            if (!device) {
                // Delete the feed if the device is not found
                await FeedService.deleteFeedById(feed.key);
            }
        }
    }

    static async getDeviceStateById(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }

        const device = await DeviceModel.getDeviceById(id);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        const endpoint = `https://io.adafruit.com/api/v2/${adafruitService.username}/feeds/${device.feed_key}/data`;
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

        adafruitService.publish(device.feed_key, command);
    }

    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static async getDeviceById(id: string) {
        if (!checkUUID(id)) {
            throw new BadRequestError("Invalid device id");
        }
        const device: Device = await DeviceModel.getDeviceById(id);
        device.state = await FeedService.getStatusFeed(device.feed_key);
        console.log(device.state);

        return device;
    }

    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static async getDeviceByUserId(userId: string) {
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid user id");
        }

        const deviceList = await DeviceModel.getDeviceByUserId(userId);

        // Promise all
        const devicePromises = deviceList.map(async (device: Device) => {
            device.state = await FeedService.getStatusFeed(device.feed_key);
            return device;
        });
        const deviceListWithState: Device[] = await Promise.all(devicePromises);

        return deviceListWithState;
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

        if (updates.feed_key) {
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

        const device = await DeviceModel.getDeviceById(id);
        if (!device) {
            throw new NotFoundError("Device not found");
        }

        // Delete the block and feed from Adafruit IO
        await BlockService.deleteBlockById(device.block_id);
        await FeedService.deleteFeedById(device.feed_key);

        await DeviceModel.deleteDevice(id);

        return device;
    }

    static async getDeviceIdByFeed(feedId: string) {
        const device = await DeviceModel.getDeviceIdByFeed(feedId);
        if (!device) {
            throw new NotFoundError("Device not found");
        }
        return device;
    }

    static async getAllUniqueRooms() {
        const rooms = await DeviceModel.getAllUniqueRooms();
        if (!rooms) {
            throw new NotFoundError("No devices found");
        }
        return rooms;
    }
}

export default DeviceService;
