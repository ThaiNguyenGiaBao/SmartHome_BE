import dotenv from "dotenv";
import axios from "axios";
import { BadRequestError } from "../../helper/errorRespone";

dotenv.config();

export class BlockService {
    public static username: string = process.env.ADAFRUIT_IO_USERNAME || "";
    public static aioKey: string = process.env.ADAFRUIT_IO_KEY || "";
    private static dashboardId: string = "dashboards";
    private static dashboard: string = "welcome-dashboard";

    static async createBlock(blockData: any): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks`;

        return await axios
            .post(blockEndpoint, blockData, {
                headers: {
                    "X-AIO-Key": BlockService.aioKey,
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

    static async getAllBlocks(): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks`;
        return await axios.get(blockEndpoint, {
            headers: {
                "X-AIO-Key": BlockService.aioKey
            }
        });
    }

    static async deleteBlockByName(blockname: string): Promise<any> {
        const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks/${blockname}`;

        return await axios.delete(blockEndpoint, {
            headers: {
                "X-AIO-Key": BlockService.aioKey
            }
        });
    }
    static async deleteBlockById(blockid: string): Promise<any> {
        console.log("Deleting block with ID:", blockid);
        const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks/${blockid}`;

        return await axios.delete(blockEndpoint, {
            headers: {
                "X-AIO-Key": BlockService.aioKey
            }
        });
    }
}
