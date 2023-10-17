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
// const insertIntoDB = async (
//   data: {
//     bookId: string;
//     quantity: number;
//   }[],
//   requestUser: { email: string; role: string }
// ): Promise<any> => {
//   const reqUser = await prisma.user.findFirst({
//     where: {
//       email: requestUser?.email,
//     },
//   });
//   if (!reqUser) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
//   }
//   let userOrder: Order | undefined;
//   let userOrderedBook: { orderId: string; bookId: string; quantity: string }[] =
//     [];
//   await prisma.$transaction(async transactionClient => {
//     userOrder = await transactionClient.order.create({
//       data: {
//         userEmail: reqUser.email,
//       },
//     });
//     for (let index = 0; index < data.length; index++) {
//       console.log(data[index].bookId);
//       // eslint-disable-next-line no-unused-vars
//       const orderbook = await transactionClient.orderedBook.create({
//         data: {
//           orderId: userOrder.id,
//           bookId: data[index].bookId,
//           quantity: String(data[index].quantity),
//         },
//       });
//       userOrderedBook.push(orderbook);
//     }
//   });
//   return { userOrder, userOrderedBook };
// };

const insertIntoDB = async (
  data: {
    bookId: string;
    quantity: number;
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
  let userOrderedBook: { orderId: string; bookId: string; quantity: string }[] =
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
      const existingOrderedBook = await transactionClient.orderedBook.findFirst(
        {
          where: {
            orderId: userOrder.id,
            bookId: data[index].bookId,
          },
        }
      );
      if (existingOrderedBook) {
        // Update the existing OrderedBook with new quantity or handle as needed
        // await transactionClient.orderedBook.update({
        //   where: {
        //     id: existingOrderedBook.id,
        //   },
        //   data: {
        //     quantity: String(data[index].quantity),
        //   },
        // });
        // userOrderedBook.push(existingOrderedBook);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order already submited');
      } else {
        const newOrderedBook = await transactionClient.orderedBook.create({
          data: {
            orderId: userOrder.id,
            bookId: data[index].bookId,
            quantity: String(data[index].quantity),
          },
        });
        const booksQuantity = await transactionClient.book.findFirst({
          where: {
            id: newOrderedBook.bookId,
          },
        });
        const books = await transactionClient.book.update({
          where: {
            id: newOrderedBook.bookId,
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
      userEmail: getUser?.email,
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
    include: { orderedBook: true },
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
    include: {
      orderedBook: true,
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
