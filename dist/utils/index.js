"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUUID = exports.asyncHandler = void 0;
exports.isValidTimestamp = isValidTimestamp;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const checkUUID = (uuid) => {
    const uuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$");
    return uuidRegex.test(uuid);
};
exports.checkUUID = checkUUID;
/**
 * Validates the format of a given ISO 8601 timestamp string.
 * @param time The timestamp string to validate.
 * @returns True if the timestamp matches the ISO 8601 format with timezone.
 */
function isValidTimestamp(time) {
    // Try to create a Date object from the time string
    const dateObj = new Date(time);
    // Check if the Date object is valid
    return !isNaN(dateObj.getTime());
}
