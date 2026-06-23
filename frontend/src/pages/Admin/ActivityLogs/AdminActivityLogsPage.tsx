import { useEffect, useState } from "react";
import { getAdminActivityLogs } from "../../../services/activityLogs.service";
import type {
  ActivityAction,
  ActivityLogItem,
} from "../../../types/activityLog.types";

type ActionFilter = ActivityAction | "all";

const actionLabels: Record<ActivityAction, string> = {
  create: "created",
  update: "updated",
  delete: "deleted",
  unknown: "changed",
};

const actionBadgeClassNames: Record<ActivityAction, string> = {
  create: "bg-emerald-500/15 text-emerald-300",
  update: "bg-violet-500/20 text-violet-300",
  delete: "bg-red-500/15 text-red-300",
  unknown: "bg-zinc-500/20 text-zinc-300",
};

const getReadableModuleName = (moduleName: string) => {
  const moduleLabels: Record<string, string> = {
    events: "event",
    gallery: "gallery image",
    videos: "video",
    team: "team member",
    contact: "message",
    admins: "admin",
    settings: "site settings",
    "home-content": "home content",
  };

  return moduleLabels[moduleName] || moduleName;
};

const getActivitySentence = (log: ActivityLogItem) => {
  const adminName = log.adminId?.fullName || "Unknown admin";
  const actionLabel = actionLabels[log.action];
  const itemType = log.itemType || getReadableModuleName(log.module);
  const itemTitle = log.itemTitle || log.targetId || "unknown item";

  return `${adminName} ${actionLabel} ${itemType} “${itemTitle}”`;
};

export const AdminActivityLogsPage = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAdminActivityLogs({
          page,
          limit,
        });

        setLogs(response.data);
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.totalItems);
      } catch {
        setErrorMessage("Could not load activity logs.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLogs();
  }, [page, limit]);

  const filteredLogs =
    actionFilter === "all"
      ? logs
      : logs.filter((log) => log.action === actionFilter);

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Activity Logs
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Admin Activity Logs
      </h1>

      <p className="mt-4 text-zinc-400">
        See who created, updated or deleted content in the CMS.
      </p>

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Recent activity</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <div className="grid gap-3 sm:flex sm:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-300">Action</span>
              <select
                value={actionFilter}
                onChange={(event) =>
                  setActionFilter(event.target.value as ActionFilter)
                }
                className={inputClassName}
              >
                <option value="all">All actions</option>
                <option value="create">Created</option>
                <option value="update">Updated</option>
                <option value="delete">Deleted</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-300">Per page</span>
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className={inputClassName}
              >
                <option value={10}>10 logs</option>
                <option value={20}>20 logs</option>
                <option value={50}>50 logs</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading && <p className="mt-8 text-zinc-400">Loading logs...</p>}

        {!isLoading && filteredLogs.length === 0 && (
          <p className="mt-8 text-zinc-400">No activity logs found.</p>
        )}

        {!isLoading && filteredLogs.length > 0 && (
          <div className="mt-8 grid gap-4">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log._id;

              return (
                <article
                  key={log._id}
                  className="rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-violet-400/40"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-black uppercase",
                            actionBadgeClassNames[log.action],
                          ].join(" ")}
                        >
                          {log.action}
                        </span>

                        <span className="text-sm font-bold text-zinc-500">
                          {new Date(log.createdAt).toLocaleString("de-DE")}
                        </span>
                      </div>

                      <h3 className="mt-4 break-words text-xl font-black text-white">
                        {getActivitySentence(log)}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        Admin: {log.adminId?.email || "Unknown email"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLogId(isExpanded ? null : log._id)
                      }
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                    >
                      {isExpanded ? "Hide details" : "Technical details"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                      <p>
                        <span className="font-bold text-zinc-300">Module:</span>{" "}
                        {log.module}
                      </p>
                      <p>
                        <span className="font-bold text-zinc-300">Method:</span>{" "}
                        {log.method}
                      </p>
                      <p>
                        <span className="font-bold text-zinc-300">Status:</span>{" "}
                        {log.statusCode}
                      </p>
                      <p className="break-words">
                        <span className="font-bold text-zinc-300">Path:</span>{" "}
                        {log.path}
                      </p>
                      {log.targetId && (
                        <p className="break-words">
                          <span className="font-bold text-zinc-300">
                            Target ID:
                          </span>{" "}
                          {log.targetId}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
