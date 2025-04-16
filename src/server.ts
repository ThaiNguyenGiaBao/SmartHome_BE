import app from "./app";
import { adafruitService } from "./app";
import { Server } from "socket.io";


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

    adafruitService.on("newReading", (category, data) => {
        socket.emit("newReading", category, data);
    }
    );

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});


process.on("SIGINT", () => {
    adafruitService.stopPullEnvLogData();
    adafruitService.disconnect();
    server.close(() => console.log("Server has been disconnected"));
});
