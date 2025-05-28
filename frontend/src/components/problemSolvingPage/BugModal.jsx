import React, { useState } from "react";
import { useReportStore } from "../../store/useReportStore";

const BugModal = ({ isOpen, onClose, problemId }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { submitReport, isSubmittingReport } = useReportStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !problemId) {
      setError("Please select a reason and ensure a valid problem ID.");
      return;
    }

    await submitReport(problemId, reason, description);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center bg-opacity-50 px-4 z-50">
      <div className="bg-gray-850 rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4 border border-purple-500/30">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Report a Problem
        </h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-300">
              Reason<span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="" className="bg-gray-800">-- Select a reason --</option>
              <option value="INCORRECT_TEST_CASES" className="bg-gray-800">Incorrect Test Cases</option>
              <option value="POOR_DESCRIPTION" className="bg-gray-800">Poor Description</option>
              <option value="DUPLICATE" className="bg-gray-800">Duplicate</option>
              <option value="INAPPROPRIATE" className="bg-gray-800">Inappropriate</option>
              <option value="OTHER" className="bg-gray-800">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-300">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Provide additional details..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost text-gray-300 hover:text-purple-400"
              onClick={onClose}
              disabled={isSubmittingReport}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-gray-100"
              disabled={isSubmittingReport}
            >
              {isSubmittingReport ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugModal;