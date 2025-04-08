import DeviceObserver from "./observer";
import AutomationModel from "../../model/automation/automation.model";
import AdafruitService from "../adafruit/adafruit.service";
import { DataObserver } from "./observer";

class Subject {
    private category: string;
    constructor(category: string) {
        this.category = category;
    }
    public listen() {
        const adafruitService = AdafruitService.getInstance();
        adafruitService.on(this.category, async (data: DataObserver) => {
            console.log("Data received in Subject:", this.category);
            await this.notify(data);
        });
    }

    async notify(data: any) {
        const { room, rawValue } = data;
        const value = rawValue === "ON" ? 1 : rawValue === "OFF" ? 0 : parseInt(rawValue);
        const automationList = await AutomationModel.getAutomationByCategory(this.category);
        for (const automation of automationList) {
            const { low, high, action } = automation;
            console.log(low, high, value);
            if (value < low || value > high) {
                continue;
            }

            DeviceObserver.update({ device_id: automation.device_id, room, action });
        }
    }
}

export default Subject;
