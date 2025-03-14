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
const axios_1 = __importDefault(require("axios"));
const errorRespone_1 = require("../helper/errorRespone");
dotenv_1.default.config();
class AdafruitService {
    constructor() {
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.client = null;
    }
    // Establishes connection with Adafruit IO using MQTT
    connect() {
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey
        });
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
    }
    // Subscribe to a specific feed topic
    subscribe(feed, messageHandler) {
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
        // Set up the message handler for this topic
        this.client.on("message", (receivedTopic, message) => {
            if (receivedTopic === topic) {
                messageHandler(receivedTopic, message.toString());
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
    createFeed(feedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedEndpoint = `https://io.adafruit.com/api/v2/${this.username}/feeds`;
            try {
                const response = yield axios_1.default.post(feedEndpoint, feedData, {
                    headers: {
                        "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
                        "Content-Type": "application/json"
                    }
                });
                console.log("Feed created successfully:", response.data);
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
    createBlock(blockData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/dashboards/welcome-dashboard/blocks`;
            return yield axios_1.default
                .post(blockEndpoint, blockData, {
                headers: {
                    "X-AIO-Key": this.aioKey,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                console.log("Block created successfully:", response.data);
                return response.data;
            })
                .catch((error) => {
                console.error("Error creating block:", error.response ? error.response.data : error.message);
                throw new errorRespone_1.BadRequestError(error.response.data.error);
            });
        });
    }
}
exports.AdafruitService = AdafruitService;
exports.default = AdafruitService;
