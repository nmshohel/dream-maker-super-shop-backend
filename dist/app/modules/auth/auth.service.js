"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.password = yield bcrypt_1.default.hash(data.password, Number(config_1.default.jwt.salt_round));
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: {
            email: data === null || data === void 0 ? void 0 : data.email,
        },
    });
    if (isExistUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    let result = null;
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield prisma_1.default.user.create({
            data: data,
        });
        // Check if the user was created successfully
        if (!createdUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create user");
        }
        // Assuming createdUser has the expected shape, you can assign it to result
        result = createdUser;
        const userEmail = createdUser.email;
        const addresses = yield tx.address.create({
            data: {
                userEmail: userEmail,
            },
        });
        const shippingAddress = yield tx.shippingAddress.create({
            data: {
                userEmail: userEmail,
            },
        });
    }));
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not created");
    }
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: userEmail, password } = payload;
    // creating user instance of User
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    // check password matched
    if (isUserExist.password && !isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
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
    const { email, role, name, profileImg } = isUserExist;
    const userInfo = {
        email,
        role,
        name,
        profileImg
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(userInfo, config_1.default.jwt.secret, config_1.default.jwt.expiren_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(userInfo, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_secret_in);
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
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifyToken = null;
    try {
        verifyToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid token');
    }
    const { email } = verifyToken;
    // checking deleteUser refresh token
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // genereate token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        email: isUserExist.email,
        role: isUserExist.role,
        name: isUserExist.name,
        profileImg: isUserExist.profileImg
    }, config_1.default.jwt.secret, config_1.default.jwt.expiren_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    loginUser,
    refreshToken,
    insertIntoDB,
};
