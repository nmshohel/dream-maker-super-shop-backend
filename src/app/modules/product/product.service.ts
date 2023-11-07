/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Product } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ProductSearchableFields } from './product.constrant';
import { ProductFilterRequest } from './product.interface';


const inertIntoDB = async (data: Product): Promise<Product> => {
  // for create slag
  const cleanedTitle = data.title
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim() // Trim leading and trailing spaces
    .toLowerCase(); // Convert to lowercase
  const slug = cleanedTitle.replace(/\s+/g, '-');

  const isExist = await prisma.product.findFirst({
    where: {
      title: data.title,
    },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product allready added');
  }
  data.slug = slug;
  const result = await prisma.product.create({
    data: data,
    include: {
      categorys: true,
      subCategorys: true,
      productType:true,
      brand:true
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: ProductFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
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

  const whereConditons: Prisma.ProductWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.product.findMany({
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

  const total = await prisma.product.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      categorys: true,
      productType:true,
      subCategorys: true,
      brand:true

    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      categorys: true,
      productType:true,
      subCategorys: true,
      brand:true


    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Product>
): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    include: {
      categorys: true,
      productType:true,
      subCategorys: true,
      brand:true
    },
    data: payload,
  });
  return result;
};
export const ProductService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
