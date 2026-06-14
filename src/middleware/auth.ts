import type { NextFunction, Request, Response } from "express";
import { sql } from "../db";
import type { TJwtPayload, TRole } from "../types";
import sendResponse from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";

const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || Array.isArray(authHeader)) {
        return sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Access token is missing or malformed",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

      if (!token) {
        return sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Access token is missing or malformed",
        });
      }

      let payload: TJwtPayload;
      try {
        payload = verifyToken(token, "access") as TJwtPayload;
      } catch (verifyError) {
        return sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message:
            verifyError instanceof Error
              ? verifyError.message
              : "Invalid or expired access token",
        });
      }

      if (!payload || !payload.email || !payload.role) {
        return sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Invalid or expired access token",
        });
      }
      const userData = await sql`
         SELECT id, name, email, role 
         FROM users 
         WHERE email = ${payload.email}
       `;

      if (userData.length === 0) {
        throw new Error("User not found!!");
      }
      const user = userData[0] as TJwtPayload;

      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: "Forbidden!! This role have no access!",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
