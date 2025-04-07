import * as mqtt from "mqtt";
import dotenv from "dotenv";
import axios from "axios";
import { BadRequestError } from "../../helper/errorRespone";
import { Feed } from "../../model/device/device";
import DeviceService from "../device.service";
import { EventEmitter } from "events";

dotenv.config();

export class AdafruitService extends EventEmitter {
    public username: string;
    public aioKey: string;
    private baseUrl: string;
    private client: mqtt.MqttClient;
    private dashboardId: string;
    private messageHandlers: { [topic: string]: (topic: string, message: string) => void } = {};
    private static instance: AdafruitService | null = null;

    constructor() {
        super();
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.dashboardId = "dashboards";
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey
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
        const feeds = await this.getAllFeeds();
        if (!feeds.data) {
            console.log("No feeds found.");
            return;
        }
        for (const feed of feeds.data) {
            this.subscribe(feed.key, (topic, message) => {});
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
    public subscribe(feed: string, messageHandler: (topic: string, message: string) => void): void {
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

        // If there are no listeners for the "message" event, add one
        if (!this.client.listenerCount("message")) {
            this.client.on("message", (receivedTopic: string, message: Buffer) => {
                console.log(`Received message on topic ${receivedTopic}:`, message.toString());
                if (this.messageHandlers[receivedTopic]) {
                    this.messageHandlers[receivedTopic](receivedTopic, message.toString());
                    this.emit("newReading", message.toString());
                    // TODO: create proper message to send to the client
                }
            });
        }
        // Add the message handler for this topic
        this.messageHandlers[topic] = messageHandler;
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

    public async createFeed(feedData: Feed): Promise<any> {
        const feedEndpoint = `https://io.adafruit.com/api/v2/${this.username}/feeds`;

        try {
            const response = await axios.post(feedEndpoint, feedData, {
                headers: {
                    "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
                    "Content-Type": "application/json"
                }
            });
            console.log("Feed created successfully:", response.data);
            // automatically subscribe to the new feed
            const feedKey = response.data.key;
            this.subscribe(feedKey, (topic, message) => {});
            console.log("Subscribed to new feed:", feedKey);
            return response.data;
        } catch (error: any) {
            console.error("Error creating feed:", error.message);
            if (error.response && error.response.data) {
                console.error("Error creating feed:", error.response.data);
                throw new BadRequestError(error.response.data.error);
            }
            throw error;
        }
    }

    public async createBlock(blockData: any): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/${this.dashboardId}/welcome-dashboard/blocks`;

        return await axios
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
                throw new BadRequestError(error.response.data.error);
            });
    }

    public async getAllBlocks(): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/${this.dashboardId}/welcome-dashboard/blocks`;
        return await axios.get(blockEndpoint, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }

    public async getAllFeeds(): Promise<any> {
        return await axios.get(`https://io.adafruit.com/api/v2/${this.username}/feeds`, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }

    public async getFeed(feedId: string): Promise<any> {
        return await axios.get(`https://io.adafruit.com/api/v2/${this.username}/feeds/${feedId}`, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }

    public async deleteBlockByName(blockname: string): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/${this.dashboardId}/welcome-dashboard/blocks/${blockname}`;

        return await axios.delete(blockEndpoint, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }
    public async deleteBlockById(blockid: string): Promise<any> {
        console.log("Deleting block with ID:", blockid);
        const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/${this.dashboardId}/welcome-dashboard/blocks/${blockid}`;

        return await axios.delete(blockEndpoint, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }

    public async deleteFeedById(feedId: string): Promise<any> {
        console.log("Deleting feed with ID:", feedId);
        return await axios.delete(`https://io.adafruit.com/api/v2/${this.username}/feeds/${feedId}`, {
            headers: {
                "X-AIO-Key": this.aioKey
            }
        });
    }

    public async pullEnvLogData() {
        this.pollInterval = setInterval(async () => {
            try {
                // 1) Fetch all feeds
                const feedsRes = await this.getAllFeeds();
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
