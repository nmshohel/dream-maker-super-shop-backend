"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        nameInBengali: zod_1.z.string().optional(),
        nameInEnglish: zod_1.z.string({
            required_error: 'Name in english is required',
        }),
    }),
});
const update = zod_1.z.object({
    title: zod_1.z.string().optional(),
});
exports.AuthorValidation = {
    create,
    update,
};
