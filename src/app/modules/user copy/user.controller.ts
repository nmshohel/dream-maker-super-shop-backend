import { User } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constrant';
import { UserService } from './user.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.inertIntoDB(req.body);
  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User getched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.deleteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.updateIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});
export const UserController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
