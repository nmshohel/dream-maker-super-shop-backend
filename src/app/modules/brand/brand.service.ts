/* eslint-disable @typescript-eslint/no-explicit-any */
import { Brand, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { BrandSearchableFields } from './brand.constrant';
import { BrandFilterRequest } from './brand.interface';


const inertIntoDB = async (data: Brand): Promise<Brand> => {
  const result = prisma.brand.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: BrandFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Brand[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: BrandSearchableFields.map(field => ({
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

  const whereConditons: Prisma.BrandWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.brand.findMany({
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

  const total = await prisma.brand.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Brand | null> => {
  const result = await prisma.brand.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Brand | null> => {
  const result = await prisma.brand.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Brand>
): Promise<Brand> => {
  const result = await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const BrandService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
