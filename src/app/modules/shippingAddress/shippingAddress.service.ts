/* eslint-disable @typescript-eslint/no-explicit-any */

import { ShippingAddress } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';



const updateIntoDB = async (
  email: string,
  payload: Partial<ShippingAddress>
): Promise<ShippingAddress> => {
    if(!email)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found")
    }
  const result = await prisma.shippingAddress.update({
    where: {
      userEmail:email,
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
        postOffices:true,
        users:true
      }
    });
    return result;
  };
export const ShippingAddressService = {

  updateIntoDB,
  getDataByEmail

};
