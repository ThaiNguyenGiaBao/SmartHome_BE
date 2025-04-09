import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import UserRouter from "./user";
import DeviceRouter from "./device";
import AutomationRouter from "./automation";
import envLogRouter from "./envLog";
import { asyncHandler } from "../utils";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World huidcsdcsdc" });
});
router.use("/auth", AccessRouter);

router.use(asyncHandler(authenticateToken));

router.use("/user", UserRouter);
router.use("/device", DeviceRouter);
router.use("/automation", AutomationRouter);
router.use("/envlog", envLogRouter);


export default router;
