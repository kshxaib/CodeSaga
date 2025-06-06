import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Lock } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const [isPaid, setIsPaid] = useState(false);
  const { authUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    data.isPaid = isPaid;
    if (!isPaid) data.price = 0;
    await onSubmit(data);
    reset();
    setIsPaid(false);
    onClose();
  };

  const handleIsPaidToggle = () => {
    setIsPaid(!isPaid);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-white"
              >
                Create New Playlist
              </motion.h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="form-control"
              >
                <label className="label text-gray-300 font-medium">
                  Playlist Name
                </label>
                <input
                  type="text"
                  className={`input w-full bg-gray-700/50 border ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  } focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400`}
                  placeholder="Enter playlist name"
                  {...register("name", { required: "Playlist name is required" })}
                />
                {errors.name && (
                  <motion.span 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.name.message}
                  </motion.span>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="form-control"
              >
                <label className="label text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  className="textarea w-full bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400 h-24 resize-none"
                  placeholder="Enter playlist description"
                  {...register("description")}
                />
              </motion.div>

              {authUser?.role === "ADMIN" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="form-control flex flex-col"
                >
                  <label className="label text-gray-300 font-medium">
                    Paid Playlist
                  </label>
                  <label className="cursor-pointer label justify-start gap-3">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-12 h-6 transition-all duration-300 rounded-full ${
                        isPaid
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        onChange={handleIsPaidToggle}
                        checked={isPaid}
                      />
                      <motion.div
                        layout
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                          isPaid ? "left-7" : "left-1"
                        }`}
                      />
                    </motion.div>
                    <span className="label-text text-gray-300">
                      {isPaid ? (
                        <span className="flex items-center gap-1">
                          <Lock className="w-4 h-4 text-yellow-400" /> Premium Content
                        </span>
                      ) : (
                        "Free Content"
                      )}
                    </span>
                  </label>
                </motion.div>
              )}

              <AnimatePresence>
                {isPaid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="form-control"
                  >
                    <label className="label text-gray-300 font-medium">
                      Price (INR)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span>₹</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        className={`input w-full bg-gray-700/50 pl-8 border ${
                          errors.price ? 'border-red-500' : 'border-gray-600'
                        } focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400`}
                        placeholder="Enter price in INR"
                        {...register("price", {
                          required: "Price is required for paid playlists",
                          min: { value: 1, message: "Price must be greater than 0" },
                        })}
                      />
                    </div>
                    {errors.price && (
                      <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.price.message}
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="btn bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Create Playlist
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistModal;