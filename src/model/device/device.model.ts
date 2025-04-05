import db from "../../dbs/initDatabase";
import { DeviceCreate, DeviceUpdate } from "./device";

class DeviceModel {
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static async getDeviceById(id: string) {
        const device = await db.query("SELECT * FROM devices WHERE id = $1", [id]);
        return device.rows[0];
    }
    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static async getDeviceByUserId(userId: string) {
        const device = await db.query("SELECT * FROM devices WHERE user_id = $1", [userId]);
        return device.rows;
    }

    // router.post("/", asyncHandler(DeviceController.createDevice));
    static async createDevice({ user_id, name, type, status, room, feet }: DeviceCreate) {
        const result = await db.query(
            `INSERT INTO devices (user_id, name, type, status, room, feet)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, name, type, status, room, feet]
        );
        return result.rows[0];
    }

    // router.patch("/update/:id", asyncHandler(DeviceController.updateDevice));
    static async updateDevice(id: string, updates: DeviceUpdate) {
        const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
        const values = Object.values(updates);

        const result = await db.query(`UPDATE devices SET ${fields.join(",")} WHERE id = $${values.length + 1} RETURNING *`, [
            ...values,
            id
        ]);
        return result.rows[0];
    }
    // router.delete("/:id", asyncHandler(DeviceController.deleteDevice));
    static async deleteDevice(id: string) {
        const result = await db.query("DELETE FROM devices WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    }

    static async getDeviceIdByFeed(feedId: string) {
        const device = await db.query("SELECT id FROM devices WHERE feet = $1", [feedId]);
        return device.rows[0];
    }

}

export default DeviceModel;
