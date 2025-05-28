import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import ProblemTable from "./ProblemTable";

const AllProblemsPage = () => {
  const { getAllProblems, problems, isLoading } = useProblemStore();
  
  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);
  
  if (isLoading) {
    return (
      <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
        <p className="mt-4 text-lg text-gray-400">Loading problems...</p>
      </div>
    );
  } 

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {problems.length > 0 ? (
        <ProblemTable problems={problems} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="max-w-md mx-auto text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-200 mb-2">
              No Problems Found
            </h3>
            <p className="text-gray-400 mb-6">
              It looks like there are no problems available yet. Please check back later.
            </p>
            <button
              onClick={() => getAllProblems()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Loader2 className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProblemsPage;