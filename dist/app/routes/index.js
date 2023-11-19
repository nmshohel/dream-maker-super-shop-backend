"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_route_1 = require("../modules/address/address.route");
const auth_route_1 = require("../modules/auth/auth.route");
const brand_route_1 = require("../modules/brand/brand.route");
const category_route_1 = require("../modules/category/category.route");
const order_route_1 = require("../modules/order/order.route");
const payment_route_1 = require("../modules/payment/payment.route");
const product_route_1 = require("../modules/product/product.route");
const productType_route_1 = require("../modules/productType/productType.route");
const shippingAddress_route_1 = require("../modules/shippingAddress/shippingAddress.route");
const subCategory_route_1 = require("../modules/subCategory/subCategory.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/products',
        route: product_route_1.ProductRoutes,
    },
    {
        path: '/orders',
        route: order_route_1.OrderRoutes,
    },
    {
        path: '/sub-categories',
        route: subCategory_route_1.SubCategoryRoutes,
    },
    {
        path: '/brand',
        route: brand_route_1.BrandRoutes,
    },
    {
        path: '/product-type',
        route: productType_route_1.ProductTyeRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/address',
        route: address_route_1.AddressRoutes,
    },
    {
        path: '/shipping-address',
        route: shippingAddress_route_1.ShippingAddressRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
