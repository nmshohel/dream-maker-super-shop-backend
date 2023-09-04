import { ENUM_USER_ROLE } from '../../../enums/user';

export type ILoginUser = {
  email: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: ENUM_USER_ROLE | null;
    contactNo: string;
    address: string;
    profileImg: string;
  };
};
