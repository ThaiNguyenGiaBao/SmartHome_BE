import express from "express";
import { asyncHandler } from "../../utils";
import DeviceController from "../../controllers/device.controller";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

router.post("/", asyncHandler(DeviceController.createDevice));
router.get("/async", asyncHandler(DeviceController.syncBlocksDatabaseAdafruitIo));

router.get("/user", asyncHandler(DeviceController.getDeviceByUserId));
router.get("/allrooms", asyncHandler(DeviceController.getAllUniqueRooms));

router.get("/room", asyncHandler(DeviceController.getAllRooms));

router.get("/:id", asyncHandler(DeviceController.getDeviceById));


router.patch("/:id", asyncHandler(DeviceController.updateDevice));
router.delete("/:id", asyncHandler(DeviceController.deleteDevice));

router.get("/state/:id", asyncHandler(DeviceController.getDeviceStateById));

router.post("/control/:id", asyncHandler(DeviceController.updateDeviceStateById));

export default router;
