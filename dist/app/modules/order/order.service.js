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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const order_constrant_1 = require("./order.constrant");
const order_utils_1 = require("./order.utils");
const insertIntoDB = (userData, requestUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { product } = userData, orderType = __rest(userData, ["product"]);
    const data = product;
    const generatedOrderId = yield (0, order_utils_1.generateOrderId)();
    let userOrderType = orderType.orderType;
    userOrderType = userOrderType ? userOrderType : "cashOnDelivery";
    const authUser = yield prisma_1.default.user.findFirst({
        where: {
            email: requestUser === null || requestUser === void 0 ? void 0 : requestUser.email,
        },
    });
    if (!authUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Not Found');
    }
    let userShippingAddress = yield prisma_1.default.shippingAddress.findFirst({
        where: {
            userEmail: requestUser === null || requestUser === void 0 ? void 0 : requestUser.email,
        }
    });
    if (!(userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.districtId) ||
        !(userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.postCode) ||
        !(userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.divisionId) ||
        !(userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.thanaId) ||
        !(userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.houseBuildingStreet)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User Shipping Address Not found");
    }
    let userOrder;
    let totalPrice = 0;
    let totalDiscount = 0;
    let userOrderedProduct = [];
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        if (userOrderType === undefined) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "undidiend");
        }
        userOrder = yield transactionClient.order.create({
            data: {
                userEmail: authUser === null || authUser === void 0 ? void 0 : authUser.email,
                orderType: userOrderType,
                orderId: generatedOrderId,
                divisionId: userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.divisionId,
                districtId: userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.districtId,
                thanaId: userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.thanaId,
                postCode: userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.postCode,
                houseBuildingStreet: userShippingAddress === null || userShippingAddress === void 0 ? void 0 : userShippingAddress.houseBuildingStreet,
                contactNo: authUser === null || authUser === void 0 ? void 0 : authUser.contactNo,
                name: authUser.name,
                totalPrice: totalPrice.toString(),
                totaldiscount: totalDiscount.toString(), // Add this line
            },
        });
        //start loop
        for (let index = 0; index < data.length; index++) {
            const product = yield transactionClient.product.findFirst({
                where: {
                    id: data[index].productId
                }
            });
            if (!product) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product Not Found");
            }
            //sum of total price and total discount
            if (product.discount) {
                totalDiscount = totalDiscount + (parseInt(product.discount) * parseInt(data[index].quantity));
            }
            if (product.price) {
                totalPrice = totalPrice + (parseInt(product.price) * parseInt(data[index].quantity));
            }
            const newOrderedProduct = yield transactionClient.orderedProduct.create({
                data: {
                    orderId: userOrder.orderId,
                    productId: data[index].productId,
                    quantity: String(data[index].quantity),
                    price: product.price,
                    discount: product.discount
                },
            });
            //   for decrease order quantity
            const productsQuantity = yield transactionClient.product.findFirst({
                where: {
                    id: newOrderedProduct.productId,
                },
            });
            const products = yield transactionClient.product.update({
                where: {
                    id: newOrderedProduct.productId,
                },
                data: {
                    quantity: (Number(productsQuantity === null || productsQuantity === void 0 ? void 0 : productsQuantity.quantity) - Number(newOrderedProduct.quantity)).toString(),
                },
            });
            userOrderedProduct.push(newOrderedProduct);
        } //end loop
        userOrder = yield transactionClient.order.update({
            where: {
                id: userOrder === null || userOrder === void 0 ? void 0 : userOrder.id
            },
            data: {
                totaldiscount: totalDiscount.toString(),
                totalPrice: totalPrice.toString(),
            }
        });
    })); //end transction
    return { userOrder, userOrderedProduct: userOrderedProduct };
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: order_constrant_1.OrderSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: { OrderedProduct: true },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.order.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getAllFromDBByCustomer = (filters, options, requestUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: order_constrant_1.OrderSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    console.log('requestUser', requestUser);
    const result = yield prisma_1.default.order.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { userEmail: requestUser.email }),
        skip,
        take: limit,
        include: { OrderedProduct: true },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.order.count({
        where: { userEmail: requestUser.email },
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getDataById = (id, requestUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('requestUser', requestUser);
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            OrderedProduct: true,
        },
    });
    return result;
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.delete({
        where: {
            id,
        },
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
exports.OrderService = {
    getAllFromDBByCustomer,
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDB,
    deleteById,
};
