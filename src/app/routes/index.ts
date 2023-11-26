import express from 'express';
import { AddressRoutes } from '../modules/address/address.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BrandRoutes } from '../modules/brand/brand.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ProductTyeRoutes } from '../modules/productType/productType.route';
import { ShippingAddressRoutes } from '../modules/shippingAddress/shippingAddress.route';
import { SubCategoryRoutes } from '../modules/subCategory/subCategory.route';
import { SupplierRoutes } from '../modules/supplier/supplier.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },

  {
    path: '/products',
    route: ProductRoutes,
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
    path: '/brand',
    route: BrandRoutes,
  },
  {
    path: '/product-type',
    route: ProductTyeRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/address',
    route: AddressRoutes,
  },
  {
    path: '/shipping-address',
    route: ShippingAddressRoutes,
  },
  {
    path: '/suppliers',
    route: SupplierRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
