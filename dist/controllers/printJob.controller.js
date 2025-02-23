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
const printJob_service_1 = __importDefault(require("../services/printJob.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const successResponse_1 = require("../helper/successResponse");
const errorRespone_1 = require("../helper/errorRespone");
const report_service_1 = __importDefault(require("../services/report.service"));
class PrintJobController {
    // Route /createPrintJob 
    static CreatePrintJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::CreatePrintJob", req.body);
            if (req.user.role == "admin")
                throw new errorRespone_1.ForbiddenError("Only accept user");
            let printJob = yield printJob_service_1.default.savePrintJob({
                printerid: req.body.printerid,
                userid: req.user.id,
                fileid: req.body.fileid,
                papersize: req.body.papersize,
                numpage: req.body.numpage,
                numside: req.body.numside,
                numcopy: req.body.numcopy,
                pagepersheet: req.body.pagepersheet,
                colortype: req.body.colortype,
                orientation: req.body.orientation,
                status: "created"
            });
            const price = yield printJob_service_1.default.CalculatePrice({
                papersize: req.body.papersize,
                colortype: req.body.colortype,
                numpage: req.body.numpage,
                numside: req.body.numside,
                pagepersheet: req.body.pagepersheet,
                numcopy: req.body.numcopy
            });
            return new successResponse_1.Created({
                message: "PrintJob created",
                data: {
                    printJob: printJob,
                    price: price
                }
            }).send(res);
        });
    }
    // Route /startPrintJob
    static StartPrintJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::StartPrintJob", req.body);
            if (req.user.role == "admin")
                throw new errorRespone_1.ForbiddenError("Only accept user");
            let printJob = yield printJob_service_1.default.getPrintJob(req.body.printJobId);
            // TO-DO: CHECK PERMITTED FILE HERE //
            let userBalance = yield user_service_1.default.getUserBalance(req.user.id);
            let price = yield printJob_service_1.default.CalculatePrice({
                papersize: printJob.papersize,
                colortype: printJob.colortype,
                numpage: printJob.numpage,
                numside: printJob.numside,
                pagepersheet: printJob.pagepersheet,
                numcopy: printJob.numcopy
            });
            if (price > userBalance) {
                yield printJob_service_1.default.updateStatus({
                    printJobId: req.body.printJobId,
                    newStatus: "unpaid"
                });
                throw new errorRespone_1.PaymentRequired("User does not have enough coin!");
            }
            yield user_service_1.default.updateUserBalance(req.user.id, userBalance - price);
            yield printJob_service_1.default.updateStatus({
                printJobId: req.body.printJobId,
                newStatus: "waiting"
            });
            // send printing request and done task
            // Printfile
            // Dont need await here, in reality, we just send printjob to printer and printer will update printJob status.
            // Our task in this controller is to send request, not to wait for it to be finished.
            report_service_1.default.createEvent({
                userId: req.user.id,
                type: "print document",
                description: req.body.printJobId
            });
            printJob_service_1.default.updateStatus({
                printJobId: req.body.printJobId,
                newStatus: "success"
            });
            return new successResponse_1.OK({
                message: "Accept printing request",
                data: printJob
            }).send(res);
        });
    }
    // Route /all : Get all history
    static getAllPrintingHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getAllPrintingHistory", req.query);
            if (req.user.role == "user")
                throw new errorRespone_1.ForbiddenError("Permission denied on getting history of other user");
            const page = req.query.displayPage ? parseInt(req.query.displayPage) : 1;
            const limit = req.query.itemPerPage ? parseInt(req.query.itemPerPage) : 10;
            return new successResponse_1.OK({
                message: "All history",
                data: yield printJob_service_1.default.getPrintingHistoryByUserAndPrinter({
                    userId: "none",
                    printerId: "none",
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    PageNum: page,
                    itemPerPage: limit
                })
            }).send(res);
        });
    }
    // Route /user/:userId : Get history of a user
    static getPrintingHistoryByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getPrintingHistoryByUser", req.params, req.query);
            if (req.user.role == "user" && req.params.userId != req.user.id) {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting history of other user");
            }
            const page = req.query.displayPage ? parseInt(req.query.displayPage) : 1;
            const limit = req.query.itemPerPage ? parseInt(req.query.itemPerPage) : 10;
            return new successResponse_1.OK({
                message: "All history printjob of user",
                data: yield printJob_service_1.default.getPrintingHistoryByUserAndPrinter({
                    userId: req.params.userId,
                    printerId: "none",
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    PageNum: page,
                    itemPerPage: limit
                })
            }).send(res);
        });
    }
    // Route /printer/:printerId : Get history of a printer
    // If user's role is admin, return all printJob of a printer
    // If user's role is user, return all printJob belong to that user of a printer
    static getPrintingHistoryByPrinter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getPrintingHistoryByPrinter", req.params, req.query);
            let userId = req.user.id;
            if (req.user.role == "admin")
                userId = "none";
            const page = req.query.displayPage ? parseInt(req.query.displayPage) : 1;
            const limit = req.query.itemPerPage ? parseInt(req.query.itemPerPage) : 10;
            let result = yield printJob_service_1.default.getPrintingHistoryByUserAndPrinter({
                userId: userId,
                printerId: req.params.printerId,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                PageNum: page,
                itemPerPage: limit
            });
            return new successResponse_1.OK({
                message: "All history printjob of printer",
                data: result
            }).send(res);
        });
    }
    static getPrintJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getPrintJob", req.params);
            let printJob = yield printJob_service_1.default.getPrintJob(req.params.printjobId);
            if (req.user.role == 'user' && req.user.id != printJob.userid) {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting other user's printJob");
            }
            return new successResponse_1.OK({
                message: "PrintJob",
                data: printJob
            }).send(res);
        });
    }
    // Route /totalPage/:userId : Get total page used by a user
    static getTotalPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getTotalPage", req.params, req.query);
            if (req.user.role == "user" && req.params.userId != req.user.id) {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting other user's total page");
            }
            return new successResponse_1.OK({
                message: "Total printed page of user",
                data: yield printJob_service_1.default.CalculateTotalPage({
                    userId: req.params.userId,
                    paperSize: req.query.paperSize,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    byMonth: (req.query.byMonth == 'true' ? true : false)
                })
            }).send(res);
        });
    }
    static getTotalPageOfAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getTotalPageOfAll", req.query);
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Permission denied on getting other user's total page");
            }
            return new successResponse_1.OK({
                message: "Total printed page of user",
                data: yield printJob_service_1.default.CalculateTotalPage({
                    userId: "none",
                    paperSize: req.query.paperSize,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    byMonth: (req.query.byMonth == 'true' ? true : false)
                })
            }).send(res);
        });
    }
    // Route /totalUser : Get total user active from startDate to endDate
    static getTotalUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getTotalUser", req.params, req.query);
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Only admin can get total number of user");
            }
            return new successResponse_1.OK({
                message: "Total user",
                data: yield printJob_service_1.default.CalculateTotalUser({
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    byMonth: (req.query.byMonth == 'true' ? true : false)
                })
            }).send(res);
        });
    }
    static getTotalFilebyType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::totalFilebyType", req.params, req.query);
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Only admin can get total file");
            }
            return new successResponse_1.OK({
                message: "Total File by Type",
                data: yield printJob_service_1.default.totalFilebyType({
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    types: req.query.types
                })
            }).send(res);
        });
    }
    static getPrinterUsageFrequency(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::printerUsageFrequency", req.params, req.query);
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Only admin can Printer usage frequency by day");
            }
            return new successResponse_1.OK({
                message: "Printer usage frequency by day",
                data: yield printJob_service_1.default.printerUsageFrequency({
                    printerId: req.params.printerId,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                })
            }).send(res);
        });
    }
    static getFilePrintRequestFrequency(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PrintJobController::getFilePrintRequestFrequency", req.params, req.query);
            if (req.user.role != "admin") {
                throw new errorRespone_1.ForbiddenError("Only admin can getFilePrintRequestFrequency");
            }
            return new successResponse_1.OK({
                message: "File print request frequency by day",
                data: yield printJob_service_1.default.getFilePrintRequestFrequency({
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                })
            }).send(res);
        });
    }
}
exports.default = PrintJobController;
