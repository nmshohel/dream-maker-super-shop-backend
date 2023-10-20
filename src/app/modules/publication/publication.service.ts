/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Publication } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { PublicationSearchableFields } from './publication.constrant';
import { PublicationFilterRequest } from './publication.interface';

const inertIntoDB = async (data: Publication): Promise<Publication> => {
  const result = prisma.publication.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async (
  filters: PublicationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Publication[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: PublicationSearchableFields.map(field => ({
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

  const whereConditons: Prisma.PublicationWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.publication.findMany({
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

  const total = await prisma.publication.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Publication | null> => {
  const result = await prisma.publication.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Publication | null> => {
  const result = await prisma.publication.delete({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Publication>
): Promise<Publication> => {
  const result = await prisma.publication.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
export const PublicationService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
