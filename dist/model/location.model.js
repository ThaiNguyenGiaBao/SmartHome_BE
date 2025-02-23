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
class LocationModel {
    static getAllLocation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT * 
      FROM LOCATION
      LIMIT $1 OFFSET $2;`, [limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`SELECT COUNT(*) AS total FROM location;`);
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
    static getLocation(data_1, _a) {
        return __awaiter(this, arguments, void 0, function* (data, { offset, limit }) {
            const fields = Object.keys(data);
            const values = Object.values(data);
            if (fields.length === 0) {
                throw new errorRespone_1.BadRequestError("No fields provided to find locations.");
            }
            const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = yield initDatabase_1.default.query(`
      SELECT *
      FROM LOCATION
      WHERE ${setClauses}
      LIMIT $${fields.length + 1} OFFSET $${fields.length + 2};
    `, [...values, limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`
      SELECT COUNT(*) as total
      FROM LOCATION
      WHERE ${setClauses};
    `, [...values]);
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
    static insertLocation(campusname, buildingname, roomnumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      INSERT INTO LOCATION(campusname, buildingname, roomnumber) 
      VALUES ($1, $2, $3)
      RETURNING *;`, [campusname, buildingname, roomnumber]);
            return result.rows[0] || null;
        });
    }
    static deleteLocation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      DELETE FROM LOCATION 
      WHERE id=$1
      RETURNING *;`, [id]);
            return result.rows[0] || null;
        });
    }
    static updateLocation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(data);
            const values = Object.values(data);
            // Return early if no fields to update
            if (fields.length === 0) {
                throw new errorRespone_1.BadRequestError("No fields provided to update");
            }
            const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = yield initDatabase_1.default.query(`
      UPDATE LOCATION
      SET ${setClauses}
      WHERE ID = $${fields.length + 1}
      RETURNING *`, [...values, id]);
            return result.rows[0] || null;
        });
    }
}
exports.default = LocationModel;
