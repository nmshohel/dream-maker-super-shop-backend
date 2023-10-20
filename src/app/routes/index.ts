import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AuthorRoutes } from '../modules/author/author.route';
import { BookRoutes } from '../modules/book/book.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { GenreRoutes } from '../modules/genre/genre.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PublicationRoutes } from '../modules/publication/publication.route';
import { SubCategoryRoutes } from '../modules/subCategory/subCategory.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes

  {
    path: '/auth',
    route: AuthRoutes,
  },
  // {
  //   path: '/users',
  //   route: UserRoutes,
  // },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/authors',
    route: AuthorRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/sub-categories',
    route: SubCategoryRoutes,
  },
  {
    path: '/genre',
    route: GenreRoutes,
  },
  {
    path: '/publication',
    route: PublicationRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
