/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, ProductType } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ProductSearchableFields } from '../product/product.constrant';
import { ProductFilterRequest } from '../product/product.interface';

const inertIntoDB = async (data: ProductType): Promise<ProductType> => {
  const result = prisma.productType.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: ProductFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<ProductType[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: ProductSearchableFields.map(field => ({
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

  const whereConditons: Prisma.ProductTypeWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.productType.findMany({
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

  const total = await prisma.productType.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<ProductType | null> => {
  const result = await prisma.productType.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<ProductType | null> => {
  const result = await prisma.productType.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<ProductType>
): Promise<ProductType> => {
  const result = await prisma.productType.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const ProductTypeService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
