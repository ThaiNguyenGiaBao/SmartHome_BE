import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import UserRouter from "./user";
import DeviceRouter from "./device";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
router.use("/auth", AccessRouter);
router.use("/user", UserRouter);
router.use("/device", DeviceRouter);


export default router;
