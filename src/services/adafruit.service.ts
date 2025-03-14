import * as mqtt from "mqtt";
import dotenv from "dotenv";
import axios from "axios";
import { BadRequestError } from "../helper/errorRespone";
import { BlockFeed, Block, Feed } from "../model/device/device";

dotenv.config();

export class AdafruitService {
    public username: string;
    public aioKey: string;
    private baseUrl: string;
    private client: mqtt.MqttClient | null;

    constructor() {
        this.username = process.env.ADAFRUIT_IO_USERNAME || "";
        this.aioKey = process.env.ADAFRUIT_IO_KEY || "";
        this.baseUrl = "mqtts://io.adafruit.com";
        this.client = null;
    }

    // Establishes connection with Adafruit IO using MQTT
    public connect(): void {
        this.client = mqtt.connect(this.baseUrl, {
            username: this.username,
            password: this.aioKey
        });

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

        // Set up the message handler for this topic
        this.client.on("message", (receivedTopic: string, message: Buffer) => {
            if (receivedTopic === topic) {
                messageHandler(receivedTopic, message.toString());
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
        this.client.publish(topic, message, (err?: Error) => {
            if (err) {
                console.error(`Publish error on topic ${topic}:`, err);
            } else {
                console.log(`Message "${message}" published to ${topic}`);
            }
        });
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
        const blockEndpoint = `https://io.adafruit.com/api/v2/${this.username}/dashboards/welcome-dashboard/blocks`;

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
}

export default AdafruitService;
