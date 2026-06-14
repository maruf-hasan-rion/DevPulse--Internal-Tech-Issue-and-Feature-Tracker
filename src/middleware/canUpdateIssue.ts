import type { NextFunction, Request, Response } from "express";
import { sql } from "../db";
import sendResponse from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const canUpdateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = req.params.id;
    const user = req.user;

    if (!user) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access",
      });
    }

    const targetIssue = await sql`
      SELECT reporter_id, status FROM issues WHERE id = ${issueId}
    `;

    if (targetIssue.length === 0) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found",
      });
    }

    const issue = targetIssue[0]!;

    if (user.role === "maintainer") {
      return next();
    }

    if (user.role === "contributor") {
      if (Number(issue.reporter_id) !== Number(user.id)) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: "Forbidden! You can only update your own issues",
        });
      }

      if (issue.status !== "open") {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message:
            "Forbidden! You cannot update an issue that is no longer open",
        });
      }

      return next();
    }

    return sendResponse(res, {
      statusCode: StatusCodes.FORBIDDEN,
      success: false,
      message: "Forbidden! Role invalid for this action",
    });
  } catch (error) {
    next(error);
  }
};
