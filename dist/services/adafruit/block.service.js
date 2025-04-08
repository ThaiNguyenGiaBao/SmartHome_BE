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
exports.BlockService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const errorRespone_1 = require("../../helper/errorRespone");
dotenv_1.default.config();
class BlockService {
    static createBlock(blockData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks`;
            return yield axios_1.default
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
                throw new errorRespone_1.BadRequestError(error.response.data.error);
            });
        });
    }
    static getAllBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks`;
            return yield axios_1.default.get(blockEndpoint, {
                headers: {
                    "X-AIO-Key": BlockService.aioKey
                }
            });
        });
    }
    static deleteBlockByName(blockname) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks/${blockname}`;
            return yield axios_1.default.delete(blockEndpoint, {
                headers: {
                    "X-AIO-Key": BlockService.aioKey
                }
            });
        });
    }
    static deleteBlockById(blockid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting block with ID:", blockid);
            const blockEndpoint = `https://io.adafruit.com/api/v2/${BlockService.username}/${BlockService.dashboardId}/${BlockService.dashboard}/blocks/${blockid}`;
            return yield axios_1.default.delete(blockEndpoint, {
                headers: {
                    "X-AIO-Key": BlockService.aioKey
                }
            });
        });
    }
}
exports.BlockService = BlockService;
BlockService.username = process.env.ADAFRUIT_IO_USERNAME || "";
BlockService.aioKey = process.env.ADAFRUIT_IO_KEY || "";
BlockService.dashboardId = "dashboards";
BlockService.dashboard = "welcome-dashboard";
