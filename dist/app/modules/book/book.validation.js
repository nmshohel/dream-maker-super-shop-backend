"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
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
        publicationDate: zod_1.z.string({
            required_error: 'publication Date is required',
        }),
        description: zod_1.z.string().optional(),
        quantity: zod_1.z.string({
            required_error: 'quantity is required',
        }),
        thumbImage: zod_1.z.array(zod_1.z.string()),
        images: zod_1.z.array(zod_1.z.string()),
        rate: zod_1.z.string({
            required_error: 'rate is required',
        }),
        new: zod_1.z.boolean().optional(),
        publication: zod_1.z.string({
            required_error: 'publication is required',
        }),
        authorIds: zod_1.z.string({
            required_error: 'authorIds is required',
        }),
        genre: zod_1.z.string({
            required_error: 'genre is required',
        }),
        subCategory: zod_1.z.string({
            required_error: 'subCategory is required',
        }),
        category: zod_1.z.string({
            required_error: 'category is required',
        }),
    }),
});
const update = zod_1.z.object({
    title: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    price: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    publicationDate: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
});
exports.BookValidation = {
    create,
    update,
};
