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
// const insertIntoDB = async (
//   data: {
//     bookId: string;
//     quantity: number;
//   }[],
//   requestUser: { email: string; role: string }
// ): Promise<any> => {
//   const reqUser = await prisma.user.findFirst({
//     where: {
//       email: requestUser?.email,
//     },
//   });
//   if (!reqUser) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
//   }
//   let userOrder: Order | undefined;
//   let userOrderedBook: { orderId: string; bookId: string; quantity: string }[] =
//     [];
//   await prisma.$transaction(async transactionClient => {
//     userOrder = await transactionClient.order.create({
//       data: {
//         userEmail: reqUser.email,
//       },
//     });
//     for (let index = 0; index < data.length; index++) {
//       console.log(data[index].bookId);
//       // eslint-disable-next-line no-unused-vars
//       const orderbook = await transactionClient.orderedBook.create({
//         data: {
//           orderId: userOrder.id,
//           bookId: data[index].bookId,
//           quantity: String(data[index].quantity),
//         },
//       });
//       userOrderedBook.push(orderbook);
//     }
//   });
//   return { userOrder, userOrderedBook };
// };
const insertIntoDB = (data, requestUser) => __awaiter(void 0, void 0, void 0, function* () {
    const reqUser = yield prisma_1.default.user.findFirst({
        where: {
            email: requestUser === null || requestUser === void 0 ? void 0 : requestUser.email,
        },
    });
    if (!reqUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Not Found');
    }
    let userOrder;
    let userOrderedBook = [];
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        userOrder = yield transactionClient.order.findFirst({
            where: {
                userEmail: reqUser.email,
            },
        });
        if (!userOrder) {
            userOrder = yield transactionClient.order.create({
                data: {
                    userEmail: reqUser.email,
                },
            });
        }
        for (let index = 0; index < data.length; index++) {
            const existingOrderedBook = yield transactionClient.orderedBook.findFirst({
                where: {
                    orderId: userOrder.id,
                    bookId: data[index].bookId,
                },
            });
            if (existingOrderedBook) {
                // Update the existing OrderedBook with new quantity or handle as needed
                // await transactionClient.orderedBook.update({
                //   where: {
                //     id: existingOrderedBook.id,
                //   },
                //   data: {
                //     quantity: String(data[index].quantity),
                //   },
                // });
                // userOrderedBook.push(existingOrderedBook);
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order already submited');
            }
            else {
                const newOrderedBook = yield transactionClient.orderedBook.create({
                    data: {
                        orderId: userOrder.id,
                        bookId: data[index].bookId,
                        quantity: String(data[index].quantity),
                    },
                });
                const booksQuantity = yield transactionClient.book.findFirst({
                    where: {
                        id: newOrderedBook.bookId,
                    },
                });
                const books = yield transactionClient.book.update({
                    where: {
                        id: newOrderedBook.bookId,
                    },
                    data: {
                        quantity: (Number(booksQuantity === null || booksQuantity === void 0 ? void 0 : booksQuantity.quantity) - Number(newOrderedBook.quantity)).toString(),
                    },
                });
                userOrderedBook.push(newOrderedBook);
            }
        }
    }));
    return { userOrder, userOrderedBook };
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
        include: { orderedBook: true },
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
        include: { orderedBook: true },
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
            orderedBook: true,
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
