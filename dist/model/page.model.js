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
class ConfigModel {
    static getPageConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query("SELECT defaultnumpage, dategivenpage FROM configuration;");
            return result.rows[0] || null;
        });
    }
    static updatePageConfig(_a) {
        return __awaiter(this, arguments, void 0, function* ({ defaultnumpage, dategivenpage }) {
            // Initialize an array to store the SQL set clauses and the values
            const setClauses = [];
            const values = [];
            // Check each parameter, and if provided, add it to the set clauses and values array
            if (defaultnumpage !== undefined) {
                setClauses.push(`defaultnumpage = $${setClauses.length + 1}`);
                values.push(defaultnumpage);
            }
            if (dategivenpage !== undefined) {
                setClauses.push(`dategivenpage = $${setClauses.length + 1}`);
                values.push(dategivenpage);
            }
            // If no parameters are provided, return null or throw an error as there's nothing to update
            if (setClauses.length === 0) {
                throw new errorRespone_1.BadRequestError("No configuration arguments for updating");
            }
            const result = yield initDatabase_1.default.query(`
      UPDATE configuration
      SET ${setClauses}
      WHERE id = 1
      RETURNING *;`, [...values]);
            return result.rows[0] || null;
        });
    }
}
exports.default = ConfigModel;
