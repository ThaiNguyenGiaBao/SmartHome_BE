import * as mqtt from "mqtt";
import dotenv from "dotenv";
import axios from "axios";
import { BadRequestError } from "../../helper/errorRespone";
import { Feed } from "../../model/device/device";
import { adafruitService } from "../../app";
dotenv.config();

export class FeedService {
    public static username: string = process.env.ADAFRUIT_IO_USERNAME || "";
    public static aioKey: string = process.env.ADAFRUIT_IO_KEY || "";

    static async createFeed(feedData: Feed): Promise<any> {
        const feedEndpoint = `https://io.adafruit.com/api/v2/${FeedService.username}/feeds`;

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

            adafruitService.subscribe(feedKey);
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

    static async getAllFeeds(): Promise<any> {
        return await axios.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds`, {
            headers: {
                "X-AIO-Key": FeedService.aioKey
            }
        });
    }

    static async getFeed(feedId: string): Promise<any> {
        return await axios.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedId}`, {
            headers: {
                "X-AIO-Key": FeedService.aioKey
            }
        });
    }

    static async getStatusFeed(feedKey: string): Promise<any> {
        const res = await axios.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedKey}/data/last`, {
            headers: {
                "X-AIO-Key": FeedService.aioKey
            }
        });
        return res.data.value;
    }

    static async getAllStates(feedKey: string): Promise<any> {
        return await axios.get(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedKey}/data`, {
            headers: {
                "X-AIO-Key": FeedService.aioKey
            }
        });
    }

    static async deleteFeedById(feedId: string): Promise<any> {
        console.log("Deleting feed with ID:", feedId);
        return await axios.delete(`https://io.adafruit.com/api/v2/${FeedService.username}/feeds/${feedId}`, {
            headers: {
                "X-AIO-Key": FeedService.aioKey
            }
        });
    }
}

export default FeedService;
