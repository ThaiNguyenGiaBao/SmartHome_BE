import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import AutomationController from "../../controllers/automation.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));

router.get("/user", asyncHandler(AutomationController.getAutomationByUserId));
router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));

router.get("/:id", asyncHandler(AutomationController.getAutomationById));
router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));

router.post("/", asyncHandler(AutomationController.createAutomation));



export default router;