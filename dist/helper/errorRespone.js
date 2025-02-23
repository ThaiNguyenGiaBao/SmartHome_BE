"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequired = exports.InternalServerError = exports.ForbiddenError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}
exports.ErrorResponse = ErrorResponse;
class BadRequestError extends ErrorResponse {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ErrorResponse {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class PaymentRequired extends ErrorResponse {
    constructor(message) {
        super(message, 402);
    }
}
exports.PaymentRequired = PaymentRequired;
class NotFoundError extends ErrorResponse {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ErrorResponse {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends ErrorResponse {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
