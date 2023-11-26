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
    if (p.productTypeId === '8fa653e2-d353-4ee1-b8f3-ede301a2570b') {
      result.electronicsDevices.push(p);
    } else if (p.productTypeId === '88c60b5f-00dc-43ba-ac27-5dac670e84dd') {
      result.sportsAndOutdoors.push(p);
    } else if (p.productTypeId === '03ec9d4f-13d4-4a7c-bfb9-a85d395b4ca0') {
      result.groceries.push(p);
    }
    else if (p.productTypeId === '7245cbbc-944e-4469-85da-ebd39c6f202c') {
      result.healthAndBeauty.push(p);
    }
    else if (p.productTypeId === '5c705fd3-eb92-41c9-882b-e118cec9b9f9') {
      result.menAndBoysFashion.push(p);
    }
    else if (p.productTypeId === '31ca0d99-979d-4093-acf8-d3b2ea3ebe1c') {
      result.electronicAccessories.push(p);
    }
    else if (p.productTypeId === '0cdaf1de-b3d8-4ab9-98c5-923afadce3ff') {
      result.automotiveMotorbike.push(p);
    }
    else if (p.productTypeId === '4bc426c1-c8dc-43bd-9aed-9954947e0663') {
      result.homeAndLifestyle.push(p);
    }
    else if (p.productTypeId === '412016ab-db4e-4696-b9b8-59f882a58704') {
      result.watchesBagsJewellery.push(p);
    }
    else if (p.productTypeId === '530fd57c-a10a-4a7a-bfac-fc9060270211') {
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
