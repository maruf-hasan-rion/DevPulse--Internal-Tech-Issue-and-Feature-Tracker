import type { NextFunction, Request, Response } from "express";
import type { ICreateIssue } from "./issue.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { issueService } from "./issue.service";

export const createIssueInDB = async (req: Request, res: Response) => {
  try {
    const reporterId = Number(req.user?.id);
    const issuePayload: ICreateIssue = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
    };

    const issue = await issueService.createIssueInDB(issuePayload, reporterId);
    if (!issue) {
      throw new Error("Issue creation failed");
    }
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
      data: issue,
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

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await issueService.getAllIssues({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Issue id is required",
      });
    }

    const issue = await issueService.getIssueById(id);
    if (!issue) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};
const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Issue id is required",
      });
    }

    const updatedIssue = await issueService.updateIssue(id, req.body);
    if (!updatedIssue) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Issue id is required",
      });
    }

    const isDeleted = await issueService.deleteIssue(id);
    if (!isDeleted) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssueInDB,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
