import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const verifyJWT = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (_error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
};
