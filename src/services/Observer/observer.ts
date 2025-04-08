import AutomationModel from "../../model/automation/automation.model";
import DeviceModel from "../../model/device/device.model";
import DeviceService from "../device.service";

type DataObserver = {
    room: string;
    device_id: string;
    action: string;
};

class DeviceObserver {
    static async update({ room, device_id, action }: DataObserver) {
        const device = await DeviceModel.getDeviceById(device_id);
        if (device && device.room === room) {
            console.log("Automation triggered on device:: ", device.name);
            DeviceService.updateDeviceStateById(device.id, action);
        }
    }
}

export default DeviceObserver;
export type { DataObserver };
