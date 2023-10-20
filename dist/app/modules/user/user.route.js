"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
const { ADMIN } = user_1.ENUM_USER_ROLE;
router.get('/', user_controller_1.UserController.getAllFromDB);
router.get('/:id', user_controller_1.UserController.getDataById);
router.delete('/:id', user_controller_1.UserController.deleteById);
router.patch('/:id', user_controller_1.UserController.updateIntoDB);
exports.UserRoutes = router;
