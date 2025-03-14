import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./router/index";

import cors from "cors";
import cookieParser from "cookie-parser";
import AdafruitService from "./services/adafruit.service";

export const adafruitService = new AdafruitService();
adafruitService.connect();

const app = express();


// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: true, // This is a security issue, allowing all origins
        credentials: true, // This allows cookies to be sent/received
        //methods: ["GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS"] // Allow OPTIONS for preflight
    })
);
app.use(cookieParser());

// init router
app.use("/api", router);



// handle errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not found") as Error & { status: number };
    error.status = 404;
    next(error);
});

app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    console.log("Error::", error.message);
    res.json({
        status: "error",
        message: error.message
    });
});

export default app;
