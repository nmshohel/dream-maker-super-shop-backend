"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const shippingAddress_controller_1 = require("./shippingAddress.controller");
const router = express_1.default.Router();
router.patch('/:email', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER), shippingAddress_controller_1.ShippingAddressController.updateAddress);
router.get('/:email', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER), shippingAddress_controller_1.ShippingAddressController.getByEmail);
exports.ShippingAddressRoutes = router;
