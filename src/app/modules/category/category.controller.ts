import { Category } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CategoryFilterableFields } from './category.constrant';
import { CategoryService } from './category.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.inertIntoDB(req.body);
  sendResponse<Category>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, CategoryFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await CategoryService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CategoryService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CategoryService.deleteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await CategoryService.updateIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});
export const CategoryController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
