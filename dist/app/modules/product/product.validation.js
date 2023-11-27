"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        price: zod_1.z.string({
            required_error: 'price is required',
        }),
        discount: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        brandId: zod_1.z.string().optional(),
        warranty: zod_1.z.string({
            required_error: 'warranty is required',
        }),
        productCode: zod_1.z.string().optional(),
        quantity: zod_1.z.string({
            required_error: 'quantity is required',
        }),
        thumbImage: zod_1.z.array(zod_1.z.string()),
        images: zod_1.z.array(zod_1.z.string()),
        rate: zod_1.z.string({
            required_error: 'rate is required',
        }),
        new: zod_1.z.boolean().optional(),
        productTypeId: zod_1.z.string({
            required_error: 'productTypeId is required',
        }),
        subCategoryId: zod_1.z.string({
            required_error: 'subCategoryId is required',
        }),
        categoryId: zod_1.z.string({
            required_error: 'categoryId is required',
        }),
        supplierId: zod_1.z.string({
            required_error: 'supplierId is required',
        }),
    }),
});
exports.ProductValidation = {
    create
};
