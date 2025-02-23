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
class PrintingJobModel {
    static getPrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const printJob = yield initDatabase_1.default.query("SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.id::text = '" + printJobId + "'");
            if (printJob.rows.length == 0)
                throw new errorRespone_1.NotFoundError("Can not find this printjob!");
            return printJob.rows[0];
        });
    }
    static getPrintJobByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, startDate, endDate, PageNum, itemPerPage }) {
            let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.userid::text = '" + userId + "' ";
            if (startDate != null)
                query_string += " AND printingjob.starttime>='" + startDate + "' ";
            if (endDate != null)
                query_string += " AND printingjob.starttime<='" + endDate + "' ";
            query_string += "ORDER BY printingjob.starttime DESC ";
            // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
            const allPrintJob = yield initDatabase_1.default.query(query_string);
            return allPrintJob.rows;
        });
    }
    static getPrintJobByPrinter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ printerId, startDate, endDate, PageNum, itemPerPage }) {
            let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.printerid::text = '" + printerId + "' ";
            if (startDate != null)
                query_string += " AND starttime >= '" + startDate + "' ";
            if (endDate != null)
                query_string += " AND starttime <= '" + endDate + "' ";
            query_string += "ORDER BY starttime DESC ";
            // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0)
            //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
            const allPrintJob = yield initDatabase_1.default.query(query_string);
            return allPrintJob.rows;
        });
    }
    static getPrintJobByUserAndPrinter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, printerId, startDate, endDate, PageNum, itemPerPage }) {
            let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.userid::text = '" + userId + "' AND printerid::text = '" + printerId + "' ";
            if (startDate != null)
                query_string += " AND starttime >= '" + startDate + "' ";
            if (endDate != null)
                query_string += " AND starttime <= '" + endDate + "' ";
            query_string += "ORDER BY starttime DESC ";
            // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0)
            //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
            const allPrintJob = yield initDatabase_1.default.query(query_string);
            return allPrintJob.rows;
        });
    }
    static getPrintJobByDuration(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, PageNum, itemPerPage }) {
            let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id ";
            if (startDate != null) {
                query_string += " WHERE printingjob.starttime >= '" + startDate + "' ";
                if (endDate != null)
                    query_string += " AND printingjob.starttime <= '" + endDate + "' ";
            }
            else if (endDate != null)
                query_string += " WHERE printingjob.starttime <= '" + endDate + "' ";
            query_string += "ORDER BY printingjob.starttime DESC ";
            // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
            const allPrintJob = yield initDatabase_1.default.query(query_string);
            return allPrintJob.rows;
        });
    }
    static getPrintJobType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            let query_string = "SELECT DISTINCT file.id, type FROM file INNER JOIN printingjob ON file.id = printingjob.fileid ";
            if (startDate != null) {
                query_string += " WHERE starttime >= '" + startDate + "' ";
                if (endDate != null)
                    query_string += " AND starttime <= '" + endDate + "' ";
            }
            else if (endDate != null)
                query_string += " WHERE starttime <= '" + endDate + "' ";
            // query_string += "ORDER BY starttime DESC ";
            // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0)
            //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
            const allPrintJob = yield initDatabase_1.default.query(query_string);
            return allPrintJob.rows;
        });
    }
    static deletePrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const DeleteExistPrintJob = yield initDatabase_1.default.query("DELETE FROM printingjob WHERE id::text = $1", [printJobId]);
        });
    }
    static updateStatus(printJobId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const upadte = yield initDatabase_1.default.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId]);
        });
    }
}
exports.default = PrintingJobModel;
