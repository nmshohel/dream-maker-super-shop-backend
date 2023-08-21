"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pbs_routes_1 = require("../modules/pbs/pbs.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/pbs',
        route: pbs_routes_1.PbsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
