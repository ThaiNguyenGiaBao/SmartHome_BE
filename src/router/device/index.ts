import express from "express";
import { asyncHandler } from "../../utils";
import DeviceController from "../../controllers/device.controller";

const router = express.Router();

router.get("/:id", asyncHandler(DeviceController.getDeviceById));

router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));

router.patch("/:id", asyncHandler(DeviceController.updateDevice));
router.delete("/:id", asyncHandler(DeviceController.deleteDevice));

router.post("/", asyncHandler(DeviceController.createDevice));

router.get("/state/:id", asyncHandler(DeviceController.getDeviceStateById));
router.get("/state/current/:id", asyncHandler(DeviceController.getCurrentDeviceStateById));

router.post("/control/:id", asyncHandler(DeviceController.updateDeviceStateById));

export default router;
