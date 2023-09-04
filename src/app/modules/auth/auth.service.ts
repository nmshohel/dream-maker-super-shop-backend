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
    Number(config.bycrypt_salt_rounds)
  );
  const result = prisma.user.create({
    data: data,
  });
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
  console.log(isUserExist);
  const { email, role } = isUserExist;
  const userInfo = {
    email,
    role,
  };
  const accessToken = jwtHelpers.createToken(
    userInfo,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    userInfo,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
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
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
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
