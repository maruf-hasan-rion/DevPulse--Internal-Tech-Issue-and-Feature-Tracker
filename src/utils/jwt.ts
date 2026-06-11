import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import type { TJwtPayload } from "../types";

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret =
    type === "refresh" ? config.jwt_refresh_secret : config.jwt_secret;
  const decoded = jwt.verify(token, secret) as JwtPayload;
  console.log("Decoded JWT Payload:", decoded);
  return decoded;
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
