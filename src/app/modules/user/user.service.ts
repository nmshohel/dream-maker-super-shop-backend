import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constrant';
import { userFilterRequest } from './user.interface';

const getAllFromDB = async (
  filters: userFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: userSearchableFields.map(field => ({
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

  const whereConditons: Prisma.UserWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : undefined,
  });

  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getDataById = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (result) {
    result.password = '';
  }
  return result;
};
const getSingleUser = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (result) {
    result.password = '';
  }
  return result;
};
const deleteById = async (email: string): Promise<User | null> => {
  const result = await prisma.user.delete({
    where: {
      email,
    },
  });
  return result;
};
const updateIntoDB = async (
  email: string,
  payload: Partial<User>
): Promise<User> => {

  const isExistUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
  }
  const result = await prisma.user.update({
    where: {
      email,
    },
    data: payload,
  });
  return result;
};
export const UserService = {
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
  getSingleUser
};
