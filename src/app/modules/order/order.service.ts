/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { OrderSearchableFields } from './order.constrant';
import { OrderFilterRequest } from './order.interface';

const insertIntoDB = async (
  data: {
    productId: string;
    quantity: string;
  }[],
  requestUser: { email: string; role: string }
): Promise<any> => {
  const reqUser = await prisma.user.findFirst({
    where: {
      email: requestUser?.email,
    },
  });
  if (!reqUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }

  let userOrder: any | undefined;
  let userOrderedBook: { orderId: string; productId: string; quantity: string }[] =
    [];
  await prisma.$transaction(async transactionClient => {
    userOrder = await transactionClient.order.findFirst({
      where: {
        userEmail: reqUser.email,
      },
    });
    if (!userOrder) {
      userOrder = await transactionClient.order.create({
        data: {
          userEmail: reqUser.email,
        },
      });
    }
    for (let index = 0; index < data.length; index++) {
      const existingOrderedBook = await transactionClient.orderedProduct.findFirst(
        {
          where: {
            orderId: userOrder.id,
            productId: data[index].productId,
          },
        }
      );
      if (existingOrderedBook) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order already submited');
      } else {
        const newOrderedBook = await transactionClient.orderedProduct.create({
          data: {
            orderId: userOrder.id,
            productId: data[index].productId,
            quantity: String(data[index].quantity),
          },
        });
        const booksQuantity = await transactionClient.product.findFirst({
          where: {
            id: newOrderedBook.productId,
          },
        });
        const products = await transactionClient.product.update({
          where: {
            id: newOrderedBook.productId,
          },
          data: {
            quantity: (
              Number(booksQuantity?.quantity) - Number(newOrderedBook.quantity)
            ).toString(),
          },
        });
        userOrderedBook.push(newOrderedBook);
      }
    }
  });
  return { userOrder, userOrderedBook };
};

const getAllFromDB = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OrderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { OrderedProduct: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.order.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getAllFromDBByCustomer = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions,
  requestUser: any
): Promise<IGenericResponse<Order[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OrderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  console.log('requestUser', requestUser);
  const result = await prisma.order.findMany({
    where: { ...whereConditions, userEmail: requestUser.email },
    skip,
    take: limit,
    include: { OrderedProduct: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.order.count({
    where: { userEmail: requestUser.email },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (
  id: string,
  requestUser: any
): Promise<Order | null> => {
  console.log('requestUser', requestUser);
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      OrderedProduct: true,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Order>
): Promise<Order> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const OrderService = {
  getAllFromDBByCustomer,
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
