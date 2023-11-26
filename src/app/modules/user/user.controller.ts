import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constrant';
import { UserService } from './user.service';

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
  const email = req?.params?.email;
  const result = await UserService.getDataById(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const email = req?.params?.email;
  const result = await UserService.deleteById(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const email: any = req?.user?.email;
  
  const payload = req.body;
  
  const result = await UserService.updateIntoDB(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});
export const UserController = {
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
