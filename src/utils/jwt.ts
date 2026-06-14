import jwt, {
  type JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { config } from "../config";
import type { TJwtPayload } from "../types";

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret =
    type === "refresh" ? config.jwt_refresh_secret : config.jwt_secret;

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error(`Expired ${type} token`);
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error(`Invalid ${type} token`);
    }
    throw error;
  }
};

export const generateToken = (payload: TJwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt_secret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};
