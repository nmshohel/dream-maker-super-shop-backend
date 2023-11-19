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
  };
  products.map((p) => {
    if (p.productTypeId === '343fa2e7-4e6b-435a-bfdf-82ed1f955a16') {
      result.electronicsDevices.push(p);
    } else if (p.productTypeId === '51414356-5509-45fd-aa1d-e2407d7f958c') {
      result.sportsAndOutdoors.push(p);
    } else if (p.productTypeId === '61e49527-6a0b-4f51-8931-74c842f0d536') {
      result.groceries.push(p);
    }
    else if (p.productTypeId === '72323d71-7714-4060-aecc-bd1162503392') {
      result.healthAndBeauty.push(p);
    }
    else if (p.productTypeId === '90a11a21-63c8-496d-9cc8-2605194fc6ff') {
      result.menAndBoysFashion.push(p);
    }
    else if (p.productTypeId === '9b1929ab-61d3-4a03-b5d1-573e3a258b13') {
      result.electronicAccessories.push(p);
    }
    else if (p.productTypeId === 'a1488bd9-0e27-49af-9c8e-de9e35a7478a') {
      result.automotiveMotorbike.push(p);
    }
    else if (p.productTypeId === 'bd09dfe8-c933-47c7-b428-0cb0b7ea407a') {
      result.homeAndLifestyle.push(p);
    }
    else if (p.productTypeId === 'c15b8816-72d0-4a0e-9a22-6eb442a4ec3b') {
      result.watchesBagsJewellery.push(p);
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
