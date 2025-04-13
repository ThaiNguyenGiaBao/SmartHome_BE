import express from "express";
import { asyncHandler } from "../../utils";
import EnvLogController from "../../controllers/envLog.controller";

const router = express.Router();

router.post("/", asyncHandler(EnvLogController.createLog));
router.get("/:id", asyncHandler(EnvLogController.getLogById));
router.get("/", asyncHandler(EnvLogController.getAllLogs));
router.patch("/update/:id", asyncHandler(EnvLogController.updateLog));
router.delete("/:id", asyncHandler(EnvLogController.deleteLog));
router.get("/device/:deviceId", asyncHandler(EnvLogController.getLogsByDeviceId));

export default router;
