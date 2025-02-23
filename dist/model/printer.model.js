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
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const errorRespone_1 = require("../helper/errorRespone");
class PrinterModel {
    static findAllPrinter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT * FROM PRINTER
      LIMIT $1 OFFSET $2;`, [limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`SELECT COUNT(*) AS total FROM printer`);
            const totalItems = countQuery.rows[0].total;
            const totalPages = Math.ceil(totalItems / limit);
            return {
                data: result.rows,
                meta: {
                    totalPages,
                    totalItems,
                    currentPage: offset / limit + 1,
                    perPage: limit
                }
            };
        });
    }
    static findPrinterByID(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      SELECT * FROM PRINTER 
      WHERE ID=$1;`, [printerID]);
            return result.rows[0] || null;
        });
    }
    static createPrinter(printer) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      INSERT INTO PRINTER (brand, model, shortdescription, status, locationid)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`, [printer.brand, printer.model, printer.shortDescription || null, printer.status, printer.locationId || null]);
            return result.rows[0] || null;
        });
    }
    static updatePrinter(printerID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(data);
            const values = Object.values(data);
            // Return early if no fields to update
            if (fields.length === 0) {
                throw new errorRespone_1.BadRequestError("No fields provided to update");
            }
            const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
            const result = yield initDatabase_1.default.query(`
      UPDATE PRINTER
      SET ${setClauses}
      WHERE ID = $${fields.length + 1}
      RETURNING *`, [...values, printerID]);
            return result.rows[0] || null;
        });
    }
    static deletePrinter(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      DELETE FROM PRINTER
      WHERE ID = $1
      RETURNING *`, [printerID]);
            return result.rows[0] || null;
        });
    }
}
exports.default = PrinterModel;
