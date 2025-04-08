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
class AutomationModel {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static getAutomationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const automation = yield initDatabase_1.default.query("SELECT * FROM automation_scenarios WHERE id = $1", [id]);
            return automation.rows[0];
        });
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static getAutomationByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const automation = yield initDatabase_1.default.query("select a.* from users u join devices d on u.id = d.user_id join automation_scenarios a on a.device_id = d.id where u.id = $1", [userId]);
            return automation.rows;
        });
    }
    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static getAutomationByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const automation = yield initDatabase_1.default.query("SELECT * FROM automation_scenarios a  WHERE device_id = $1", [deviceId]);
            return automation.rows;
        });
    }
    static getAutomationByFeedKey(feed_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const automation = yield initDatabase_1.default.query("select a.* from devices d join automation_scenarios a on a.device_id = d.id  where d.feed_key = $1", [feed_key]);
            return automation.rows[0];
        });
    }
    static getAutomationByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const automation = yield initDatabase_1.default.query("SELECT * FROM automation_scenarios WHERE category = $1", [category]);
            return automation.rows;
        });
    }
    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static updateAutomation(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
            const values = Object.values(updates);
            const result = yield initDatabase_1.default.query(`UPDATE automation_scenarios SET ${fields.join(",")} WHERE id = $${values.length + 1} RETURNING *`, [
                ...values,
                id
            ]);
            return result.rows[0];
        });
    }
    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static deleteAutomation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query("DELETE FROM automation_scenarios WHERE id = $1 RETURNING *", [id]);
            return result.rows[0];
        });
    }
    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static createAutomation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ deviceId, name, low, high, action, isActive, category }) {
            const result = yield initDatabase_1.default.query(`INSERT INTO automation_scenarios (device_id, name, low, high, action, is_active,category)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [deviceId, name, low, high, action, isActive, category]);
            return result.rows[0];
        });
    }
}
exports.default = AutomationModel;
