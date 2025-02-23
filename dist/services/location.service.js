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
const location_model_1 = __importDefault(require("../model/location.model"));
class LocationService {
    static getAllLocation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield location_model_1.default.getAllLocation({ offset, limit });
            return result;
        });
    }
    static getLocation(location_1, _a) {
        return __awaiter(this, arguments, void 0, function* (location, { offset, limit }) {
            if (!(location.buildingname || location.campusname || location.roomnumber || location.id))
                throw new errorRespone_1.BadRequestError("One of four attributes (buildingname, campusname, roomnumber, id) must be given.");
            const result = yield location_model_1.default.getLocation(location, { offset, limit });
            return result;
        });
    }
    static insertLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!location.campusname)
                throw new errorRespone_1.BadRequestError("campusname must be given.");
            if (!location.buildingname)
                throw new errorRespone_1.BadRequestError("buildingname must be given.");
            if (!location.roomnumber)
                throw new errorRespone_1.BadRequestError("roomnumber must be given.");
            if (location.campusname !== "LTK" && location.campusname !== "DA")
                throw new errorRespone_1.BadRequestError("campusname must be 'LTK' or 'DA'");
            const result = yield location_model_1.default.insertLocation(location.campusname, location.buildingname, location.roomnumber);
            if (result === null)
                throw new errorRespone_1.BadRequestError("Cannot insert the given location");
            return result;
        });
    }
    static deleteLocation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new errorRespone_1.BadRequestError("id must be given.");
            const result = yield location_model_1.default.deleteLocation(id);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot found the location to be deleted.");
            return result;
        });
    }
    static updateLocation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new errorRespone_1.BadRequestError("id must be given.");
            const location = Object.assign(Object.assign(Object.assign({}, (data.campusname && { campusname: data.campusname })), (data.buildingname && { buildingname: data.buildingname })), (data.roomnumber && { roomnumber: data.roomnumber }));
            if (location.campusname && location.campusname !== "LTK" && location.campusname !== "DA")
                throw new errorRespone_1.BadRequestError("campusname must be 'LTK' or 'DA'");
            const result = yield location_model_1.default.updateLocation(id, location);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Not found the location with ID " + id);
            return result;
        });
    }
}
exports.default = LocationService;
