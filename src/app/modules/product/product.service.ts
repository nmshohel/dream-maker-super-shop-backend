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
  const cleanedTitle = data.name!
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim() // Trim leading and trailing spaces
    .toLowerCase(); // Convert to lowercase
  const slug = cleanedTitle.replace(/\s+/g, '-');

  const isExist = await prisma.product.findFirst({
    where: {
      name: data.name,
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
    include:{
      productType:{
        select:{
          title:true
        }
      },
      categorys:{
        select:{
          title:true
        }
      },
      subCategorys:{
        select:{
          title:true
        }
      }
    },
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

// const getAllFromDBByProductType = async (
//   filters: ProductFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Product[]>> => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { searchTerm, ...filterData } = filters;
//   const andConditons = [];

//   if (searchTerm) {
//     andConditons.push({
//       OR: ProductSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditons.push({
//       AND: Object.keys(filterData).map(key => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   const whereConditons: Prisma.ProductWhereInput =
//     andConditons.length > 0 ? { AND: andConditons } : {};

//   const result = await prisma.product.findMany({
//     where: whereConditons,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : undefined,
//   });

//   const total = await prisma.product.count();

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };


const getAllFromDBByProductType = async () => {
  const products: Product[] = await prisma.product.findMany({
    include: {
      productType: true,
      brand:true,
      categorys:true,
      subCategorys:true
    },
  });
  const result = {
    electronicsDevices: [] as Product[],
    sportsAndOutdoors: [] as Product[],
    groceries: [] as Product[],
    healthAndBeauty: [] as Product[],
    menAndBoysFashion: [] as Product[],
    electronicAccessories: [] as Product[],
    automotiveMotorbike: [] as Product[],
    homeAndLifestyle: [] as Product[],
    watchesBagsJewellery: [] as Product[],
    womenGirlsFashion: [] as Product[],
  };
  products.map((p) => {
    if (p.productTypeId === '559f9252-6dce-4d27-88df-6b13e32e05e8') {
      result.electronicsDevices.push(p);
    } else if (p.productTypeId === 'c9fc52c2-19ad-4432-baa9-4bf99d5f689a') {
      result.sportsAndOutdoors.push(p);
    } else if (p.productTypeId === '4f894cb5-5607-4bf9-80d7-1ace1512b817') {
      result.groceries.push(p);
    }
    else if (p.productTypeId === 'eaedfff0-ba81-4aeb-a4a7-0d56a056cf43') {
      result.healthAndBeauty.push(p);
    }
    else if (p.productTypeId === 'ef9c0e57-cd6d-4bb6-a95d-21c0be73a760') {
      result.menAndBoysFashion.push(p);
    }
    else if (p.productTypeId === '41418d95-d1ad-423d-880e-fd961f6363f7') {
      result.electronicAccessories.push(p);
    }
    else if (p.productTypeId === '37b5c5f8-f710-419c-88f3-6d0e11799364') {
      result.automotiveMotorbike.push(p);
    }
    else if (p.productTypeId === '52ee6366-5faf-48f2-8ee5-7767f7754d8f') {
      result.homeAndLifestyle.push(p);
    }
    else if (p.productTypeId === 'a4100745-1ec3-43b0-9b54-4a051382549b') {
      result.watchesBagsJewellery.push(p);
    }
    else if (p.productTypeId === '6451e0dd-e839-4186-8a17-c2194b3471ae') {
      result.womenGirlsFashion.push(p);
    }
  });
  return {
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
};const getDataBySlug = async (slug: string): Promise<Product | null> => {
  const result = await prisma.product.findFirst({
    where: {
      slug,
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
  getAllFromDBByProductType,
  getDataBySlug
};
