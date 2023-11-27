"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const product_constrant_1 = require("./product.constrant");
const inertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // for create slag
    const cleanedTitle = data.name
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .trim() // Trim leading and trailing spaces
        .toLowerCase(); // Convert to lowercase
    const slug = cleanedTitle.replace(/\s+/g, '-');
    const isExist = yield prisma_1.default.product.findFirst({
        where: {
            name: data.name,
        },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Product allready added');
    }
    data.slug = slug;
    const result = yield prisma_1.default.product.create({
        data: data,
        include: {
            categorys: true,
            subCategorys: true,
            productType: true,
            brand: true
        },
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditons = [];
    if (searchTerm) {
        andConditons.push({
            OR: product_constrant_1.ProductSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditons.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andConditons.length > 0 ? { AND: andConditons } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditons,
        skip,
        take: limit,
        include: {
            productType: {
                select: {
                    title: true
                }
            },
            categorys: {
                select: {
                    title: true
                }
            },
            subCategorys: {
                select: {
                    title: true
                }
            }
        },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : undefined,
    });
    const total = yield prisma_1.default.product.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// const getAllFromDBByProductType = async (
//   filters: ProductFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Product[]>> => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { searchTerm, ...filterData } = filters;
//   const andConditons = [];
//   if (searchTerm) {
//     andConditons.push({
//       OR: ProductSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }
//   if (Object.keys(filterData).length > 0) {
//     andConditons.push({
//       AND: Object.keys(filterData).map(key => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }
//   const whereConditons: Prisma.ProductWhereInput =
//     andConditons.length > 0 ? { AND: andConditons } : {};
//   const result = await prisma.product.findMany({
//     where: whereConditons,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : undefined,
//   });
//   const total = await prisma.product.count();
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };
const getAllFromDBByProductType = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany({
        include: {
            productType: true,
            brand: true,
            categorys: true,
            subCategorys: true
        },
    });
    const result = {
        electronicsDevices: [],
        sportsAndOutdoors: [],
        groceries: [],
        healthAndBeauty: [],
        menAndBoysFashion: [],
        electronicAccessories: [],
        automotiveMotorbike: [],
        homeAndLifestyle: [],
        watchesBagsJewellery: [],
        womenGirlsFashion: [],
    };
    products.map((p) => {
        if (p.productTypeId === '8fa653e2-d353-4ee1-b8f3-ede301a2570b') {
            result.electronicsDevices.push(p);
        }
        else if (p.productTypeId === '88c60b5f-00dc-43ba-ac27-5dac670e84dd') {
            result.sportsAndOutdoors.push(p);
        }
        else if (p.productTypeId === '03ec9d4f-13d4-4a7c-bfb9-a85d395b4ca0') {
            result.groceries.push(p);
        }
        else if (p.productTypeId === '7245cbbc-944e-4469-85da-ebd39c6f202c') {
            result.healthAndBeauty.push(p);
        }
        else if (p.productTypeId === '5c705fd3-eb92-41c9-882b-e118cec9b9f9') {
            result.menAndBoysFashion.push(p);
        }
        else if (p.productTypeId === '31ca0d99-979d-4093-acf8-d3b2ea3ebe1c') {
            result.electronicAccessories.push(p);
        }
        else if (p.productTypeId === '0cdaf1de-b3d8-4ab9-98c5-923afadce3ff') {
            result.automotiveMotorbike.push(p);
        }
        else if (p.productTypeId === '4bc426c1-c8dc-43bd-9aed-9954947e0663') {
            result.homeAndLifestyle.push(p);
        }
        else if (p.productTypeId === '412016ab-db4e-4696-b9b8-59f882a58704') {
            result.watchesBagsJewellery.push(p);
        }
        else if (p.productTypeId === '530fd57c-a10a-4a7a-bfac-fc9060270211') {
            result.womenGirlsFashion.push(p);
        }
    });
    return {
        data: result,
    };
});
const getDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            categorys: true,
            productType: true,
            subCategorys: true,
            brand: true
        },
    });
    return result;
});
const getDataBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findFirst({
        where: {
            slug,
        },
        include: {
            categorys: true,
            productType: true,
            subCategorys: true,
            brand: true
        },
    });
    return result;
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.delete({
        where: {
            id,
        },
        include: {
            categorys: true,
            productType: true,
            subCategorys: true,
            brand: true
        },
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.update({
        where: {
            id,
        },
        include: {
            categorys: true,
            productType: true,
            subCategorys: true,
            brand: true
        },
        data: payload,
    });
    return result;
});
exports.ProductService = {
    inertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDB,
    deleteById,
    getAllFromDBByProductType,
    getDataBySlug
};
