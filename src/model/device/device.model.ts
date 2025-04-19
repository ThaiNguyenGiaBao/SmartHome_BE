import db from "../../dbs/initDatabase";
import { DeviceCreate, DeviceUpdate, Device } from "./device";

class DeviceModel {
    // router.get("/:id", asyncHandler(DeviceController.getDeviceById));
    static async getDeviceById(id: string) {
        const device = await db.query("SELECT * FROM devices WHERE id = $1", [id]);
        return device.rows[0];
    }

    static async getDeviceByName(name: string) {
        const device = await db.query("SELECT * FROM devices WHERE name = $1", [name]);
        return device.rows[0];
    }

    static async getAllRooms() {
        const rooms = await db.query("SELECT DISTINCT room FROM devices");
        return rooms.rows;
    }

    static async getDeviceByBlockId(id: string) {
        const device = await db.query("SELECT * FROM devices WHERE block_id = $1", [id]);
        return device.rows[0];
    }

    static async getDeviceByFeedKey(feed_key: string) {
        const device = await db.query("SELECT * FROM devices WHERE feed_key = $1", [feed_key]);
        return device.rows[0];
    }

    // router.get("/user/:userId", asyncHandler(DeviceController.getDeviceByUserId));
    static async getDeviceByUserId(userId: string) {
        const device = await db.query("SELECT * FROM devices WHERE user_id = $1", [userId]);
        return device.rows;
    }

    // router.post("/", asyncHandler(DeviceController.createDevice));
    static async createDevice({ user_id, name, type, room, feed_key, block_id, category }: DeviceCreate) {
        const result = await db.query(
            `INSERT INTO devices (user_id, name, type, room, feed_key, block_id,category)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, name, type, room, feed_key, block_id, category]
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

    static async getDeviceIdByFeed(feed_key: string) {
        const device = await db.query("SELECT id FROM devices WHERE feed_key = $1", [feed_key]);
        return device.rows[0];
    }

    static async getAllUniqueRooms() {
        const result = await db.query("SELECT DISTINCT room FROM devices");
        result.rows = result.rows.map((row: any) => {
            return row.room;
        });

        return result.rows;
    }
    static async getAllUniqueCategory() {
        const result = await db.query("SELECT DISTINCT category FROM devices where category  != '' ");
        result.rows = result.rows.map((row: any) => {
            return row.category;
        });

        return result.rows;
    }
}

export default DeviceModel;
