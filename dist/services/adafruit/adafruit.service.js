"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AdafruitService = void 0;
const mqtt = __importStar(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorRespone_1 = require("../../helper/errorRespone");
const device_service_1 = __importDefault(require("../device.service"));
const events_1 = require("events");
const device_model_1 = __importDefault(require("../../model/device/device.model"));
const feed_service_1 = __importDefault(require("./feed.service"));
dotenv_1.default.config();
class AdafruitService extends events_1.EventEmitter {
    constructor() {
        super();
        this.pollInterval = null;
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey
        });
        this.client.on("message", (receivedTopic, message) => __awaiter(this, void 0, void 0, function* () {
            const parsedMessage = message.toString();
            console.log(`Received message on topic ${receivedTopic}:`, parsedMessage);
            const device = yield device_model_1.default.getDeviceByFeedKey(receivedTopic.split("/")[2]);
            if (!device) {
                console.log("Device not found for topic:", receivedTopic);
                return;
            }
            const category = device.category;
            console.log("Device category:", category);
            this.emit(category, { room: device.room, deviceId: device.id, value: parsedMessage });
        }));
    }
    static getInstance() {
        if (!AdafruitService.instance) {
            AdafruitService.instance = new AdafruitService();
        }
        return AdafruitService.instance;
    }
    // Establishes connection with Adafruit IO using MQTT
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.on("connect", () => {
                console.log("Connected to Adafruit IO MQTT");
            });
            this.client.on("error", (error) => {
                console.error("Connection error:", error);
                if (this.client) {
                    this.client.end();
                }
            });
            this.client.on("close", () => {
                console.log("Disconnected from Adafruit IO MQTT");
            });
            // subcribe to all current feeds
            const feeds = yield feed_service_1.default.getAllFeeds();
            if (!feeds.data) {
                console.log("No feeds found.");
                return;
            }
            for (const feed of feeds.data) {
                this.subscribe(feed.key);
            }
        });
    }
    static pullEnvLogData() {
        return __awaiter(this, void 0, void 0, function* () {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                // call the adafruit api to get the data
                // save the data to the database
                //this.createLog(data)
            }), 10000);
        });
    }
    // Subscribe to a specific feed topic
    subscribe(feed) {
        if (!this.client) {
            console.error("Client is not connected. Call connect() first.");
            return;
        }
        const topic = `${this.username}/feeds/${feed}`;
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Subscription error on topic ${topic}:`, err);
            }
            else {
                console.log(`Subscribed to ${topic}`);
            }
        });
    }
    // Publish a message to a specific feed topic
    publish(feed, message) {
        if (!this.client) {
            console.error("Client is not connected. Call connect() first.");
            return;
        }
        const topic = `${this.username}/feeds/${feed}`;
        try {
            this.client.publish(topic, message, (err) => {
                if (err) {
                    console.error(`Publish error on topic ${topic}:`, err);
                    throw new errorRespone_1.BadRequestError(err.response.data);
                }
                else {
                    console.log(`Message "${message}" published to ${topic}`);
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    // Disconnect from the MQTT broker
    disconnect() {
        if (this.client) {
            this.client.end();
            console.log("Client disconnected");
        }
    }
    pullEnvLogData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pollInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // 1) Fetch all feeds
                    const feedsRes = yield feed_service_1.default.getAllFeeds();
                    // 2) For each feed, fetch the latest data
                    for (const feed of feedsRes.data) {
                        const latest = feed.last_value;
                        // 3) Find the device ID for this feed
                        const deviceId = yield device_service_1.default.getDeviceIdByFeed(feed.key);
                        // 4) Log to DB
                        // TODO: LOG ONLY IF THE DEVICE TYPE IS "gauge"
                        if (!isNaN(parseInt(latest, 10)) && !["0", "1"].includes(latest)) {
                            const EnvLogService = require("../services/envLog.service").default;
                            // await EnvLogService.createLog({
                            //     deviceId: deviceId.id,
                            //     value: parseInt(latest, 10)
                            // });
                        }
                    }
                    console.log("Data pulled successfully from all feeds.");
                }
                catch (error) {
                    console.error("Error pulling data:", error.message);
                }
            }), 10000);
        });
    }
    stopPullEnvLogData() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log("Stopped pulling environment data.");
        }
    }
}
exports.AdafruitService = AdafruitService;
AdafruitService.instance = null;
exports.default = AdafruitService;
