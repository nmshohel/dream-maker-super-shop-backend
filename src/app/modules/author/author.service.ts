/* eslint-disable @typescript-eslint/no-explicit-any */
import { Author, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { AuthorSearchableFields } from './author.constrant';
import { AuthorFilterRequest } from './author.interface';

const inertIntoDB = async (data: Author): Promise<Author> => {
  const result = prisma.author.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: AuthorFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Author[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: AuthorSearchableFields.map(field => ({
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

  const whereConditons: Prisma.AuthorWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.author.findMany({
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

  const total = await prisma.author.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Author | null> => {
  const result = await prisma.author.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Author | null> => {
  const result = await prisma.author.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Author>
): Promise<Author> => {
  const result = await prisma.author.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const AuthorService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
