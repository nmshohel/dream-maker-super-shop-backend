/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';



const updateIntoDB = async (
  email: string,
  payload: Partial<Address>
): Promise<Address> => {
    if(!email)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found")
    }
  const result = await prisma.address.update({
    where: {
      userEmail:email,
    },
    data: payload,
  });
  return result;
};

const getDataByEmail = async (email: string): Promise<Address | null> => {
    if(!email)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found")
    }
    const result = await prisma.address.findUnique({
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
export const AddressService = {

  updateIntoDB,
  getDataByEmail

};
