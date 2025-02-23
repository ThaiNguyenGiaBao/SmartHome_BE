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
class PaymentModel {
    static getAllPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT * FROM PAYMENT
      LIMIT $1 OFFSET $2;`, [limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`SELECT COUNT(*) AS total FROM payment;`);
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
    static insertPayment(user_id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      INSERT INTO payment(user_id, amount)
      VALUES ($1, $2)
      RETURNING *;`, [user_id, amount]);
            return result.rows[0] || null;
        });
    }
    static getPaymentByTime(startTime_1, endTime_1, _a) {
        return __awaiter(this, arguments, void 0, function* (startTime, endTime, { offset, limit }) {
            if (!startTime && !endTime)
                return this.getAllPayment({ offset, limit });
            let result = null;
            let countQuery = null;
            if (!endTime) {
                result = yield initDatabase_1.default.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp >= $1 
        ORDER BY timestamp
        LIMIT $2 OFFSET $3;
      `, [startTime, limit, offset]);
                countQuery = yield initDatabase_1.default.query(`
        SELECT COUNT(*) as total
        FROM public.payment 
        WHERE timestamp >= $1
      `, [startTime]);
            }
            else if (!startTime) {
                result = yield initDatabase_1.default.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp <= $1 
        ORDER BY timestamp
        LIMIT $2 OFFSET $3;
      `, [endTime, limit, offset]);
                countQuery = yield initDatabase_1.default.query(`
        SELECT COUNT(*) as total
        FROM public.payment 
        WHERE timestamp <= $1 
      `, [endTime]);
            }
            else {
                result = yield initDatabase_1.default.query(`
        SELECT * 
        FROM payment 
        WHERE timestamp BETWEEN $1 AND $2 
        ORDER BY timestamp
        LIMIT $3 OFFSET $4;
      `, [startTime, endTime, limit, offset]);
                countQuery = yield initDatabase_1.default.query(`
        SELECT COUNT(*) as total
        FROM payment 
        WHERE timestamp BETWEEN $1 AND $2;
      `, [startTime, endTime]);
            }
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
    static getPaymentByUserID(user_id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (user_id, { offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT *
      FROM PAYMENT 
      WHERE user_id=$1
      LIMIT $2 OFFSET $3;`, [user_id, limit, offset]);
            const countQuery = yield initDatabase_1.default.query(`
        SELECT COUNT(*) AS total 
        FROM payment 
        WHERE user_id=$1;
      `, [user_id]);
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
}
exports.default = PaymentModel;
