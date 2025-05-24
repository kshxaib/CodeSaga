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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4">
        <h2 className="text-xl font-bold">Report a Problem</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">
              Reason<span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Select a reason --</option>
              <option value="INCORRECT_TEST_CASES">Incorrect Test Cases</option>
              <option value="POOR_DESCRIPTION">Poor Description</option>
              <option value="DUPLICATE">Duplicate</option>
              <option value="INAPPROPRIATE">Inappropriate</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="Provide additional details..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmittingReport}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
