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
const report_service_1 = __importDefault(require("../services/report.service"));
const successResponse_1 = require("../helper/successResponse");
const errorRespone_1 = require("../helper/errorRespone");
class ReportController {
    static generateMonthlyReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can generate Report");
            console.log("Report::generateMonthlyReport", req.body);
            return new successResponse_1.Created({
                message: "Report created",
                data: yield report_service_1.default.createReport({
                    name: req.body.name,
                    type: req.body.type,
                    description: req.body.description,
                    reportDate: req.body.reportDate
                })
            }).send(res);
        });
    }
    static generateYearlyReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can generate Report");
            console.log("Report::generateYearlyReport", req.body);
            return new successResponse_1.Created({
                message: "Report created",
                data: yield report_service_1.default.createReport({
                    name: req.body.name,
                    type: req.body.type,
                    description: req.body.description,
                    reportDate: req.body.reportDate
                })
            }).send(res);
        });
    }
    static addEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Report::addEvent ", req.body);
            return new successResponse_1.Created({
                message: "Event created",
                data: yield report_service_1.default.createEvent({
                    userId: req.user.id,
                    type: req.body.type,
                    description: req.body.description
                })
            }).send(res);
        });
    }
    static getAllReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can get report");
            console.log("Report::getAllReport ", req.query);
            return new successResponse_1.OK({
                message: "All report",
                data: yield report_service_1.default.getReportByTime({
                    startDate: req.query.startDate,
                    endDate: req.query.endDate
                })
            }).send(res);
        });
    }
    static getReportById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can get report");
            console.log("Report::getReportById ", req.params);
            return new successResponse_1.OK({
                message: "Report and all events of the report",
                data: yield report_service_1.default.getReportEventById({ reportId: req.params.reportId })
            }).send(res);
        });
    }
    static updateReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can update report");
            console.log("Report::updateReport ", req.params, req.body);
            return new successResponse_1.OK({
                message: "Update report successfully",
                data: yield report_service_1.default.updateReport({
                    reportId: req.params.reportId,
                    newName: req.body.name,
                    newDes: req.body.description
                })
            }).send(res);
        });
    }
    static deleteReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can delete report");
            console.log("Report::deleteReport ", req.params);
            return new successResponse_1.OK({
                message: "Delete report successfully",
                data: yield report_service_1.default.deleteReport(req.params.reportId)
            }).send(res);
        });
    }
    static deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = ReportController;
