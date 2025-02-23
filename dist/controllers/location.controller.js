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
const errorRespone_1 = require("../helper/errorRespone");
const successResponse_1 = require("../helper/successResponse");
const location_service_1 = __importDefault(require("../services/location.service"));
class LocationController {
    static getLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
            const offset = (page - 1) * limit;
            const location = Object.assign(Object.assign(Object.assign(Object.assign({}, (typeof req.query.campusname === 'string' && { campusname: req.query.campusname })), (typeof req.query.buildingname === 'string' && { buildingname: req.query.buildingname })), (typeof req.query.roomnumber === 'string' && { roomnumber: parseInt(req.query.roomnumber, 10) })), (typeof req.query.id === 'string' && { id: req.query.id }));
            let result = null;
            if (Object.values(location).every(value => !value))
                result = yield location_service_1.default.getAllLocation({ offset, limit });
            else
                result = yield location_service_1.default.getLocation(location, { offset, limit });
            return new successResponse_1.OK({
                data: result,
                message: "Get locations successfully"
            }).send(res);
        });
    }
    static insertLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can add a printer.");
            const location = {
                campusname: req.body.campusname,
                buildingname: req.body.buildingname,
                roomnumber: parseInt(req.body.roomnumber),
                id: "dummy"
            };
            const result = yield location_service_1.default.insertLocation(location);
            return new successResponse_1.Created({
                message: "Location added successfully",
                data: result,
            }).send(res);
        });
    }
    static deleteLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can add a printer.");
            const result = yield location_service_1.default.deleteLocation(req.params.id);
            return new successResponse_1.OK({
                message: "Delete Location successfully.",
                data: result
            }).send(res);
        });
    }
    static updateLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can add a printer.");
            const result = yield location_service_1.default.updateLocation(req.params.id, req.body);
            return new successResponse_1.OK({
                message: "Update location successfully",
                data: result
            }).send(res);
        });
    }
}
exports.default = LocationController;
