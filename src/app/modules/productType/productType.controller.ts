
import { ProductType } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ProductTypeFilterableFields } from './productType.constrant';
import { ProductTypeService } from './productType.service';


const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductTypeService.inertIntoDB(req.body);
  sendResponse<ProductType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product type Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ProductTypeFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ProductTypeService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product type fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ProductTypeService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product type fetched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ProductTypeService.deleteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product type Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await ProductTypeService.updateIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product type updated successfully',
    data: result,
  });
});
export const ProductTypeController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
