import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
class UserModel {
    static async findUserByEmail(email: string) {
        const user = await db.query("SELECT * FROM \"user\" WHERE email = $1", [email]);
        return user.rows[0] || null;
    }
    
    static async createUser({
        username,
        email,
        password,
        role,
        phoneNum,
        dob,
        avatarUrl
    }: {
        username: string;
        email: string;
        password: string;
        role: "student" | "teacher" | "admin";
        phoneNum?: string;
        dob?: string;
        avatarUrl?: string;
    }) {
   
        const result = await db.query(
            `INSERT INTO \"user\" (username, email, password, role, phoneNum, dob, avatarUrl, createdAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
            [username, email, password, role, phoneNum, dob, avatarUrl]
        );
        return result.rows[0];
    }
    static async findUserById(id: string) {
        const user = await db.query("SELECT * FROM \"user\" WHERE id = $1", [id]);
        return user.rows[0] || null;
    }

    static async getAllUsers({ page, limit }: { page: number; limit: number }) {
        const offset = (page - 1) * limit;
        const result = await db.query(
            `SELECT * FROM \"user\" ORDER BY createdAt DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async updateUser(id: string, updates: Partial<{ 
        username: string;
        email: string;
        password: string;
        role: "student" | "teacher" | "admin";
        phoneNum?: string;
        dob?: string;
        avatarUrl?: string;
    }>) {
        const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
        const values = Object.values(updates);

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // UPDATE "user"
        // SET 
        //     username = COALESCE($1, username),
        //     email = COALESCE($2, email),
        //     password = COALESCE($3, password),
        //     role = COALESCE($4, role),
        //     phoneNum = COALESCE($5, phoneNum),
        //     dob = COALESCE($6, dob),
        //     avatarUrl = COALESCE($7, avatarUrl),
        //     updatedAt = NOW()
        // WHERE id = $8
        // RETURNING *;
        values.push(id); // Push the user ID as the last parameter
        const sql = 'UPDATE \"user\" SET ' + fields.join(", ") + " WHERE id = $" +values.length   + " RETURNING *";
        console.log(sql);
        const result = await db.query(
            sql,
            values
        )

        return result.rows[0] || null;
    }

    static async deleteUser(id: string) {
        const result = await db.query("DELETE FROM \"user\" WHERE id = $1 RETURNING *", [id]);
        return result.rows[0] || null;
    }
}

export default UserModel;
