import { Author } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AuthorFilterableFields } from './author.constrant';
import { AuthorService } from './author.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthorService.inertIntoDB(req.body);
  sendResponse<Author>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, AuthorFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await AuthorService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AuthorService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author fetched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AuthorService.deleteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await AuthorService.updateIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author updated successfully',
    data: result,
  });
});
export const AuthorController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
