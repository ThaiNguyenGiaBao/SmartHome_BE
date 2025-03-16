import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import UserRouter from "./user";
import DeviceRouter from "./device";
import AutomationRouter from "./automation";
import envLogRouter from "./envLog";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World huidcsdcsdc" });
});
router.use("/auth", AccessRouter);
router.use("/user", UserRouter);
router.use("/device", DeviceRouter);
router.use("/automation", AutomationRouter);
router.use("/envlog", envLogRouter);


export default router;
