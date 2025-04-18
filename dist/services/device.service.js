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
const block_service_1 = require("./adafruit/block.service");
const feed_service_1 = require("./adafruit/feed.service");
const device_model_1 = __importDefault(require("../model/device/device.model"));
const axios_1 = __importDefault(require("axios"));
class DeviceService {
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static createDevice(_a, user_id_1) {
        return __awaiter(this, arguments, void 0, function* ({ name, type, room, category }, user_id) {
            if (!user_id || !name || !type) {
                throw new errorRespone_1.ForbiddenError("user_id, name, type, feet are required");
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
            const block = yield block_service_1.BlockService.createBlock(blockData);
            const feedData = {
                name: name, // Feed name is the same as device name
                description: "This is a feed for " + name
            };
            const feed = yield feed_service_1.FeedService.createFeed(feedData);
            const device = yield device_model_1.default.createDevice({ user_id, name, type, room, feed_key: feed.key, block_id: block.id, category });
            return device;
        });
    }
    static syncBlocksDatabaseAdafruitIo() {
        return __awaiter(this, void 0, void 0, function* () {
            const blocks = yield block_service_1.BlockService.getAllBlocks();
            //console.log("Blocks", blocks.data);
            for (const block of blocks.data) {
                const device = yield device_model_1.default.getDeviceByBlockId(block.id);
                if (!device) {
                    // Delete the block if the device is not found
                    yield block_service_1.BlockService.deleteBlockById(block.id);
                }
            }
            const feeds = yield feed_service_1.FeedService.getAllFeeds();
            //console.log("Feeds", feeds.data);
            for (const feed of feeds.data) {
                const device = yield device_model_1.default.getDeviceIdByFeed(feed.key);
                if (!device) {
                    // Delete the feed if the device is not found
                    yield feed_service_1.FeedService.deleteFeedById(feed.key);
                }
            }
        });
    }
    static getDeviceStateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.getDeviceById(id);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            const endpoint = `https://io.adafruit.com/api/v2/${app_1.adafruitService.username}/feeds/${device.feed_key}/data`;
            const response = yield axios_1.default.get(endpoint, {
                headers: {
                    "X-AIO-Key": app_1.adafruitService.aioKey
                }
            });
            return response.data;
        });
    }
    static getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield device_model_1.default.getAllUniqueRooms();
            console.log("DeviceService::getAllRooms", rooms);
            return rooms;
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
            app_1.adafruitService.publish(device.feed_key, command);
        });
    }
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static getDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(id)) {
                throw new errorRespone_1.BadRequestError("Invalid device id");
            }
            const device = yield device_model_1.default.getDeviceById(id);
            device.state = yield feed_service_1.FeedService.getStatusFeed(device.feed_key);
            console.log(device.state);
            return device;
        });
    }
    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static getDeviceByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.checkUUID)(userId)) {
                throw new errorRespone_1.BadRequestError("Invalid user id");
            }
            const deviceList = yield device_model_1.default.getDeviceByUserId(userId);
            // Promise all
            const devicePromises = deviceList.map((device) => __awaiter(this, void 0, void 0, function* () {
                device.state = yield feed_service_1.FeedService.getStatusFeed(device.feed_key);
                return device;
            }));
            const deviceListWithState = yield Promise.all(devicePromises);
            return deviceListWithState;
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
            if (updates.feed_key) {
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
            const device = yield device_model_1.default.getDeviceById(id);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            // Delete the block and feed from Adafruit IO
            yield block_service_1.BlockService.deleteBlockById(device.block_id);
            yield feed_service_1.FeedService.deleteFeedById(device.feed_key);
            yield device_model_1.default.deleteDevice(id);
            return device;
        });
    }
    static getDeviceIdByFeed(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_model_1.default.getDeviceIdByFeed(feedId);
            if (!device) {
                throw new errorRespone_1.NotFoundError("Device not found");
            }
            return device;
        });
    }
    static getAllUniqueRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield device_model_1.default.getAllUniqueRooms();
            if (!rooms) {
                throw new errorRespone_1.NotFoundError("No devices found");
            }
            return rooms;
        });
    }
}
exports.default = DeviceService;
