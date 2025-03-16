import db from "../../dbs/initDatabase";
import EnvLog, { EnvLogCreate, EnvLogUpdate } from "./envLog";

export default class EnvLogModel {

  static async createLog(data: EnvLogCreate): Promise<EnvLog> {
    const text = `
      INSERT INTO environmental_log (device_id, value)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [data.deviceId, data.value];
    const result = await db.query(text, values);
    return {
      id: result.rows[0].id,
      deviceId: result.rows[0].device_id,
      value: result.rows[0].value,
      timestamp: result.rows[0].timestamp
    };
  }

  static async updateLog(id: string, data: EnvLogUpdate): Promise<EnvLog | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (data.deviceId !== undefined) {
      updates.push(`device_id = $${index++}`);
      values.push(data.deviceId);
    }
    if (data.value !== undefined) {
      updates.push(`value = $${index++}`);
      values.push(data.value);
    }

    if (!updates.length) return null;

    const text = `
      UPDATE environmental_log
      SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;
    values.push(id);

    const result = await db.query(text, values);
    if (result.rowCount === 0) return null;

    return {
      id: result.rows[0].id,
      deviceId: result.rows[0].device_id,
      value: result.rows[0].value,
      timestamp: result.rows[0].timestamp
    };
  }

  static async getLogById(id: string): Promise<EnvLog | null> {
    const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log
      WHERE id = $1;
    `;
    const result = await db.query(text, [id]);
    if (result.rowCount === 0) return null;
    return {
      id: result.rows[0].id,
      deviceId: result.rows[0].device_id,
      value: result.rows[0].value,
      timestamp: result.rows[0].timestap
    };
  }

  static async deleteLog(id: string): Promise<boolean> {
    const text = "DELETE FROM environmental_log WHERE id = $1;";
    const result = await db.query(text, [id]);
    return result.rowCount > 0;
  }

  static async getAllLogs(): Promise<EnvLog[]> {
    const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log;
    `;
    const result = await db.query(text);
    return result.rows.map((row: any) => ({
      id: row.id,
      deviceId: row.device_id,
      value: row.value,
      timestamp: row.timestamp
    }));
  }

  static async getLogsByDeviceId(deviceId: string): Promise<EnvLog[]> {
    const text = `
      SELECT id, device_id, value, timestamp
      FROM environmental_log
      WHERE device_id = $1;
    `;
    const result = await db.query(text, [deviceId]);
    return result.rows.map((row: any) => ({
      id: row.id,
      deviceId: row.device_id,
      value: row.value,
      timestamp: row.timestamp
    }));
  }
}
