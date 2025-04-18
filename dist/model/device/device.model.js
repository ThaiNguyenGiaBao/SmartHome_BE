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
class DeviceModel {
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static getDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT * FROM devices WHERE id = $1", [id]);
            return device.rows[0];
        });
    }
    static getDeviceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT * FROM devices WHERE name = $1", [name]);
            return device.rows[0];
        });
    }
    static getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield initDatabase_1.default.query("SELECT DISTINCT room FROM devices");
            return rooms.rows;
        });
    }
    static getDeviceByBlockId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT * FROM devices WHERE block_id = $1", [id]);
            return device.rows[0];
        });
    }
    static getDeviceByFeedKey(feed_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT * FROM devices WHERE feed_key = $1", [feed_key]);
            return device.rows[0];
        });
    }
    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static getDeviceByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT * FROM devices WHERE user_id = $1", [userId]);
            return device.rows;
        });
    }
    // router.post("/", asyncHandler(DeviceController.createDevice));
    static createDevice(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, name, type, room, feed_key, block_id, category }) {
            const result = yield initDatabase_1.default.query(`INSERT INTO devices (user_id, name, type, room, feed_key, block_id,category)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [user_id, name, type, room, feed_key, block_id, category]);
            return result.rows[0];
        });
    }
    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static updateDevice(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
            const values = Object.values(updates);
            const result = yield initDatabase_1.default.query(`UPDATE devices SET ${fields.join(",")} WHERE id = $${values.length + 1} RETURNING *`, [
                ...values,
                id
            ]);
            return result.rows[0];
        });
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static deleteDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query("DELETE FROM devices WHERE id = $1 RETURNING *", [id]);
            return result.rows[0];
        });
    }
    static getDeviceIdByFeed(feed_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield initDatabase_1.default.query("SELECT id FROM devices WHERE feed_key = $1", [feed_key]);
            return device.rows[0];
        });
    }
    static getAllUniqueRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query("SELECT DISTINCT room FROM devices");
            result.rows = result.rows.map((row) => {
                return row.room;
            });
            return result.rows;
        });
    }
}
exports.default = DeviceModel;
