"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Created = exports.OK = exports.SuccessResponse = void 0;
class SuccessResponse {
    constructor({ message, status = 200, reason = "OK", data }) {
        this.message = message || reason;
        this.status = status;
        this.data = data;
    }
    send(res) {
        res.status(this.status).json({
            status: this.status,
            message: this.message,
            data: this.data
        });
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, status: 200, reason: "OK", data });
    }
}
exports.OK = OK;
class Created extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, status: 201, reason: "Created", data });
    }
}
exports.Created = Created;
