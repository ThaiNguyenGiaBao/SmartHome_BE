import * as mqtt from "mqtt";
import dotenv from "dotenv";
import { BadRequestError } from "../../helper/errorRespone";
import DeviceService from "../device.service";
import { EventEmitter } from "events";
import DeviceModel from "../../model/device/device.model";
import FeedService from "./feed.service";
import DataObserver from "../Observer/observer";
dotenv.config();

export class AdafruitService extends EventEmitter {
    public username: string;
    public aioKey: string;
    private baseUrl: string;
    private client: mqtt.MqttClient;
    private static instance: AdafruitService | null = null;
    private subscribedTopics: Set<string> = new Set();
    private isConnected: boolean = false;

    constructor() {
        super();
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey,
            clientId: `smarthome_${Date.now()}_${Math.random().toString(16).substring(2, 8)}`,
            clean: true,
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
        if (!this.isConnected) {
            this.client.on("connect", () => {
                console.log("Connected to Adafruit IO MQTT");
                this.isConnected = true;
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

            this.client.on("message", async (receivedTopic: string, message: Buffer) => {
                const parsedMessage = message.toString();
                console.log(`Received message on topic ${receivedTopic}:`, parsedMessage);

                const device = await DeviceModel.getDeviceByFeedKey(receivedTopic.split("/")[2]);
                if (!device) {
                    console.log("Device not found for topic:", receivedTopic);
                    return;
                }

                const category = device.category;
                const data: DataObserver = { room: device.room, rawValue: parsedMessage };
                this.emit("newReading", category, data);

                // const getRandomValue = (min: number, max: number): number => {
                //     return Math.round((Math.random() * (max - min) + min) * 10) / 10; // Làm tròn đến 1 chữ số thập phân
                // };
                // // Test data set
                // const testData = [
                //     { category: "temperature", data: { room: "Living Room", rawValue: getRandomValue(1,200) } },
                //     { category: "humidity", data: { room: "Living Room", rawValue: getRandomValue(1,200) } },
                //     { category: "light", data: { room: "Living Room", rawValue: getRandomValue(1,200) } },
                //     { category: "temperature", data: { room: "Bedroom", rawValue: getRandomValue(1,200) } },
                //     { category: "humidity", data: { room: "Bedroom", rawValue: getRandomValue(1,200) } },
                //     { category: "temperature", data: { room: "Kitchen", rawValue: getRandomValue(1,200) } },
                //     { category: "co2", data: { room: "Living Room", rawValue: getRandomValue(1,200) } }
                // ];
                
                // testData.forEach(item => {
                //     console.log(`Emitting new reading for ${item.category}:`, item.data);
                //     var hasEmited = this.emit("newReading", item.category, item.data);
                //     if (!hasEmited) {
                //         console.log("No listeners for newReading event.");
                //     }
                // });
            });
        }

        // Wait for connection to be established
        if (!this.client.connected) {
            await new Promise<void>((resolve) => {
                const connectHandler = () => {
                    this.client.removeListener('connect', connectHandler);
                    resolve();
                };
                this.client.on('connect', connectHandler);
                
                // Add timeout to prevent hanging if connection fails
                setTimeout(() => {
                    this.client.removeListener('connect', connectHandler);
                    resolve(); // Resolve anyway after timeout
                }, 5000);
            });
        }

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

        if (this.subscribedTopics.has(topic)) {
            console.log(`Already subscribed to ${topic}, skipping`);
            return;
        }

        this.client.subscribe(topic, (err: any) => {
            if (err) {
                console.error(`Subscription error on topic ${topic}:`, err);
            } else {
                console.log(`Subscribed to ${topic}`);
            }
        });

        this.subscribedTopics.add(topic);

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
            this.client.removeAllListeners(); 
            this.client.end(true); 
            this.isConnected = false;
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
                        
                    await EnvLogService.createLog({
                        deviceId: deviceId.id,
                        value: parseInt(latest, 10)
                    });
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
