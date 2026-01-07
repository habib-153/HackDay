"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../User/user.model");
const auth_utils_1 = require("./auth.utils");
const registerUser = async (payload) => {
    // Check if user already exists
    const existingUser = await user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User with this email already exists!');
    }
    // Create new user (password will be hashed by pre-save hook)
    const newUser = await user_model_1.User.create(payload);
    // Create token and send to the client
    const jwtPayload = {
        userId: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const loginUser = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // Check if password is correct
    const isPasswordMatched = await user.isPasswordMatched(payload.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password does not match!');
    }
    // Create token and send to the client
    const jwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const changePassword = async (userData, payload) => {
    const user = await user_model_1.User.findById(userData.userId).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // Check if old password is correct
    const isPasswordMatched = await user.isPasswordMatched(payload.oldPassword);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password does not match!');
    }
    // Hash new password
    const newHashedPassword = await bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findByIdAndUpdate(userData.userId, {
        password: newHashedPassword,
    }, {
        new: true,
    });
    return null;
};
const refreshToken = async (token) => {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId } = decoded;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const jwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
};
exports.AuthServices = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
};
//# sourceMappingURL=auth.service.js.map