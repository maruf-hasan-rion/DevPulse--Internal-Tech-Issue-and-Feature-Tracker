import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../../utils/jwt";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserInDB(req.body);
    if (!result) {
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to create user! Please try again later!",
      });
    }
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    const { accessToken, refreshToken } = generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: { token: accessToken, user },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;
    if (!currentRefreshToken) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "No refresh token provided",
        errors: true,
      });
    }
    const { accessToken, newRefreshToken } =
      await authService.generateRefreshToken(currentRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Access token successfully refreshed!",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized",
      errors: [],
    });
  }
};

export const authController = {
  createUser,
  loginUser,
  refreshToken,
};
