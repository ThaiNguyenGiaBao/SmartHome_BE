import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import { checkUUID } from "../utils";
import EnvLogModel from "../model/envLog/envLog.model";
import { EnvLogCreate, EnvLogUpdate } from "../model/envLog/envLog";

export default class EnvLogService {
    static async createLog(data: EnvLogCreate) {
      if (!data.deviceId || !checkUUID(data.deviceId)) {
        throw new BadRequestError("Invalid device ID.");
      }
      return EnvLogModel.createLog(data);
    }
  
    static async getLogById(id: string) {
      if (!checkUUID(id)) {
        throw new BadRequestError("Invalid Log ID.");
      }
      const log = await EnvLogModel.getLogById(id);
      if (!log) {
        throw new NotFoundError("EnvLog not found.");
      }
      return log;
    }
  
    static async updateLog(id: string, data: EnvLogUpdate) {
      if (!checkUUID(id)) {
        throw new BadRequestError("Invalid Log ID.");
      }
      if (data.deviceId && !checkUUID(data.deviceId)) {
        throw new BadRequestError("Invalid device ID.");
      }
      const updatedLog = await EnvLogModel.updateLog(id, data);
      if (!updatedLog) {
        throw new NotFoundError("EnvLog not found for update.");
      }
      return updatedLog;
    }
  
    static async deleteLog(id: string) {
      if (!checkUUID(id)) {
        throw new BadRequestError("Invalid Log ID.");
      }
      const deleted = await EnvLogModel.deleteLog(id);
      if (!deleted) {
        throw new NotFoundError("EnvLog not found to delete.");
      }
      return true;
    }
  
    static async getAllLogs() {
      return EnvLogModel.getAllLogs();
    }
  
    static async getLogsByDeviceId(deviceId: string) {
      if (!checkUUID(deviceId)) {
        throw new BadRequestError("Invalid device ID.");
      }
      return EnvLogModel.getLogsByDeviceId(deviceId);
    }

    
}