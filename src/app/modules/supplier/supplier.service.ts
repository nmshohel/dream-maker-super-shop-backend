/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Supplier } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { SupplierSearchableFields } from './supplier.constrant';
import { SupplierFilterRequest } from './supplier.interface';

const inertIntoDB = async (data: Supplier): Promise<Supplier> => {
  const result = prisma.supplier.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: SupplierFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Supplier[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: SupplierSearchableFields.map(field => ({
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

  const whereConditons: Prisma.SupplierWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.supplier.findMany({
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

  const total = await prisma.supplier.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Supplier | null> => {
  const result = await prisma.supplier.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Supplier | null> => {
  const result = await prisma.supplier.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Supplier>
): Promise<Supplier> => {
  const result = await prisma.supplier.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const SupplierService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
