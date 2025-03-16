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
const initDatabase_1 = __importDefault(require("../../dbs/initDatabase"));
class EnvLogModel {
    static createLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = `
      INSERT INTO environmental_log (device_id, value)
      VALUES ($1, $2)
      RETURNING *;
    `;
            const values = [data.deviceId, data.value];
            const result = yield initDatabase_1.default.query(text, values);
            return {
                id: result.rows[0].id,
                deviceId: result.rows[0].device_id,
                value: result.rows[0].value,
                timestamp: result.rows[0].timestamp
            };
        });
    }
    static updateLog(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            const values = [];
            let index = 1;
            if (data.deviceId !== undefined) {
                updates.push(`device_id = $${index++}`);
                values.push(data.deviceId);
            }
            if (data.value !== undefined) {
                updates.push(`value = $${index++}`);
                values.push(data.value);
            }
            if (!updates.length)
                return null;
            const text = `
      UPDATE environmental_log
      SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;
            values.push(id);
            const result = yield initDatabase_1.default.query(text, values);
            if (result.rowCount === 0)
                return null;
            return {
                id: result.rows[0].id,
                deviceId: result.rows[0].device_id,
                value: result.rows[0].value,
                timestamp: result.rows[0].timestamp
            };
        });
    }
    static getLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log
      WHERE id = $1;
    `;
            const result = yield initDatabase_1.default.query(text, [id]);
            if (result.rowCount === 0)
                return null;
            return {
                id: result.rows[0].id,
                deviceId: result.rows[0].device_id,
                value: result.rows[0].value,
                timestamp: result.rows[0].timestap
            };
        });
    }
    static deleteLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = "DELETE FROM environmental_log WHERE id = $1;";
            const result = yield initDatabase_1.default.query(text, [id]);
            return result.rowCount > 0;
        });
    }
    static getAllLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log;
    `;
            const result = yield initDatabase_1.default.query(text);
            return result.rows.map((row) => ({
                id: row.id,
                deviceId: row.device_id,
                value: row.value,
                timestamp: row.timestamp
            }));
        });
    }
    static getLogsByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log
      WHERE device_id = $1;
    `;
            const result = yield initDatabase_1.default.query(text, [deviceId]);
            return result.rows.map((row) => ({
                id: row.id,
                deviceId: row.device_id,
                value: row.value,
                timestamp: row.timestamp
            }));
        });
    }
}
exports.default = EnvLogModel;
