import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useReportStore } from "../../store/useReportStore";
import ConfirmationDialog from "../ConfirmationDialog";

const ReportTable = () => {
  const { reports, isGettingReports, getAllReports, updateReportStatus, deleteReport } = useReportStore();
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden px-6 py-6 space-y-6 border border-gray-700/50"
    >
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Total Reports: {reports.length}
        </motion.h2>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-medium text-gray-300">Filter by Status:</label>
          <select
            className="select select-bordered select-sm w-48 bg-gray-800/50 border-gray-700 text-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="ALL" className="bg-gray-800">All Statuses</option>
            <option value="PENDING" className="bg-gray-800">Pending Only</option>
            <option value="RESOLVED" className="bg-gray-800">Resolved Only</option>
            <option value="IGNORED" className="bg-gray-800">Ignored Only</option>
          </select>
        </motion.div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-gray-300">Title</th>
              <th className="text-gray-300">Reported By</th>
              <th className="text-gray-300">Reason</th>
              <th className="text-gray-300">Description</th>
              <th className="text-gray-300">Status</th>
              <th className="text-gray-300">Reported At</th>
              <th className="text-gray-300 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isGettingReports ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </motion.div>
                  </div>
                </td>
              </tr>
            ) : paginatedReports.length > 0 ? (
              <AnimatePresence>
                {paginatedReports.map((report) => (
                  <motion.tr 
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-800/30 transition-colors border-b border-gray-700/50"
                  >
                    <td className="font-medium text-gray-100">{report.problem?.title || "Unknown"}</td>
                    <td className="text-gray-300">{report.user?.username || "Unknown"}</td>
                    <td>
                      <span className="badge badge-outline bg-blue-900/30 text-blue-400 border-blue-700/50 text-xs">
                        {report.reason}
                      </span>
                    </td>
                    <td 
                      className="max-w-xs truncate text-gray-400" 
                      title={report.description || "—"}
                    >
                      {report.description || "—"}
                    </td>
                    <td>
                      <motion.select
                        whileHover={{ scale: 1.03 }}
                        whileFocus={{ scale: 1.03 }}
                        className={`select select-sm ${
                          report.status === "PENDING"
                            ? "bg-yellow-900/30 text-yellow-400 border-yellow-700/50"
                            : report.status === "RESOLVED"
                            ? "bg-green-900/30 text-green-400 border-green-700/50"
                            : "bg-gray-800/30 text-gray-400 border-gray-700/50"
                        }`}
                        value={report.status}
                        onChange={(e) => handleReportStatus(report.id, e.target.value)}
                      >
                        <option value="PENDING" className="bg-gray-800">PENDING</option>
                        <option value="RESOLVED" className="bg-gray-800">RESOLVED</option>
                        <option value="IGNORED" className="bg-gray-800">IGNORED</option>
                      </motion.select>
                    </td>
                    <td className="text-sm text-gray-400">
                      {report.createdAt ? new Date(report.createdAt).toLocaleString() : "—"}
                    </td>
                    <td>
                      <div className="flex">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(report.id)}
                          className="btn btn-square btn-sm bg-red-900/30 hover:bg-red-900/50 border-red-700/50 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <motion.p 
                    className="text-gray-500 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No reports found
                  </motion.p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="join">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`join-item btn btn-sm bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 ${
                currentPage === 1 ? "btn-disabled opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              «
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="join-item btn btn-sm bg-gray-800/50 border-gray-700/50 text-gray-300"
            >
              Page {currentPage} of {totalPages}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`join-item btn btn-sm bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 ${
                currentPage === totalPages ? "btn-disabled opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              »
            </motion.button>
          </div>
        </motion.div>
      )}

      <ConfirmationDialog 
        loading={isDeleting}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Report"
        content="Are you sure you want to delete this report? This action cannot be undone."
        onConfirm={onSubmit}
      />
    </motion.div>
  );
};

export default ReportTable;