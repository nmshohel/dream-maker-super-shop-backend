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

  const result = await prisma.order.create({
    data: orderedUser,
  });
  return result;
};

// const insertIntoDB = async (data: any, requestUser: any): Promise<any> => {

//   const getUser = await prisma.user.findUnique({
//     where: {
//       email: requestUser.email,
//     },
//   });
//   console.log('get User', getUser?.id);

//   const orderedUser = {
//     userId: getUser?.id,
//   };
//   const result = await prisma.order.create({
//     data: orderedUser,
//   });
// return result;
// const newCourse = await prisma.$transaction(async transactionClient => {
//   const result = await transactionClient.order.create({
//     data: courseData,
//   });
//   if (!result) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
//   }
//   if (preRequisiteCourses && preRequisiteCourses.length > 0) {
//     for (let index = 0; index < preRequisiteCourses.length; index++) {
//       const createPrerequisite =
//         await transactionClient.courseToPrerequisite.create({
//           data: {
//             courseId: result.id,
//             preRequisiteId: preRequisiteCourses[index].courseId,
//           },
//         });
//       console.log(createPrerequisite);
//     }
//   }
//   return result;
// });
// if (newCourse) {
//   const responseData = await prisma.course.findUnique({
//     where: {
//       id: newCourse.id,
//     },
//     include: {
//       preRequisite: {
//         include: {
//           preRequisite: true,
//         },
//       },
//       preRequisiteFor: {
//         include: {
//           course: true,
//         },
//       },
//     },
//   });
//   return responseData;
// }
// throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
// };

const getAllFromDB = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: OrderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.OrderWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.order.findMany({
    where: whereConditons,
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

const getDataById = async (id: string): Promise<Order | null> => {
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
