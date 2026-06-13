import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  adminId: string;
  roleId: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  if (!env.jwtAccessSecret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return jwt.sign(
    payload,
    env.jwtAccessSecret as Secret,
    {
      expiresIn: env.jwtAccessExpiresIn,
    } as SignOptions,
  );
};

export const signRefreshToken = (payload: JwtPayload): string => {
  if (!env.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return jwt.sign(
    payload,
    env.jwtRefreshSecret as Secret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
    } as SignOptions,
  );
};
