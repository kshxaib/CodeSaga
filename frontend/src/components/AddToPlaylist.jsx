import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { X, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddToPlaylist = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylistsOfUser, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylistsOfUser();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;
    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-[#1f1f2a] text-white rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold"
              >
                Add to Playlist
              </motion.h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-white rounded-full hover:bg-gray-700 p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="form-control space-y-1"
              >
                <label className="block text-sm font-medium text-gray-300">
                  Select Playlist
                </label>
                <select
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#2a2a3d] text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="" className="bg-[#2a2a3d] text-gray-400">
                    Select a playlist
                  </option>
                  {playlists.map(
                    (playlist) =>
                      !playlist.isPaid && (
                        <option
                          key={playlist.id}
                          value={playlist.id}
                          className="bg-[#2a2a3d] text-white"
                        >
                          {playlist.name} ({playlist.problems.length} problems)
                        </option>
                      )
                  )}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center gap-2 transition-all disabled:opacity-50"
                  disabled={!selectedPlaylist || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="cursor-pointer w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add to Playlist
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToPlaylist;