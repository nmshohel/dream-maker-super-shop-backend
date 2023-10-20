/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, SubCategory } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { SubCategorySearchableFields } from './subCategory.constrant';
import { SubCategoryFilterRequest } from './subCategory.interface';

const inertIntoDB = async (data: SubCategory): Promise<SubCategory> => {
  const result = prisma.subCategory.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: SubCategoryFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SubCategory[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: SubCategorySearchableFields.map(field => ({
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

  const whereConditons: Prisma.SubCategoryWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.subCategory.findMany({
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

  const total = await prisma.subCategory.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<SubCategory | null> => {
  const result = await prisma.subCategory.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<SubCategory | null> => {
  const result = await prisma.subCategory.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<SubCategory>
): Promise<SubCategory> => {
  const result = await prisma.subCategory.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const SubCategoryService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
