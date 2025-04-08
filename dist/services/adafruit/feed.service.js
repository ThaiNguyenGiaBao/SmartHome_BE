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
exports.FeedService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const errorRespone_1 = require("../../helper/errorRespone");
const app_1 = require("../../app");
dotenv_1.default.config();
class FeedService {
    static createFeed(feedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedEndpoint = `https://io.adafruit.com/api/v2/${FeedService.username}/feeds`;
            try {
                const response = yield axios_1.default.post(feedEndpoint, feedData, {
                    headers: {
                        "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
                        "Content-Type": "application/json"
                    }
                });
                console.log("Feed created successfully:", response.data);
                // automatically subscribe to the new feed
                const feedKey = response.data.key;
                app_1.adafruitService.subscribe(feedKey);
                console.log("Subscribed to new feed:", feedKey);
                return response.data;
            }
            catch (error) {
                console.error("Error creating feed:", error.message);
                if (error.response && error.response.data) {
                    console.error("Error creating feed:", error.response.data);
                    throw new errorRespone_1.BadRequestError(error.response.data.error);
                }
                throw error;
            }
        });
    }
    static getAllFeeds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds`, {
                headers: {
                    "X-AIO-Key": FeedService.aioKey
                }
            });
        });
    }
    static getFeed(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedId}`, {
                headers: {
                    "X-AIO-Key": FeedService.aioKey
                }
            });
        });
    }
    static getStatusFeed(feedKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedKey}/data/last`, {
                headers: {
                    "X-AIO-Key": FeedService.aioKey
                }
            });
            return res.data.value;
        });
    }
    static getAllStates(feedKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedKey}/data`, {
                headers: {
                    "X-AIO-Key": FeedService.aioKey
                }
            });
        });
    }
    static deleteFeedById(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting feed with ID:", feedId);
            return yield axios_1.default.delete(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedId}`, {
                headers: {
                    "X-AIO-Key": FeedService.aioKey
                }
            });
        });
    }
}
exports.FeedService = FeedService;
FeedService.username = process.env.ADAFRUIT_IO_USERNAME || "";
FeedService.aioKey = process.env.ADAFRUIT_IO_KEY || "";
exports.default = FeedService;
