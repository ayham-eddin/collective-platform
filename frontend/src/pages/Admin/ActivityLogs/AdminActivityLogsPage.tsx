import { useEffect, useState } from "react";
import { getAdminActivityLogs } from "../../../services/activityLogs.service";
import type { ActivityLogItem } from "../../../types/activityLog.types";

export const AdminActivityLogsPage = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Activity Logs
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Admin Activity Logs
      </h1>

      <p className="mt-4 text-zinc-400">
        Track admin create, update and delete actions across the CMS.
      </p>

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Logs</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

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

        {isLoading && <p className="mt-8 text-zinc-400">Loading logs...</p>}

        {!isLoading && logs.length === 0 && (
          <p className="mt-8 text-zinc-400">No activity logs found.</p>
        )}

        {!isLoading && logs.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead className="bg-white/[0.04] text-left text-sm text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Admin</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Path</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {logs.map((log) => (
                    <tr key={log._id} className="transition hover:bg-white/5">
                      <td className="px-6 py-5 text-sm text-zinc-300">
                        {new Date(log.createdAt).toLocaleString("de-DE")}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-bold text-white">
                          {log.adminId?.fullName || "Unknown admin"}
                        </p>
                        {log.adminId?.email && (
                          <p className="mt-1 text-xs text-zinc-500">
                            {log.adminId.email}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-zinc-300">{log.module}</td>

                      <td className="px-6 py-5 text-zinc-300">{log.method}</td>

                      <td className="px-6 py-5 text-zinc-300">
                        {log.statusCode}
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {log.path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
