"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTyeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const productType_controller_1 = require("./productType.controller");
const productType_validation_1 = require("./productType.validation");
const router = express_1.default.Router();
const { ADMIN, CUSTOMER } = user_1.ENUM_USER_ROLE;
router.post('/create-product-type', (0, validateRequest_1.default)(productType_validation_1.ProductTypeValidation.create), (0, auth_1.default)(ADMIN), productType_controller_1.ProductTypeController.insertIntoDB);
router.get('/', productType_controller_1.ProductTypeController.getAllFromDB);
router.get('/product-type', productType_controller_1.ProductTypeController.getDataByProductType);
router.get('/:id', (0, auth_1.default)(ADMIN, CUSTOMER), productType_controller_1.ProductTypeController.getDataById);
router.delete('/:id', (0, auth_1.default)(ADMIN), productType_controller_1.ProductTypeController.deleteById);
router.patch('/:id', (0, auth_1.default)(ADMIN), productType_controller_1.ProductTypeController.updateIntoDB);
exports.ProductTyeRoutes = router;
