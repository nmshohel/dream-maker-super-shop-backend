import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ShippingAddressService } from './shippingAddress.service';





const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const email=req?.user?.email
const payload=req.body;
const result=await ShippingAddressService.updateIntoDB(email,payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address Update Successfully',
    data: result,
  });
});

const getByEmail = catchAsync(async (req: Request, res: Response) => {
const email=req?.user?.email
console.log(email)
const result=await ShippingAddressService.getDataByEmail(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address fetch Successfully',
    data: result,
  });
});



export const ShippingAddressController = {
    updateAddress,
    getByEmail

};
