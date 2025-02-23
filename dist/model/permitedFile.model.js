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
class PermitedFileModel {
    static findAllPermitedFiles(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield initDatabase_1.default.query(`SELECT * 
      FROM permitedfile
      LIMIT $1 OFFSET $2;`, [limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`SELECT COUNT(*) AS total FROM permitedfile;`);
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
    static addPermitedFile(permitedFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (permitedFile.isenable) {
                result = yield initDatabase_1.default.query(`INSERT INTO permitedfile (type, isenable)
        VALUES ($1, $2)
        RETURNING *;`, [permitedFile.type, permitedFile.isenable]);
            }
            else {
                result = yield initDatabase_1.default.query(`INSERT INTO permitedfile (type)
        VALUES ($1)
        RETURNING *;`, [permitedFile.type]);
            }
            return result.rows[0] || null;
        });
    }
    static updatePermitedFile(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(data);
            const values = Object.values(data);
            // Return early if no fields to update
            if (fields.length === 0) {
                throw new Error("No fields provided to update");
            }
            const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
            const result = yield initDatabase_1.default.query(`
      UPDATE PERMITEDFILE
      SET ${setClauses}
      WHERE TYPE = $${fields.length + 1}
      RETURNING *`, [...values, type]);
            return result.rows[0] || null;
        });
    }
    static deletePermitedFile(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      DELETE FROM permitedfile
      WHERE TYPE = $1
      RETURNING *;`, [type]);
            return result.rows[0] || null;
        });
    }
}
exports.default = PermitedFileModel;
