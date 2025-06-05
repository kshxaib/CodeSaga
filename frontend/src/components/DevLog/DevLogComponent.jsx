import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useDevLogStore } from "../../store/useDevLogStore";
import { useAuthStore } from "../../store/useAuthStore";

const DevLogComponent = () => {
  const [activeTab, setActiveTab] = useState("community");
  const [activeFilter, setActiveFilter] = useState("newest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Developer Logs
            </h1>
            <p className="text-gray-400 mt-2">
              Share your development journey and learn from others
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            + Create Dev Log
          </button>
        </div>

        <div className="flex space-x-4 mb-8 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-gray-700">
          <button
            onClick={() => setActiveTab("community")}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === "community"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-inner"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab("my-logs")}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === "my-logs"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-inner"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Logs
          </button>
        </div>

        {activeTab === "community" ? (
          <DevLogList
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        ) : (
          <MyDevLogs />
        )}

        <AnimatePresence>
          {isCreateModalOpen && (
            <CreateDevLogModal onClose={() => setIsCreateModalOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CreateDevLogModal = ({ onClose }) => {
  const {
    addDevLog,
    isAdding,
    generateDescription,
    suggestions,
    isGenerating,
    clearSuggestions,
  } = useDevLogStore();
  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    description: "",
    isAnonymous: false,
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (formData.tags.length === 0) newErrors.tags = "Add at least one tag";
    if (!formData.description)
      newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addDevLog(formData);
      setFormData({
        title: "",
        tags: [],
        description: "",
        isAnonymous: false,
      });
      setErrors({});
      clearSuggestions();
      onClose();
    } catch (error) {
      console.error("Error creating dev log:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Share Your Dev Journey
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${
                    errors.title ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="What are you working on?"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags *
                </label>
                <TagsInput
                  tags={formData.tags}
                  onChange={(tags) => setFormData({ ...formData, tags })}
                  error={errors.tags}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      generateDescription(formData.title, formData.tags)
                    }
                    disabled={isGenerating}
                    className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-500 disabled:opacity-50 transition-all"
                  >
                    {isGenerating ? "Generating..." : "AI Suggestions"}
                  </button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${
                    errors.description ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Share your experience, challenges, or insights..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>

              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gray-700/50 rounded-lg p-4 space-y-3 border border-gray-600"
                >
                  <h4 className="text-sm font-medium text-gray-300">
                    AI Suggestions:
                  </h4>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setFormData({ ...formData, description: suggestion });
                          clearSuggestions();
                        }}
                        className="p-3 bg-gray-700 border border-gray-600 rounded-md cursor-pointer hover:bg-blue-900/20 hover:border-blue-500/30 transition-all"
                      >
                        <p className="text-gray-200">{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800/90 backdrop-blur-sm flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isAdding}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isAdding ? "Posting..." : "Share Dev Log"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DevLogList = ({ activeFilter, setActiveFilter }) => {
  const { devLogs, loading, error, fetchDevLogs } = useDevLogStore();

  useEffect(() => {
    fetchDevLogs(activeFilter);
  }, [activeFilter, fetchDevLogs]);

  const filters = [
    { id: "newest", name: "Latest" },
    { id: "upvoted", name: "Most Upvoted" },
    { id: "trending", name: "Trending" },
  ];

  return (
    <div className="space-y-6">
      <FilterTabs
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && devLogs.length === 0 ? (
        <EmptyState
          title="No DevLogs found"
          description="Be the first to share your development journey!"
        />
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          <AnimatePresence>
            {devLogs.map((devLog) => (
              <DevLogCard key={devLog.id} devLog={devLog} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const MyDevLogs = () => {
  const { myDevLogs, loading, error, fetchMyDevLogs } = useDevLogStore();

  useEffect(() => {
    fetchMyDevLogs();
  }, [fetchMyDevLogs]);

  return (
    <div className="space-y-6">
      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && myDevLogs.length === 0 ? (
        <EmptyState
          title="No DevLogs yet"
          description="Share your first development experience!"
        />
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          <AnimatePresence>
            {myDevLogs.map((devLog) => (
              <DevLogCard key={devLog.id} devLog={devLog} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const DevLogCard = ({ devLog }) => {
  const { reactToDevLog } = useDevLogStore();
  const { authUser } = useAuthStore();

  const reactionTypes = [
    { type: "helpful", emoji: "❤️", label: "Helpful" },
    { type: "fun", emoji: "😂", label: "Fun" },
    { type: "insightful", emoji: "💡", label: "Insightful" },
  ];

  const getReactionCount = (type) => {
    return devLog.reactions?.filter((r) => r.type === type).length || 0;
  };

  const hasUserReacted = (type) => {
    return devLog.reactions?.some(
      (r) => r.type === type && r.userId === authUser?.id
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500/50 hover:shadow-xl transition-all"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left: Avatar + Info */}
          <div className="flex items-center space-x-3">
            <UserAvatar user={devLog.user} isAnonymous={devLog.isAnonymous} />
            <div>
              <h3 className="font-semibold text-gray-100">
                {devLog.isAnonymous
                  ? "Anonymous Developer"
                  : devLog.user?.name || "Unknown"}
              </h3>

              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(devLog.createdAt), {
                    addSuffix: true,
                  })}
                </p>

                {/* Role badge */}
                {devLog.user?.role && (
                  <span
                    className={`
              px-2 py-0.5 text-xs font-medium rounded
              ${
                devLog.user.role === "ADMIN"
                  ? "bg-red-600 text-white"
                  : devLog.user.role === "PRO"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }
            `}
                  >
                    {devLog.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Tags */}
          {devLog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {devLog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">{devLog.title}</h2>
          <p className="text-gray-300 whitespace-pre-line">
            {devLog.description}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div className="flex space-x-2">
            {reactionTypes.map(({ type, emoji, label }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => reactToDevLog(devLog.id, type)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                  hasUserReacted(type)
                    ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50"
                } transition-all`}
                aria-label={label}
              >
                <span>{emoji}</span>
                <span>{getReactionCount(type)}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-1 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="text-sm">
              {devLog._count?.comments || 0} comments
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FilterTabs = ({ filters, activeFilter, setActiveFilter }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === filter.id
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {filter.name}
        </motion.button>
      ))}
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

const EmptyState = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
    >
      <div className="mx-auto h-24 w-24 text-gray-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-1">{title}</h3>
      <p className="text-gray-400 max-w-md mx-auto">{description}</p>
    </motion.div>
  );
};

const UserAvatar = ({ user, isAnonymous, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  if (isAnonymous) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600`}
      >
        <span>👤</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
    >
      {user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
};

const TagsInput = ({ tags, onChange, error }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div
        className={`flex flex-wrap items-center gap-2 p-2 border rounded-lg ${
          error ? "border-red-500" : "border-gray-600"
        } bg-gray-700`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1.5 inline-flex text-blue-300 hover:text-blue-100"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
              onChange([...tags, newTag]);
              setInputValue("");
            }
          }}
          placeholder="Add tags..."
          className="flex-1 min-w-[100px] border-none focus:ring-0 p-0 text-sm bg-transparent text-white placeholder-gray-500"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default DevLogComponent;
