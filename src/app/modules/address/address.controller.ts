import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AddressService } from './address.service';




const updateAddress = catchAsync(async (req: Request, res: Response) => {
const email=req?.params?.email
const payload=req.body;
const result=await AddressService.updateIntoDB(email,payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Address Update Successfully',
    data: result,
  });
});

const getByEmail = catchAsync(async (req: Request, res: Response) => {
const email=req?.params?.email
const result=await AddressService.getDataByEmail(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Address fetch Successfully',
    data: result,
  });
});



export const AddressController = {
    updateAddress,
    getByEmail

};
