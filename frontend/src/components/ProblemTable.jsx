import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  Shuffle,
  Loader2,
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModal from "./CreatePlaylistModal";
import AddToPlaylist from "./AddToPlaylist";
import moment from "moment";

const ProblemTable = ({ problems }) => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [expandedProblemId, setExpandedProblemId] = useState(null);

  const {
    deleteProblem,
    isDeletingProblem,
    getRandomProblem,
    isGettingRandomProblem,
  } = useProblemStore();
  const { authUser } = useAuthStore();
  const { createPlaylist } = usePlaylistStore();

  const navigate = useNavigate();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((prob) => prob.tags?.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return filteredProblems.slice(startIndex, endIndex);
  }, [currentPage, filteredProblems]);

  const handleDeleteClick = (id) => {
    setProblemToDelete(id);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (problemToDelete) {
      try {
        await deleteProblem(problemToDelete);
        setIsOpen(false);
        setProblemToDelete(null);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleAddtoPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setAddToPlaylistModalOpen(true);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleRandomProblem = async () => {
    const problem = await getRandomProblem();
    navigate(`/problem/${problem.id}`);
  };

  const toggleProblemDetails = (problemId) => {
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          
          <div>
            <h1 className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Problem Library
            </h1>
            <p className="text-gray-400 mt-1">
              Total Problems: {problems.length} • {filteredProblems.length} filtered
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create Playlist</span>
            </button>
            <button
              disabled={isGettingRandomProblem}
              onClick={handleRandomProblem}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              {isGettingRandomProblem ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Shuffle className="w-5 h-5" />
              )}
              <span className="font-medium">Random</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-medium">
                  Search Problems
                </span>
              </label>
              <input
                type="text"
                placeholder="Type to search..."
                className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-medium">
                  Difficulty
                </span>
              </label>
              <select
                className="select bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-gray-300"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="ALL" className="bg-gray-800">
                  All Difficulties
                </option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className="bg-gray-800">
                    {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-medium">
                  Tags
                </span>
              </label>
              <select
                className="select bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-gray-300"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="ALL" className="bg-gray-800">
                  All Tags
                </option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag} className="bg-gray-800">
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control flex justify-end">
              <label className="label invisible">
                <span className="label-text">Actions</span>
              </label>
              <button
                onClick={() => {
                  setSearch("");
                  setDifficulty("ALL");
                  setSelectedTag("ALL");
                }}
                className="btn bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-700/50 text-gray-100">
                <tr>
                  <th className="w-12">Solved</th>
                  <th>Title</th>
                  <th>Tags</th>
                  <th className="w-32">Difficulty</th>
                  <th className="w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {paginatedProblems.length > 0 ? (
                  paginatedProblems.map((problem) => {
                    const isSolved = problem.solvedBy?.some(
                      (user) => user.userId === authUser?.id
                    );
                    const isExpanded = expandedProblemId === problem.id;

                    return (
                      <>
                        <tr
                          key={problem.id}
                          className="hover:bg-gray-700/30 transition-colors"
                        >
                          <td>
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center ${
                                isSolved
                                  ? "bg-green-500/20 border border-green-500"
                                  : "bg-gray-700/50 border border-gray-600"
                              }`}
                            >
                              {isSolved && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 text-green-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <Link
                                to={`/problem/${problem.id}`}
                                className="font-semibold hover:text-blue-400 transition-colors"
                              >
                                {problem.title}
                              </Link>
                              {problem.isPaid && (
                                <span className="inline-flex items-center gap-1 mt-1 text-xs text-yellow-400">
                                  <Lock className="w-3 h-3" /> Premium Problem
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {(problem.tags || []).slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {problem.tags?.length > 3 && (
                                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs">
                                  +{problem.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                problem.difficulty === "EASY"
                                  ? "bg-green-500/20 text-green-400"
                                  : problem.difficulty === "MEDIUM"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {authUser?.role === "ADMIN" && (
                                <>
                                  <button
                                    onClick={() => handleDeleteClick(problem.id)}
                                    className="btn-sm btn-error hover:shadow-md text-red-400 hover:text-red-300"
                                    title="Delete"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    disabled
                                    className="btn btn-square btn-sm btn-warning hover:shadow-md text-yellow-400 hover:text-yellow-300"
                                    title="Edit"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                className="btn btn-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:shadow-md"
                                onClick={() => handleAddtoPlaylist(problem.id)}
                                title="Save to Playlist"
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleProblemDetails(problem.id)}
                                className="btn btn-sm bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                                title={isExpanded ? "Hide details" : "Show details"}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-900/20">
                            <td colSpan={5} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                                    DESCRIPTION
                                  </h3>
                                  <p className="text-gray-300 text-sm">
                                    {problem.description || "No description available."}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                                    DETAILS
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-400">
                                      <span className="block">Created:</span>
                                      <span className="text-gray-300">
                                        {moment(problem.createdAt).format("MMM D, YYYY")}
                                      </span>
                                    </div>
                                    <div className="text-gray-400">
                                      <span className="block">Updated:</span>
                                      <span className="text-gray-300">
                                        {moment(problem.updatedAt).format("MMM D, YYYY")}
                                      </span>
                                    </div>
                                    {problem.askedIn?.length > 0 && (
                                      <div className="col-span-2 text-gray-400">
                                        <span className="block">Asked in:</span>
                                        <span className="text-gray-300">
                                          {problem.askedIn.join(", ")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-500"
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
                        <p className="text-gray-400 font-medium">
                          No problems found matching your criteria
                        </p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setDifficulty("ALL");
                            setSelectedTag("ALL");
                          }}
                          className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProblems.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of{" "}
              {filteredProblems.length} problems
            </div>
            <div className="join bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600">
              <button
                className={`join-item px-4 py-2 ${
                  currentPage === 1
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
                }`}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button className="join-item px-4 py-2 bg-gray-700/50 text-gray-300">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className={`join-item px-4 py-2 ${
                  currentPage === totalPages
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
                }`}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}

        <CreatePlaylistModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePlaylist}
        />

        <ConfirmationDialog
          loading={isDeletingProblem}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete Problem"
          content="Are you sure you want to delete this problem? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
        />

        <AddToPlaylist
          isOpen={addToPlaylistModalOpen}
          onClose={() => setAddToPlaylistModalOpen(false)}
          problemId={selectedProblemId}
        />
      </div>
    </div>
  );
};

export default ProblemTable;