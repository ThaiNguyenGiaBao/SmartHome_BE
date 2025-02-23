"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRespone_1 = require("../helper/errorRespone");
const printer_model_1 = __importDefault(require("../model/printer.model"));
const utils_1 = require("../utils");
class PrinterService {
    static getAllPrinter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield printer_model_1.default.findAllPrinter({ offset, limit });
            return result;
        });
    }
    static getPrinterByID(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!printerID) {
                throw new errorRespone_1.BadRequestError("Printer ID is required.");
            }
            const result = yield printer_model_1.default.findPrinterByID(printerID);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot find the printer with ID " + printerID);
            return result;
        });
    }
    static addPrinter(printer) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for mandatory attribute
            if (!printer.brand)
                throw new errorRespone_1.BadRequestError("Printer Brand is required");
            if (!printer.model)
                throw new errorRespone_1.BadRequestError("Printer Model is required");
            if (!printer.status)
                throw new errorRespone_1.BadRequestError("Printer Status is required");
            // Check for invalid type
            if (printer.status !== "enabled" && printer.status !== "disabled")
                throw new errorRespone_1.BadRequestError("Printer status must be 'enabled' or 'disabled'");
            if (printer.locationId && (0, utils_1.checkUUID)(printer.locationId)) {
                throw new errorRespone_1.BadRequestError("Location ID must be type uuid.");
            }
            const result = yield printer_model_1.default.createPrinter(printer);
            if (result === null)
                throw new errorRespone_1.InternalServerError("Cannot create the printer");
            return result;
        });
    }
    static removePrinter(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!printerID)
                throw new errorRespone_1.BadRequestError("Printer ID is required.");
            const result = yield printer_model_1.default.deletePrinter(printerID);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot found the printer to delete");
            return result;
        });
    }
    static updatePrinter(printerID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!printerID)
                throw new errorRespone_1.BadRequestError("Printer ID is required.");
            const values = Object.values(data);
            values.forEach((value) => {
                if (!value)
                    throw new errorRespone_1.BadRequestError("Updated value cannot be null | undefined!");
            });
            if (data.status && data.status !== "enabled" && data.status != "disabled")
                throw new errorRespone_1.BadRequestError("Printer status must be 'enabled' or 'disabled'");
            const result = yield printer_model_1.default.updatePrinter(printerID, data);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Not found the printer with ID " + printerID);
            return result;
        });
    }
}
exports.default = PrinterService;
