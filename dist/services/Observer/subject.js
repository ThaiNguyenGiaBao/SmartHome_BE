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
const observer_1 = __importDefault(require("./observer"));
const automation_model_1 = __importDefault(require("../../model/automation/automation.model"));
const adafruit_service_1 = __importDefault(require("../adafruit/adafruit.service"));
class Subject {
    constructor(category) {
        this.category = category;
    }
    listen() {
        const adafruitService = adafruit_service_1.default.getInstance();
        adafruitService.on(this.category, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("Data received in Subject:", this.category);
            yield this.notify(data);
        }));
    }
    notify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room, rawValue } = data;
            const value = rawValue === "ON" ? 1 : rawValue === "OFF" ? 0 : parseInt(rawValue);
            const automationList = yield automation_model_1.default.getAutomationByCategory(this.category);
            for (const automation of automationList) {
                const { low, high, action } = automation;
                console.log(low, high, value);
                if (value < low || value > high) {
                    continue;
                }
                observer_1.default.update({ device_id: automation.device_id, room, action });
            }
        });
    }
}
exports.default = Subject;
