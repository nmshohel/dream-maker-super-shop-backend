"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const author_route_1 = require("../modules/author/author.route");
const book_route_1 = require("../modules/book/book.route");
const category_route_1 = require("../modules/category/category.route");
const genre_route_1 = require("../modules/genre/genre.route");
const order_route_1 = require("../modules/order/order.route");
const publication_route_1 = require("../modules/publication/publication.route");
const subCategory_route_1 = require("../modules/subCategory/subCategory.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    // {
    //   path: '/users',
    //   route: UserRoutes,
    // },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/authors',
        route: author_route_1.AuthorRoutes,
    },
    {
        path: '/books',
        route: book_route_1.BookRoutes,
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
        path: '/genre',
        route: genre_route_1.GenreRoutes,
    },
    {
        path: '/publication',
        route: publication_route_1.PublicationRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
