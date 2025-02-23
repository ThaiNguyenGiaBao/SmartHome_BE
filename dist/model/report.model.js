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
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const errorRespone_1 = require("../helper/errorRespone");
class ReportModel {
    static saveReport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, type, description }) {
            const newReport = yield initDatabase_1.default.query("INSERT INTO report (name, type, description) VALUES ($1, $2, $3) RETURNING *", [
                name,
                type,
                description
            ]);
            return newReport.rows[0];
        });
    }
    static saveReportEventR(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reportId, eventId }) {
            const newReportEvent = yield initDatabase_1.default.query("INSERT INTO reporteventr (reportid, eventid) VALUES ($1, $2) RETURNING *", [
                reportId,
                eventId
            ]);
            return newReportEvent.rows[0];
        });
    }
    static saveEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, type, description }) {
            const newEvent = yield initDatabase_1.default.query("INSERT INTO event (userid, type, description) VALUES ($1, $2, $3) RETURNING *", [
                userId,
                type,
                description
            ]);
            return newEvent.rows[0];
        });
    }
    static getEventByTime(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            const allEvent = yield initDatabase_1.default.query("SELECT * FROM event WHERE createtime >= '" + startDate + "'" + " AND createtime <= '" + endDate + "'");
            return allEvent.rows;
        });
    }
    static getReportByTime(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            let query_string = "SELECT * FROM report";
            if (startDate != null) {
                query_string += " WHERE createtime >= '" + startDate + "' ";
                if (endDate != null)
                    query_string += " AND createtime <= '" + endDate + "' ";
            }
            else if (endDate != null)
                query_string += " WHERE createtime <= '" + endDate + "' ";
            const allReport = yield initDatabase_1.default.query(query_string);
            return allReport.rows;
        });
    }
    static getReportById(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            let report = yield initDatabase_1.default.query("SELECT * FROM report WHERE id::text = $1", [reportId]);
            if (report.rows.length == 0)
                throw new errorRespone_1.NotFoundError("Report not found");
            return report.rows[0];
        });
    }
    static getEventByReportId(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = yield initDatabase_1.default.query("SELECT eventid, userid, createtime, type, description FROM reporteventr JOIN event ON reporteventr.eventid = event.id WHERE reportid = $1", [reportId]);
            return events.rows;
        });
    }
    static updateReportName(reportId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield initDatabase_1.default.query("UPDATE report SET name = $1 WHERE id = $2", [newName, reportId]);
            return res;
        });
    }
    static updateReportDescription(reportId, newDes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield initDatabase_1.default.query("UPDATE report SET description = $1 WHERE id = $2", [newDes, reportId]);
        });
    }
    static deleteReportEventById(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield initDatabase_1.default.query("DELETE FROM reporteventr WHERE reportid = $1 RETURNING *", [reportId]);
            return result.rows;
        });
    }
    static deleteReportById(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield initDatabase_1.default.query("DELETE FROM report WHERE id = $1 RETURNING *", [reportId]);
            return result.rows;
        });
    }
}
exports.default = ReportModel;
