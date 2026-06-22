import { ActivityLog } from "../../database/models/ActivityLog";

interface GetActivityLogsOptions {
  page: number;
  limit: number;
}

export const getActivityLogs = async ({
  page,
  limit,
}: GetActivityLogsOptions) => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [logs, totalItems] = await Promise.all([
    ActivityLog.find()
      .populate("adminId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    ActivityLog.countDocuments(),
  ]);

  return {
    items: logs,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};
