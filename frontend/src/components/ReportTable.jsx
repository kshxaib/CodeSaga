import React, { useEffect, useMemo, useState } from "react";
import { Loader, TrashIcon } from "lucide-react";
import { useReportStore } from "../store/useReportStore";
import ConfirmationDialog from "./ConfirmationDialog";

const ReportTable = () => {
  const { reports, isGettingReports, getAllReports, updateReportStatus, deleteReport} = useReportStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 10;
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    getAllReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (statusFilter === "ALL") return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredReports.slice(start, end);
  }, [filteredReports, currentPage]);

  const handleDelete = (id) => {
  setSelectedReportId(id);
  setIsOpen(true);
};

  const onSubmit = async () => {
  if (!selectedReportId) return;
  setIsDeleting(true);
  await deleteReport(selectedReportId);
  setIsDeleting(false);
  setIsOpen(false);
  setSelectedReportId(null);
};

  const handleReportStatus = async (reportId, status) => {
    await updateReportStatus(reportId, status);
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-md overflow-hidden px-6 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Total Reports: {reports.length}</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter by Status:</label>
          <select
            className="select select-bordered select-sm w-48"
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="IGNORED">Ignored Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Title</th>
              <th>Reported By</th>
              <th>Reason</th>
              <th>Description</th>
              <th>Status</th>
              <th>Reported At</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isGettingReports ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center py-6">
                    <Loader className="animate-spin w-6 h-6 text-gray-500" />
                  </div>
                </td>
              </tr>
            ) : paginatedReports.length > 0 ? (
              paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-base-300/50 transition-colors">
                  <td className="font-medium">{report.problem?.title || "Unknown"}</td>
                  <td>{report.user?.username || "Unknown"}</td>
                  <td>
                    <span className="badge badge-outline badge-info text-xs">
                      {report.reason}
                    </span>
                  </td>
                  <td className="max-w-xs truncate" title={report.description || "—"}>
                    {report.description || "—"}
                  </td>
                  <td>
                    <select
                      className={`select select-sm ${
                        report.status === "PENDING"
                          ? "select-warning"
                          : report.status === "RESOLVED"
                          ? "select-success"
                          : "select-neutral"
                      }`}
                      value={report.status}
                      onChange={(e) => handleReportStatus(report.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="IGNORED">IGNORED</option>
                    </select>
                  </td>
                  <td className="text-sm text-gray-500">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString() : "—"}
                  </td>
                  <td>
                    <div className="flex">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn btn-square btn-sm btn-error"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <p className="text-gray-500 font-medium">No reports found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            className={`join-item btn btn-sm ${currentPage === 1 ? "btn-disabled" : ""}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            «
          </button>
          <button className="join-item btn btn-sm">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className={`join-item btn btn-sm ${
              currentPage === totalPages ? "btn-disabled" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            »
          </button>
        </div>
      </div>

      <ConfirmationDialog 
        loading={isDeleting}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Report"
        content="Are you sure you want to delete this report? This action cannot be undone."
        onConfirm={onSubmit}
      />
    </div>
  );
};

export default ReportTable;
