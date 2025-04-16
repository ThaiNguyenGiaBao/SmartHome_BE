import db from "../../dbs/initDatabase";

import { AutomationCreate, AutomationUpdate } from "./automation";

class AutomationModel {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static async getAutomationById(id: string) {
        const automation = await db.query(
            "SELECT a.* , d.name as device_name, d.type as device_type, d.room as device_room, d.image_url FROM automation_scenarios a join devices d on a.device_id = d.id WHERE a.id = $1",
            [id]
        );
        return automation.rows[0];
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static async getAutomationByUserId(userId: string) {
        const automation = await db.query(
            "select a.* , d.name as device_name, d.type as device_type, d.room as device_room, d.image_url from users u join devices d on u.id = d.user_id join automation_scenarios a on a.device_id = d.id where u.id = $1",
            [userId]
        );
        return automation.rows;
    }
    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static async getAutomationByDeviceId(deviceId: string) {
        const automation = await db.query(
            "SELECT a.* , d.name as device_name, d.type as device_type, d.room as device_room, d.image_url  FROM automation_scenarios a join devices d on a.device_id = d.id WHERE d.id = $1",
            [deviceId]
        );
        return automation.rows;
    }
    static async getAutomationByFeedKey(feed_key: string) {
        const automation = await db.query(
            "select a.* from devices d join automation_scenarios a on a.device_id = d.id  where d.feed_key = $1",
            [feed_key]
        );
        return automation.rows[0];
    }

    static async getAutomationByCategory(category: string) {
        const automation = await db.query(
            "SELECT a.* , d.name as device_name, d.type as device_type, d.room as device_room, d.image_url FROM automation_scenarios WHERE category = $1",
            [category]
        );
        return automation.rows;
    }

    // router.patch("/:id", asyncHandler(AutomationController.updateAutomation));
    static async updateAutomation(id: string, updates: AutomationUpdate) {
        const fields = Object.keys(updates).map((key, index) => `${key} = COALESCE($${index + 1},${key})`);
        const values = Object.values(updates);

        const result = await db.query(`UPDATE automation_scenarios SET ${fields.join(",")} WHERE id = $${values.length + 1} RETURNING *`, [
            ...values,
            id
        ]);
        return result.rows[0];
    }

    // router.delete("/:id", asyncHandler(AutomationController.deleteAutomation));
    static async deleteAutomation(id: string) {
        const result = await db.query("DELETE FROM automation_scenarios WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    }

    // router.post("/", asyncHandler(AutomationController.createAutomation));
    static async createAutomation({ deviceId, name, low, high, action, is_active, category }: AutomationCreate) {
        const result = await db.query(
            `INSERT INTO automation_scenarios (device_id, name, low, high, action, is_active,category)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [deviceId, name, low, high, action, is_active, category]
        );

        const response = await db.query(
            "SELECT a.* , d.name as device_name, d.type as device_type, d.room as device_room, d.image_url FROM automation_scenarios a join devices d on a.device_id = d.id WHERE a.id = $1",
            [result.rows[0].id]
        );

        return response.rows[0];
    }
}

export default AutomationModel;
