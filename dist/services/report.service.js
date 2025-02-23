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
const report_model_1 = __importDefault(require("../model/report.model"));
const user_service_1 = __importDefault(require("./user.service"));
const errorRespone_1 = require("../helper/errorRespone");
class ReportService {
    static createReport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, type, description, reportDate }) {
            if (name == null)
                throw new errorRespone_1.BadRequestError("Name is null (generating report)");
            if (type == null)
                throw new errorRespone_1.BadRequestError("Type is null (generating report)");
            let checkDate = isNaN(Date.parse(reportDate));
            if (checkDate)
                throw new errorRespone_1.BadRequestError("Date format is wrong (generating report)");
            const newReport = yield report_model_1.default.saveReport({
                name: name,
                type: type,
                description: description
            });
            const newReportId = newReport.id;
            const date = new Date(reportDate);
            let startDate = reportDate;
            let endDate = reportDate;
            if (type == "monthly") {
                startDate = (new Date(date.getFullYear(), date.getMonth(), 1, 0 + 7)).toISOString();
                endDate = (new Date(date.getFullYear(), date.getMonth() + 1, 0, 24 + 7)).toISOString();
            }
            else if (type == "yearly") {
                startDate = (new Date(date.getFullYear(), 0, 1, 0 + 7)).toISOString();
                endDate = (new Date(date.getFullYear(), 12, 0, 24 + 7)).toISOString();
            }
            else
                throw new errorRespone_1.BadRequestError("Invalid type (generating report)");
            const allEvent = yield report_model_1.default.getEventByTime({
                startDate: startDate,
                endDate: endDate
            });
            for (let i in allEvent) {
                const newReportEvent = yield report_model_1.default.saveReportEventR({ reportId: newReportId, eventId: allEvent[i].id });
            }
            return { newReport: newReport, allEvent: allEvent };
        });
    }
    static createEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, type, description }) {
            if (userId == null)
                throw new errorRespone_1.BadRequestError("userId is null (creating report)");
            if (type == null)
                throw new errorRespone_1.BadRequestError("Type is null (creating report)");
            let user = yield user_service_1.default.getUser(userId);
            let newEvent = yield report_model_1.default.saveEvent({
                userId: userId,
                type: type,
                description: description
            });
            return newEvent;
        });
    }
    static getReportByTime(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            if (startDate != null && endDate != null) {
                let checkStartDate = isNaN(Date.parse(startDate));
                let checkEndDate = isNaN(Date.parse(endDate));
                if (checkStartDate || checkEndDate)
                    throw new errorRespone_1.BadRequestError("Date format is wrong");
            }
            return yield report_model_1.default.getReportByTime({
                startDate: startDate,
                endDate: endDate
            });
        });
    }
    static getReportEventById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reportId }) {
            if (reportId == null)
                throw new errorRespone_1.BadRequestError("ReportId is null");
            return {
                report: yield report_model_1.default.getReportById(reportId),
                event: yield report_model_1.default.getEventByReportId(reportId)
            };
        });
    }
    static updateReport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reportId, newName, newDes }) {
            if (reportId == null)
                throw new errorRespone_1.BadRequestError("ReportId is null");
            if (newName != null)
                yield report_model_1.default.updateReportName(reportId, newName);
            if (newDes != null)
                yield report_model_1.default.updateReportDescription(reportId, newDes);
            return yield report_model_1.default.getReportById(reportId);
        });
    }
    static deleteReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reportId == null)
                throw new errorRespone_1.BadRequestError("ReportId is null");
            let deletedEvent = yield report_model_1.default.deleteReportEventById(reportId);
            let deletedReport = yield report_model_1.default.deleteReportById(reportId);
            return { deletedReport: deletedReport, deletedEvents: deletedEvent };
        });
    }
}
exports.default = ReportService;
