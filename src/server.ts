import app from "./app";
import { adafruitService } from "./app";
import { Server } from "socket.io";

import DeviceModel from "./model/device/device.model";
import AutomationModel from "./model/automation/automation.model";
import DeviceService from "./services/device.service";

import configEnv from "./configs/configEnv";
const port = configEnv.app.port;

const env = process.env.NODE_ENV || "dev";

const server = app.listen(port, () => {
    console.log(`Environment: ${env}\nServer is running on port ${port}`);
});

//adafruitService.pullEnvLogData();   // TEMPORARY TURNED OFF
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

adafruitService.on("smoke", async (data) => {
    console.log("Smoke detected:", data);
    const { room, value } = data;

    const automationList = await AutomationModel.getAutomationByCategory("smoke");
    for (const automation of automationList) {
        const { low, high, action } = automation;
        if (value < low || value > high) {
            continue;
        }
        const device = await DeviceModel.getDeviceById(automation.device_id);
        if (device && device.room === room) {
            console.log("Automation triggered on device:: ", device.name);
            DeviceService.updateDeviceStateById(device.id, action);
        }
    }

    //io.emit("newReading", data);
});

adafruitService.on("light", async (data) => {
    console.log("Light detected:", data);
    const { room, value } = data;

    const automationList = await AutomationModel.getAutomationByCategory("light");
    for (const automation of automationList) {
        console.log("automation", automation);
        const { low, high, action } = automation;
        if (value < low || value > high) {
            continue;
        }
        const device = await DeviceModel.getDeviceById(automation.device_id);
        if (device && device.room === room) {
            console.log("Automation triggered on device:: ", device.name);
            DeviceService.updateDeviceStateById(device.id, action);
        }
    }
});

adafruitService.on("fire", async (data) => {
    console.log("Fire detected:", data);
    var { room, value, device_id } = data;

    const automationList = await AutomationModel.getAutomationByCategory("fire");
    for (const automation of automationList) {
        console.log("automation", automation);
        const { low, high, action } = automation;
        value = value == "ON" ? 1 : 0;
        if (value < low || value > high) {
            continue;
        }
        const device = await DeviceModel.getDeviceById(automation.device_id);
        if (device && device.room === room) {
            console.log("Automation triggered on device:: ", device.name);
            DeviceService.updateDeviceStateById(device.id, action);
        }
    }
});

process.on("SIGINT", () => {
    adafruitService.stopPullEnvLogData();
    server.close(() => console.log("Server has been disconnected"));
});
