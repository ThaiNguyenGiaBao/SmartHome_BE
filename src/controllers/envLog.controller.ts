import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import EnvLogService from "../services/envLog.service";

export default class EnvLogController {  

    static async createLog(req: Request, res: Response) {
      console.log("EnvLogController::createLog::", req.body);
      const newLog = await EnvLogService.createLog(req.body);
      return new Created({
        message: "EnvLog created successfully",
        data: newLog
      }).send(res);
    }
  
    static async getLogById(req: Request, res: Response) {
      console.log("EnvLogController::getLogById::", req.params);
      const { id } = req.params;
      const log = await EnvLogService.getLogById(id);
      return new OK({
        message: "EnvLog retrieved successfully",
        data: log
      }).send(res);
    }
  
    static async updateLog(req: Request, res: Response) {
      console.log("EnvLogController::updateLog::", req.params, req.body);
      const { id } = req.params;
      const updatedLog = await EnvLogService.updateLog(id, req.body);
      return new OK({
        message: "EnvLog updated successfully",
        data: updatedLog
      }).send(res);
    }
  
    static async deleteLog(req: Request, res: Response) {
      const { id } = req.params;
      await EnvLogService.deleteLog(id);
      return new OK({
        message: "EnvLog deleted successfully"
      }).send(res);
    }
  
    static async getAllLogs(req: Request, res: Response) {
      console.log("EnvLogController::getAllLogs::");
      const logs = await EnvLogService.getAllLogs();
      return new OK({
        message: "All EnvLogs retrieved",
        data: logs
      }).send(res);
    }
  
    static async getLogsByDeviceId(req: Request, res: Response) {
      console.log("EnvLogController::getLogsByDeviceId::", req.params);
      const { deviceId } = req.params;
      const logs = await EnvLogService.getLogsByDeviceId(deviceId);
      return new OK({
        message: "EnvLogs by deviceId retrieved",
        data: logs
      }).send(res);
    }
  }