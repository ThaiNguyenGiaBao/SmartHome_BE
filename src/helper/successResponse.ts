import { Response } from "express";

interface SuccessResponseOptions {
    message?: string;
    status?: number;
    reason?: string;
    data?: any;
}

class SuccessResponse {
    message: string;
    status: number;
    data: any;

    constructor({ message, status = 200, reason = "OK", data }: SuccessResponseOptions) {
        this.message = message || reason;
        this.status = status;
        this.data = data;
    }

    send(res: Response) {
        res.status(this.status).json({
            status: this.status,
            message: this.message,
            data: this.data
        });
    }
}

class OK extends SuccessResponse {
    constructor({ message, data }: { message?: string; data?: any }) {
        super({ message, status: 200, reason: "OK", data });
    }
}

class Created extends SuccessResponse {
    constructor({ message, data }: { message?: string; data?: any }) {
        super({ message, status: 201, reason: "Created", data });
    }
}

export { SuccessResponse, OK, Created };
