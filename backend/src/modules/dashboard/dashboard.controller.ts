import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service";

export const getDashboardStatsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const stats = await getDashboardStats();

  response.status(200).json({
    success: true,
    data: stats,
  });
};
