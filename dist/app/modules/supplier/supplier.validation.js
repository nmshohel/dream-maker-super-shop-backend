"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required"
        }),
        address: zod_1.z.string({
            required_error: "address is required"
        }),
        contactNo: zod_1.z.string({
            required_error: "contactNo is required"
        }),
    }),
});
const update = zod_1.z.object({
    title: zod_1.z.string().optional(),
});
exports.SupplierValidation = {
    create,
    update,
};
