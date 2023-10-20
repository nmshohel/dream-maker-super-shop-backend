/* eslint-disable @typescript-eslint/no-explicit-any */
import { Genre, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { GenreSearchableFields } from './genre.constrant';
import { GenreFilterRequest } from './genre.interface';

const inertIntoDB = async (data: Genre): Promise<Genre> => {
  const result = prisma.genre.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: GenreFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Genre[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: GenreSearchableFields.map(field => ({
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

  const whereConditons: Prisma.GenreWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.genre.findMany({
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

  const total = await prisma.genre.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Genre | null> => {
  const result = await prisma.genre.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Genre | null> => {
  const result = await prisma.genre.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Genre>
): Promise<Genre> => {
  const result = await prisma.genre.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const GenreService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
