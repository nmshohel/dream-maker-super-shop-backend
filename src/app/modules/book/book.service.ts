/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { BookSearchableFields } from './book.constrant';
import { BookFilterRequest } from './book.interface';

const inertIntoDB = async (data: Book): Promise<Book> => {
  const isExist = await prisma.book.findFirst({
    where: {
      title: data.title,
      authorIds: data.authorIds,
    },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book allready added');
  }
  const result = await prisma.book.create({
    data: data,
    include: {
      category: true,
      author: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: BookFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, minPrice, maxPrice, ...filterData } = filters; // Add minPrice and maxPrice
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: BookSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Add conditions for minPrice and maxPrice, converting them to Float
  if (minPrice !== undefined) {
    andConditions.push({
      price: {
        gte: parseFloat(minPrice), // Convert to Float
      },
    });
  }

  if (maxPrice !== undefined) {
    andConditions.push({
      price: {
        lte: parseFloat(maxPrice), // Convert to Float
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { category: true, author: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : undefined, // Removing the orderBy property when not needed
  });

  const total = await prisma.book.count();

  return {
    meta: {
      total,
      page,
      limit,
    },

    data: result,
  };
};

const getDataById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
    include: { category: true, author: true },
  });
  return result;
};
const deleteById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
    include: { category: true, author: true },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Book>
): Promise<Book> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    include: { category: true, author: true },
    data: payload,
  });
  return result;
};
export const BookService = {
  inertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
