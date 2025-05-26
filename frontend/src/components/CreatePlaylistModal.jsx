import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Create New Playlist</h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <div className="form-control">
            <label className="label text-gray-300 font-medium">
              Playlist Name
            </label>
            <input
              type="text"
              className={`input w-full bg-gray-700/50 border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400`}
              placeholder="Enter playlist name"
              {...register("name", { required: "Playlist name is required" })}
            />
            {errors.name && (
              <span className="text-red-400 text-sm mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label text-gray-300 font-medium">
              Description
            </label>
            <textarea
              className="textarea w-full bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400 h-24 resize-none"
              placeholder="Enter playlist description"
              {...register("description")}
            />
          </div>

          {authUser?.role === "ADMIN" && (
            <div className="form-control flex flex-col">
              <label className="label text-gray-300 font-medium">
                Paid Playlist
              </label>
              <label className="cursor-pointer label justify-start gap-3">
                <div
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
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                      isPaid ? "left-7" : "left-1"
                    }`}
                  ></div>
                </div>
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
            </div>
          )}

          {isPaid && (
            <div className="form-control">
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
                  className={`input w-full bg-gray-700/50 pl-8 border ${errors.price ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-400`}
                  placeholder="Enter price in INR"
                  {...register("price", {
                    required: "Price is required for paid playlists",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
              </div>
              {errors.price && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;