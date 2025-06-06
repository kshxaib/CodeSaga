import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Lock,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  TrashIcon,
  X,
  Loader,
} from "lucide-react";
import moment from "moment";
import ConfirmationDialog from "./ConfirmationDialog";
import CreatePlaylistModal from "./CreatePlaylistModal";

const MyPlaylists = () => {
  const {
    playlists,
    getAllPlaylistsOfUser,
    deletePlaylist,
    removeProblemFromPlaylist,
  } = usePlaylistStore();
  const { authUser } = useAuthStore();
  const { createPlaylist } = usePlaylistStore();
  const [viewingPlaylistId, setViewingPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isDeletingPlaylist, setIsDeletingPlaylist] = useState(false);
  const [isRemovingProblem, setIsRemovingProblem] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        await getAllPlaylistsOfUser();
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleDeleteClickPlaylist = (playlistId) => {
    setPlaylistToDelete(playlistId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeletePlaylist = async () => {
    if (!playlistToDelete) return;

    setIsDeletingPlaylist(true);
    await deletePlaylist(playlistToDelete);
    setIsDeletingPlaylist(false);
    setIsDeleteDialogOpen(false);
    setPlaylistToDelete(null);
  };

  const handleRemoveProblemFromPlaylist = async (playlistId, problemId) => {
    setIsRemovingProblem(true);
    await removeProblemFromPlaylist(playlistId, problemId);
    setIsRemovingProblem(false);
  };

  const toggleViewProblems = (playlistId) => {
    setViewingPlaylistId((prevId) =>
      prevId === playlistId ? null : playlistId
    );
  };

  const getSolvedCount = (playlist) => {
    if (!playlist.problems || !authUser) return 0;
    return playlist.problems.reduce((count, entry) => {
      const isSolved = entry.problem?.solvedBy?.some(
        (user) => user.userId === authUser.id
      );
      return isSolved ? count + 1 : count;
    }, 0);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (a.isPaid && !b.isPaid) return 1;
    if (!a.isPaid && b.isPaid) return -1;
    return 0;
  });

  if (isLoading || playlists === undefined) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              My Playlists
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and organize your problem-solving journey
            </p>
            <p className="text-gray-400 mt-2">
              Total Playlists:{" "}
              <span className="font-semibold text-blue-400">
                {playlists.length}
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Playlist</span>
          </button>
        </div>

        {sortedPlaylists.length > 0 ? (
          <div className="grid gap-6">
            {sortedPlaylists.map((playlist) => {
              const isOwner = playlist.userId === authUser?.id;
              const isViewing = viewingPlaylistId === playlist.id;
              const isPaid = playlist.isPaid;
              const totalProblems = playlist.problems?.length || 0;
              const solvedCount = getSolvedCount(playlist);
              const completionPercentage =
                totalProblems > 0
                  ? Math.round((solvedCount / totalProblems) * 100)
                  : 0;

              return (
                <div
                  key={playlist.id}
                  className={`bg-gray-800/80 backdrop-blur-sm border ${
                    isPaid ? "border-yellow-500/30" : "border-gray-700"
                  } rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-gray-100">
                            {playlist.name}
                          </h2>
                          {isPaid && (
                            <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                              <Lock className="w-3 h-3" /> PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mt-2">
                          {playlist.description || "No description provided."}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="font-medium text-blue-400">
                              {totalProblems}
                            </span>
                            <span>problems</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="font-medium text-green-400">
                              {solvedCount} solved
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="font-medium text-purple-400">
                              {completionPercentage}% complete
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="font-medium text-purple-400">
                              {playlist.isPaid && authUser?.role !== "ADMIN"
                                ? `Purchased on ${moment(
                                    playlist.purchaseDate
                                  ).format("MMM D, YYYY, h:mm A")}`
                                : `Created on ${moment(
                                    playlist.createdAt
                                  ).format("MMM D, YYYY, h:mm A")}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => toggleViewProblems(playlist.id)}
                          className="cursor-pointer flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          {isViewing ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide Problems
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              View Problems
                            </>
                          )}
                        </button>
                        {isOwner && !isPaid && (
                          <button
                            onClick={() =>
                              handleDeleteClickPlaylist(playlist.id)
                            }
                            className="cursor-pointer flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isViewing && (
                    <div className="border-t border-gray-700/50 bg-gray-900/30 px-6 py-4">
                      <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          <span className="font-medium text-green-400">
                            {solvedCount}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium text-blue-400">
                            {totalProblems}
                          </span>{" "}
                          problems solved
                        </div>
                        <div className="text-sm text-gray-400">
                          Completion:{" "}
                          <span className="font-medium text-purple-400">
                            {completionPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto rounded-lg">
                        <table className="w-full text-sm text-left text-gray-300">
                          <thead className="bg-gray-700/50 text-gray-100">
                            <tr>
                              <th className="px-4 py-3 font-medium">Status</th>
                              <th className="px-4 py-3 font-medium">Title</th>
                              <th className="px-4 py-3 font-medium">Tags</th>
                              <th className="px-4 py-3 font-medium">
                                Difficulty
                              </th>
                              <th className="px-4 py-3 font-medium text-right">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700/50">
                            {playlist.problems?.length > 0 ? (
                              playlist.problems.map((entry, index) => {
                                const problem = entry.problem;
                                const isSolved =
                                  problem?.solvedBy?.some(
                                    (user) => user.userId === authUser?.id
                                  ) || false;

                                return (
                                  <tr
                                    key={index}
                                    className="hover:bg-gray-700/30 transition-colors"
                                  >
                                    <td className="px-4 py-3">
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
                                    <td className="px-4 py-3 font-medium">
                                      <Link
                                        to={`/problem/${problem.id}`}
                                        className="hover:text-blue-400 transition-colors"
                                      >
                                        {problem.title}
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex flex-wrap gap-1">
                                        {problem.tags?.map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
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
                                    <td className="px-4 py-3 text-right flex items-center gap-2 justify-center">
                                      {!isPaid && isOwner && (
                                        <button
                                          disabled={isRemovingProblem}
                                          onClick={() =>
                                            handleRemoveProblemFromPlaylist(
                                              playlist.id,
                                              problem.id
                                            )
                                          }
                                          className="btn btn-square btn-sm bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-red-300 transition-colors"
                                          title="Remove from playlist"
                                        >
                                          {isRemovingProblem ? (
                                            <Loader />
                                          ) : (
                                            <X className="w-4 h-4" />
                                          )}
                                        </button>
                                      )}
                                      <Link
                                        to={`/problem/${problem.id}`}
                                        className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm hover:bg-blue-600/30 transition-colors"
                                      >
                                        Solve
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 py-6 text-center text-gray-500"
                                >
                                  No problems in this playlist yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl  border border-gray-700 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-700 rounded-full">
                <Plus
                  onClick={() => setIsCreateModalOpen(true)}
                  className="cursor-pointer w-8 h-8 text-gray-400"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">
                No playlists yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first playlist to organize problems and track your
                progress
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Playlist"
        content="Are you sure you want to delete this playlist? This action cannot be undone."
        confirmText={isDeletingPlaylist ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleConfirmDeletePlaylist}
        loading={isDeletingPlaylist}
      />

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
};

export default MyPlaylists;
