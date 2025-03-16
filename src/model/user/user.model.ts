import db from "../../dbs/initDatabase";
import bcrypt from "bcrypt";
import { User } from "./user";
class UserModel {
    static async findUserByEmail(email: string) {
        const user = await db.query('SELECT * FROM "users" WHERE email = $1', [email]);
        return user.rows[0] || null;
    }

    static async findUserByEmailOrUsername(emailOrUsername: string) {
        const user = await db.query('SELECT * FROM "users" WHERE email = $1 OR username = $2', [emailOrUsername, emailOrUsername]);
        return user.rows[0] || null;
    }

    static async createUser({ username, email, password, avatarUrl }: User) {
        const result = await db.query(
            `INSERT INTO "users" (username, email, password, avatar_url,created_at)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [username, email, password, avatarUrl]
        );
        return result.rows[0];
    }
    static async findUserById(id: string) {
        const user = await db.query('SELECT * FROM "users" WHERE id = $1', [id]);
        return user.rows[0] || null;
    }

    static async getAllUsers({ page, limit }: { page: number; limit: number }) {
        const offset = (page - 1) * limit;
        const result = await db.query(`SELECT * FROM \"users\" ORDER BY createdAt DESC LIMIT $1 OFFSET $2`, [limit, offset]);
        return result.rows;
    }

    static async updateUser(
        id: string,
        updates: Partial<{
            username: string;
            email: string;
            password: string;
            role: "student" | "teacher" | "admin";
            phoneNum?: string;
            dob?: string;
            avatarUrl?: string;
        }>
    ) {
        const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
        const values = Object.values(updates);

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        values.push(id); // Push the user ID as the last parameter
        const sql = 'UPDATE "users" SET ' + fields.join(", ") + " WHERE id = $" + values.length + " RETURNING *";
        console.log(sql);
        const result = await db.query(sql, values);

        return result.rows[0] || null;
    }

    static async deleteUser(id: string) {
        const result = await db.query('DELETE FROM "users" WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
}

export default UserModel;