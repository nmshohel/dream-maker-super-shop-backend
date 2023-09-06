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
const insertIntoDB = async (data: any, requestUser: any): Promise<any> => {
  const getUser = await prisma.user.findUnique({
    where: {
      email: requestUser.email,
    },
  });

  if (!getUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not found');
  }

  const orderedUser = {
    userId: getUser.id,
  };

  let result;

  await prisma.$transaction(async transactionClient => {
    result = await transactionClient.order.create({
      data: orderedUser,
    });

    const { orderedBooks } = data;
    for (let index = 0; index < orderedBooks.length; index++) {
      console.log(orderedBooks[index].bookId);
      // eslint-disable-next-line no-unused-vars
      const createOrder = await transactionClient.orderedBook.create({
        data: {
          orderId: result.id,
          bookId: orderedBooks[index].bookId,
          quantity: String(orderedBooks[index].quantity),
        },
      });
    }
  });

  const { id, userId, status } = result;
  return { id, userId, orderedBooks: data.orderedBooks, status };
};

const getAllFromDB = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions,
  requestUser: any
): Promise<IGenericResponse<Order[]>> => {
  // console.log('request user:', requestUser);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  const getUser = await prisma.user.findUnique({
    where: {
      email: requestUser.email,
    },
  });
  console.log('get user----------------------', getUser);
  if (requestUser.role === 'admin') {
    // Admins can access all data, so no additional condition needed.
  } else {
    andConditions.push({
      userId: getUser?.id,
    });
  }

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

const getDataById = async (
  id: string,
  requestUser: any
): Promise<Order | null> => {
  console.log('requestUser', requestUser);
  const result = await prisma.order.findUnique({
    where: {
      id,
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
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
