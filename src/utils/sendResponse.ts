import type { Response } from "express";

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

const sendResponse = <T>(res: Response, data: TResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors,
  });
};

export default sendResponse;
