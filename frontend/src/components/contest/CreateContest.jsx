import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Trophy, Plus, X, Search } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "../../libs/axios";

const CreateContest = ({ onContestCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    problemIds: [],
  });

  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProblemSelector, setShowProblemSelector] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axiosInstance.get("/problems/get-all-problems");
      const data = response.data;
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProblemSelect = (problem) => {
    if (!selectedProblems.find((p) => p.id === problem.id)) {
      setSelectedProblems((prev) => [...prev, problem]);
      setFormData((prev) => ({
        ...prev,
        problemIds: [...prev.problemIds, problem.id],
      }));
    }
  };

  const handleProblemRemove = (problemId) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== problemId));
    setFormData((prev) => ({
      ...prev,
      problemIds: prev.problemIds.filter((id) => id !== problemId),
    }));
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-900 text-green-300";
      case "MEDIUM":
        return "bg-yellow-900 text-yellow-300";
      case "HARD":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.startTime || !formData.endTime) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.problemIds.length === 0) {
        toast.error("Please select at least one problem");
        return;
      }

      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);
      const now = new Date();

      if (startTime <= now) {
        toast.error("Start time must be in the future");
        return;
      }

      if (endTime <= startTime) {
        toast.error("End time must be after start time");
        return;
      }

      const response = await axiosInstance.post("/contests", {
        ...formData,
        maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : null
      });

      const data = response.data;

      if (data.success) {
        toast.success("Contest created successfully!");

        // Reset form
        setFormData({
          name: "",
          description: "",
          startTime: "",
          endTime: "",
          maxParticipants: "",
          problemIds: [],
        });
        setSelectedProblems([]);

        if (onContestCreated) {
          onContestCreated(data.contest);
        }
      } else {
        toast.error(data.message || "Failed to create contest");
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error("An error occurred while creating the contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="shadow-2xl rounded-xl overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl p-6"
        >
          <motion.h2 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            Create New Contest
          </motion.h2>
        </motion.div>

        <div className="p-6 bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium mb-2 text-gray-300">Contest Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter contest name"
                  required
                  className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium mb-2 text-gray-300">Max Participants</label>
                <input
                  name="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-300">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your contest..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              />
            </motion.div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Start Date & Time *
                </label>
                <input
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  End Date & Time *
                </label>
                <input
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </motion.div>
            </div>

            {/* Problem Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-300">Selected Problems *</label>

              {/* Selected Problems Display */}
              <div className="mb-4">
                {selectedProblems.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {selectedProblems.map((problem, index) => (
                        <motion.div
                          key={problem.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            delay: index * 0.05
                          }}
                        >
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                problem.difficulty === "EASY"
                                  ? "bg-green-500"
                                  : problem.difficulty === "MEDIUM"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {problem.title}
                            <button
                              type="button"
                              onClick={() => handleProblemRemove(problem.id)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No problems selected</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowProblemSelector(!showProblemSelector)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                {showProblemSelector ? "Hide" : "Add"} Problems
              </motion.button>

              <AnimatePresence>
                {showProblemSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="mt-4 border border-gray-700 rounded-lg p-4 bg-gray-900"
                  >
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                          placeholder="Search problems..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredProblems.map((problem) => (
                        <motion.div
                          key={problem.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedProblems.find((p) => p.id === problem.id)
                              ? "bg-blue-900/30 border-blue-500"
                              : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                          }`}
                          onClick={() => handleProblemSelect(problem)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">{problem.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                  {problem.difficulty}
                                </span>
                                {problem.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="px-2 py-1 rounded-full border border-gray-600 text-xs font-medium text-gray-300">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {selectedProblems.find((p) => p.id === problem.id) && (
                              <motion.div 
                                animate={{ rotate: 45 }}
                                className="text-blue-400"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating...
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Create Contest
                  </div>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateContest;