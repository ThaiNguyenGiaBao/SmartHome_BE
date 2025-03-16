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
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query('SELECT * FROM "users" WHERE email = $1', [email]);
            return user.rows[0] || null;
        });
    }
    static findUserByEmailOrUsername(emailOrUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query('SELECT * FROM "users" WHERE email = $1 OR username = $2', [emailOrUsername, emailOrUsername]);
            return user.rows[0] || null;
        });
    }
    static createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, avatarUrl }) {
            const result = yield initDatabase_1.default.query(`INSERT INTO "users" (username, email, password, avatar_url,created_at)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *`, [username, email, password, avatarUrl]);
            return result.rows[0];
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query('SELECT * FROM "users" WHERE id = $1', [id]);
            return user.rows[0] || null;
        });
    }
    static getAllUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            const offset = (page - 1) * limit;
            const result = yield initDatabase_1.default.query(`SELECT * FROM \"users\" ORDER BY createdAt DESC LIMIT $1 OFFSET $2`, [limit, offset]);
            return result.rows;
        });
    }
    static updateUser(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
            const values = Object.values(updates);
            if (updates.password) {
                updates.password = yield bcrypt_1.default.hash(updates.password, 10);
            }
            values.push(id); // Push the user ID as the last parameter
            const sql = 'UPDATE "users" SET ' + fields.join(", ") + " WHERE id = $" + values.length + " RETURNING *";
            console.log(sql);
            const result = yield initDatabase_1.default.query(sql, values);
            return result.rows[0] || null;
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query('DELETE FROM "users" WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] || null;
        });
    }
}
exports.default = UserModel;
