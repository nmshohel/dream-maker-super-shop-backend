import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
// import { User } from '../user/user.model';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  ILoginUser,
  IRefreshTokenResponse,
  IUserLoginResponse,
} from './auth.interface';

const insertIntoDB = async (data: User): Promise<User> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.jwt.salt_round)
  );
  const isExistUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  let result: User | null = null;

  await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: data,
      include:{
        addresses:true,
        shippingAddresses:true
      }
    });

    // Check if the user was created successfully
    if (!createdUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Assuming createdUser has the expected shape, you can assign it to result
    result = createdUser;

    const userEmail = createdUser.email;

    const addresses = await tx.address.create({
      data: {
        userEmail: userEmail,
      },
    });

    const shippingAddress = await tx.shippingAddress.create({
      data: {
        userEmail: userEmail,
      },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not created");
  }

  return result;
};


const loginUser = async (payload: ILoginUser): Promise<IUserLoginResponse> => {
  const { email: userEmail, password } = payload;

  // creating user instance of User

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist?.password
  );

  // check password matched

  if (isUserExist.password && !isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // create access token and refress token
  // const accessToken = jwt.sign(
  //   {
  //     id: isUserExist?.id,
  //     role: isUserExist?.role,
  //   },
  //   config.jwt.secret as Secret,
  //   {
  //     expiresIn: config.jwt.expires_in,
  //   }
  // );
  const { email, role,name,profileImg } =
    isUserExist;
  const userInfo = {
    email,
    role,
    name,
    profileImg

  };
  const accessToken = jwtHelpers.createToken(
    userInfo,
    config.jwt.secret as string,
    config.jwt.expiren_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    userInfo,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_secret_in as string
  );

  // const refreshToken = jwt.sign(
  //   {
  //     id: isUserExist?.id,
  //     role: isUserExist?.role,
  //   },
  //   config.jwt.refresh_secret as Secret,
  //   {
  //     expiresIn: config.jwt.refresh_expires_in,
  //   }
  // );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifyToken = null;
  try {
    verifyToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }
  const { email } = verifyToken;
  // checking deleteUser refresh token
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // genereate token
  const newAccessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
      name:isUserExist.name,
      profileImg:isUserExist.profileImg
      
    },
    config.jwt.secret as Secret,
    config.jwt.expiren_in as string
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  insertIntoDB,
};
