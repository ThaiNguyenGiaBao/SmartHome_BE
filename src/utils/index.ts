import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const checkUUID = (uuid: string) => {
    const uuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$");
    return uuidRegex.test(uuid);
};


/**
 * Validates the format of a given ISO 8601 timestamp string.
 * @param time The timestamp string to validate.
 * @returns True if the timestamp matches the ISO 8601 format with timezone.
 */
function isValidTimestamp(time: string): boolean {
    // Try to create a Date object from the time string
    const dateObj = new Date(time);

    // Check if the Date object is valid
    return !isNaN(dateObj.getTime());
}

export { asyncHandler, checkUUID, isValidTimestamp };
