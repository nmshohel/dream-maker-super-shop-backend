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
exports.ZonalController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const zonal_constrant_1 = require("./zonal.constrant");
const zonal_service_1 = require("./zonal.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield zonal_service_1.ZonalService.inertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Zonal Created Successfully',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pbsCode = req.params.pbsCode;
    const filters = (0, pick_1.default)(req.query, zonal_constrant_1.zonalFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield zonal_service_1.ZonalService.getAllFromDB(filters, options, pbsCode);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'zonal data fatched',
        meta: result.meta,
        data: result.data,
    });
}));
const getDataById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield zonal_service_1.ZonalService.getDataById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'zonal data fatched',
        data: result,
    });
}));
exports.ZonalController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
};
