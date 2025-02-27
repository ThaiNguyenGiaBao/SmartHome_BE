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
const bcrypt_1 = __importDefault(require("bcrypt"));
class AccessModel {
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            return user.rows[0];
        });
    }

    static findUserByEmailOrUsername(emailOrUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query("SELECT * FROM users WHERE email = $1 OR name = $2", [emailOrUsername, emailOrUsername]);
            return user.rows[0];
        });
    }

    static createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, username, hashedPassword, avatarUrl }) {
            const newUserResult = yield initDatabase_1.default.query(`INSERT INTO users (email, name, password, avatarUrl) 
             VALUES ($1, $2, $3, $4) RETURNING *`, [email, username, hashedPassword, avatarUrl]);
            return newUserResult.rows[0];
        });
    }
    static findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query("SELECT * FROM users WHERE id = $1", [userId]);
            return user.rows[0];
        });
    }
    static getAllUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            const users = yield initDatabase_1.default.query("SELECT * FROM users LIMIT $1 OFFSET $2", [limit, (page - 1) * limit]);
            return users.rows;
        });
    }
    static updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            const values = [];
            const { email, username, password, avatarUrl, coinBalance } = data;
            if (email !== undefined) {
                updates.push(`email = $${updates.length + 1}`);
                values.push(email);
            }
            if (username !== undefined) {
                updates.push(`name = $${updates.length + 1}`);
                values.push(username);
            }
            if (password !== undefined) {
                updates.push(`password = $${updates.length + 1}`);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                values.push(hashedPassword);
            }
            if (avatarUrl !== undefined) {
                updates.push(`avatarUrl = $${updates.length + 1}`);
                values.push(avatarUrl);
            }
            if (coinBalance !== undefined) {
                updates.push(`coinBalance = $${updates.length + 1}`);
                values.push(coinBalance);
            }
            const updateQuery = `
            UPDATE users
            SET ${updates.join(", ")}
            WHERE id = $${updates.length + 1} RETURNING *
        `;
            values.push(userId);
            const updatedUserResult = yield initDatabase_1.default.query(updateQuery, values);
            const updatedUser = updatedUserResult.rows[0];
            // console.log("Updated user", updatedUser);
            return updatedUser;
        });
    }
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING *";
            const deletedUserResult = yield initDatabase_1.default.query(deleteQuery, [userId]);
            const deletedUser = deletedUserResult.rows[0];
            return deletedUser;
        });
    }
}
exports.default = AccessModel;
