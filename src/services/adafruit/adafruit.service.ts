import * as mqtt from "mqtt";
import dotenv from "dotenv";
import axios from "axios";
import { BadRequestError } from "../../helper/errorRespone";
import { Feed } from "../../model/device/device";
import DeviceService from "../device.service";
import { EventEmitter } from "events";
import DeviceModel from "../../model/device/device.model";
import FeedService from "./feed.service";

dotenv.config();

export class AdafruitService extends EventEmitter {
    public username: string;
    public aioKey: string;
    private baseUrl: string;
    private client: mqtt.MqttClient;
    private static instance: AdafruitService | null = null;

    constructor() {
        super();
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey
        });
        this.client.on("message", async (receivedTopic: string, message: Buffer) => {
            const parsedMessage = message.toString();
            console.log(`Received message on topic ${receivedTopic}:`, parsedMessage);

            const device = await DeviceModel.getDeviceByFeedKey(receivedTopic.split("/")[2]);
            if (!device) {
                console.log("Device not found for topic:", receivedTopic);
                return;
            }
            const category = device.category;

            console.log("Device category:", category);
            this.emit(category, { room: device.room, deviceId: device.id, value: parsedMessage });
        });
    }

    public static getInstance() {
        if (!AdafruitService.instance) {
            AdafruitService.instance = new AdafruitService();
        }
        return AdafruitService.instance;
    }

    // Establishes connection with Adafruit IO using MQTT
    public async connect(): Promise<void> {
        this.client.on("connect", () => {
            console.log("Connected to Adafruit IO MQTT");
        });

        this.client.on("error", (error: Error) => {
            console.error("Connection error:", error);
            if (this.client) {
                this.client.end();
            }
        });

        this.client.on("close", () => {
            console.log("Disconnected from Adafruit IO MQTT");
        });

        // subcribe to all current feeds
        const feeds = await FeedService.getAllFeeds();
        if (!feeds.data) {
            console.log("No feeds found.");
            return;
        }
        for (const feed of feeds.data) {
            this.subscribe(feed.key);
        }
    }

    static async pullEnvLogData() {
        setInterval(async () => {
            // call the adafruit api to get the data
            // save the data to the database
            //this.createLog(data)
        }, 10000);
    }

    // Subscribe to a specific feed topic
    public subscribe(feed: string): void {
        if (!this.client) {
            console.error("Client is not connected. Call connect() first.");
            return;
        }
        const topic = `${this.username}/feeds/${feed}`;
        this.client.subscribe(topic, (err: any) => {
            if (err) {
                console.error(`Subscription error on topic ${topic}:`, err);
            } else {
                console.log(`Subscribed to ${topic}`);
            }
        });
    }

    // Publish a message to a specific feed topic
    public publish(feed: string, message: string): void {
        if (!this.client) {
            console.error("Client is not connected. Call connect() first.");
            return;
        }
        const topic = `${this.username}/feeds/${feed}`;
        try {
            this.client.publish(topic, message, (err?: any) => {
                if (err) {
                    console.error(`Publish error on topic ${topic}:`, err);
                    throw new BadRequestError(err.response.data);
                } else {
                    console.log(`Message "${message}" published to ${topic}`);
                }
            });
        } catch (error: any) {
            throw error;
        }
    }

    // Disconnect from the MQTT broker
    public disconnect(): void {
        if (this.client) {
            this.client.end();
            console.log("Client disconnected");
        }
    }

    public async pullEnvLogData() {
        this.pollInterval = setInterval(async () => {
            try {
                // 1) Fetch all feeds
                const feedsRes = await FeedService.getAllFeeds();
                // 2) For each feed, fetch the latest data
                for (const feed of feedsRes.data) {
                    const latest = feed.last_value;
                    // 3) Find the device ID for this feed
                    const deviceId = await DeviceService.getDeviceIdByFeed(feed.key);

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
            } catch (error: any) {
                console.error("Error pulling data:", error.message);
            }
        }, 10000);
    }

    private pollInterval: NodeJS.Timeout | null = null;
    public stopPullEnvLogData() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log("Stopped pulling environment data.");
        }
    }
}

export default AdafruitService;
