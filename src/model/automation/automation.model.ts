import db from "../../dbs/initDatabase";

import { AutomationCreate, AutomationUpdate } from "./automation";

class AutomationModel {
    // router.get("/:id", asyncHandler(AutomationController.getAutomationById));
    static async getAutomationById(id: string) {
        const automation = await db.query("SELECT * FROM automation_scenarios WHERE id = $1", [id]);
        return automation.rows[0];
    }
    // router.get("/user/:userId", asyncHandler(AutomationController.getAutomationByUserId));
    static async getAutomationByUserId(userId: string) {
        const automation = await db.query("select a.* from users u join devices d on u.id = d.user_id join automation_scenarios a on a.device_id = d.id where u.id = $1", [userId]);
        return automation.rows;
    }
    // router.get("/device/:deviceId", asyncHandler(AutomationController.getAutomationByDeviceId));
    static async getAutomationByDeviceId(deviceId: string) {
        const automation = await db.query("SELECT * FROM automation_scenarios WHERE device_id = $1", [deviceId]);
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
    static async createAutomation({ deviceId, name, low, high, action, isActive }: AutomationCreate) {
        const result = await db.query(
            `INSERT INTO automation_scenarios (device_id, name, low, high, action, is_active)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [deviceId, name, low, high, action, isActive]
        );
        return result.rows[0];
    }
}

export default AutomationModel;