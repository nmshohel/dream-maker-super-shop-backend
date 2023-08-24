"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        mobileNo: zod_1.z.string({
            required_error: 'mobileNo code is required',
        }),
        password: zod_1.z.string({
            required_error: 'password name is required',
        }),
        pbsCode: zod_1.z.string({
            required_error: 'pbsCode code is required',
        }),
        zonalCode: zod_1.z.string({
            required_error: 'zonalCode code is required',
        }),
        substationCode: zod_1.z.string().optional(),
        complainCode: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    create,
};