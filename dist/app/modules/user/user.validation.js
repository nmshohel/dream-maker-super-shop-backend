"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const create = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    role: zod_1.z.enum([...Object.values(client_1.UserRole)], {}),
    contactNo: zod_1.z.string(),
    address: zod_1.z.string(),
    profileImg: zod_1.z.string(),
});
const update = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().optional(),
    role: zod_1.z
        .enum([...Object.values(client_1.UserRole)], {})
        .optional(),
    contactNo: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    profileImg: zod_1.z.string().optional(),
});
exports.UserValidation = {
    create,
    update,
};
