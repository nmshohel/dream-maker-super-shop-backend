/* eslint-disable @typescript-eslint/no-explicit-any */

import { ShippingAddress } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';



const updateIntoDB = async (
  email: string,
  payload: any
): Promise<ShippingAddress | null> => {
  

    // Check if the record exists
    const existingRecord = await prisma.shippingAddress.findUnique({
      where: {
        userEmail: email,
      },
    });

    if (!existingRecord) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found")
    }

    // If the record exists, proceed with the update
    const result = await prisma.shippingAddress.update({
      where: {
        userEmail: email,
      },
      data: payload,
    });

    return result;

};


const getDataByEmail = async (email: string): Promise<ShippingAddress | null> => {
    if(!email)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found")
    }
    const result = await prisma.shippingAddress.findUnique({
      where: {
        userEmail:email,
      },
      include:{
        districts:true,
        thanas:true,
        users:true
      }
    });
    return result;
  };
export const ShippingAddressService = {

  updateIntoDB,
  getDataByEmail

};
