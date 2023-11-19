
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

import { Product } from '@prisma/client';
import { ProductFilterableFields } from './product.constrant';
import { ProductService } from './product.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.inertIntoDB(req.body);
  sendResponse<Product>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ProductFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ProductService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getAllFromDBByProductType = catchAsync(async (req, res) => {
  const result = await ProductService.getAllFromDBByProductType();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result.data,
  });

});

const getDataById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});
const getDataBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  console.log(slug)
  const result = await ProductService.getDataBySlug(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.deleteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await ProductService.updateIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});
export const ProductController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
  getAllFromDBByProductType,
  getDataBySlug
};
