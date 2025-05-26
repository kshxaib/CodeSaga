import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, Shuffle, Loader2 } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModal from "./CreatePlaylistModal";
import AddToPlaylist from "./AddToPlaylist";
import { toast } from "sonner";

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

  const { deleteProblem, isDeletingProblem, getRandomProblem, isGettingRandomProblem } = useProblemStore();
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
      console.error('Delete error:', error);
    }
  }
};

  const handleAddtoPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setAddToPlaylistModalOpen(true);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  }

  const handleRandomProblem = async () => {
    const problem = await getRandomProblem();
    navigate(`/problem/${problem.id}`);
  }

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  return (
    <div className="min-w-screen max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-primary">Total Problems: {problems.length}</h1>
        <button 
          className="btn btn-primary gap-2 hover:shadow-md transition-shadow"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      <div className="bg-base-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Search Problems</span>
            </label>
            <input
              type="text"
              placeholder="Type to search..."
              className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Difficulty</span>
            </label>
            <select
              className="select select-bordered w-full bg-base-100"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0) + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Tags</span>
            </label>
            <select
              className="select select-bordered w-full bg-base-100"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="ALL">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <button 
            disabled={isGettingRandomProblem} 
            onClick={handleRandomProblem}
            title="Get Random Problem"
            className="mt-6 w-30 btn btn-primary gap-2 hover:shadow-md transition-shadow">{isGettingRandomProblem ? <Loader2 className="animate-spin h-4 w-4 cursor-pointer"/>: <Shuffle className="cursor-pointer"/>}</button>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="w-12">Solved</th>
                <th>Title</th>
                <th>Tags</th>
                <th className="w-32">Difficulty</th>
                <th className="w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <tr key={problem.id} className="hover:bg-base-300/50 transition-colors">
                      <td>
                        <input
                          type="checkbox"
                          checked={isSolved}
                          readOnly
                          className={`checkbox checkbox-sm ${isSolved ? 'checkbox-success' : ''}`}
                        />
                      </td>
                      <td>
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-outline badge-neutral text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge font-semibold text-xs text-white ${
                            problem.difficulty === "EASY"
                              ? "badge-success"
                              : problem.difficulty === "MEDIUM"
                              ? "badge-warning"
                              : "badge-error"
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
                                className="btn btn-square btn-sm btn-error hover:shadow-md"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              <button 
                                disabled 
                                className="btn btn-square btn-sm btn-warning hover:shadow-md"
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-outline hover:shadow-md"
                            onClick={() => handleAddtoPlaylist(problem.id)}
                            title="Save to Playlist"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400"
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
                      <p className="text-gray-500 font-medium">No problems found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProblems.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className={`join-item btn btn-sm ${currentPage === 1 ? 'btn-disabled' : ''}`}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className={`join-item btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : ''}`}
              onClick={() => setCurrentPage((prev) => prev + 1)}
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
  );
};

export default ProblemTable;