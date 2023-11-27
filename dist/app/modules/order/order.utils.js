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
exports.generateOrderId = exports.findLastOrderId = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Student ID
const findLastOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrder = yield prisma_1.default.order.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            orderId: true,
        },
    });
    return (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.orderId) || undefined;
});
exports.findLastOrderId = findLastOrderId;
const generateOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrderId = yield (0, exports.findLastOrderId)();
    const currentId = lastOrderId ? lastOrderId : "10000000";
    let incrementedId = (parseInt(currentId) + 1);
    return incrementedId.toString();
});
exports.generateOrderId = generateOrderId;
