import { Request, Response } from "express";
import { getActivityLogs } from "./activityLogs.service";

export const getActivityLogsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 20);

  const result = await getActivityLogs({
    page,
    limit,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};
