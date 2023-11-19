"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "title is required"
        }),
        productTypeId: zod_1.z.string({
            required_error: "Product type is required"
        }),
    }),
});
const update = zod_1.z.object({
    title: zod_1.z.string().optional(),
});
exports.CategoryValidation = {
    create,
    update,
};
