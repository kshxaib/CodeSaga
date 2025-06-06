import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Trophy, Play, CheckCircle, Timer, Filter, Search, TrendingUp, Lock } from "lucide-react";
import { axiosInstance } from "../../libs/axios";
import { toast } from "sonner";
import moment from "moment";

const ContestList = ({ onContestSelect }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchContests();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/contests");
      const data = response.data;

      if (data.success) {
        setContests(data.contests);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      toast.error("Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  };

  const getContestStatus = (contest) => {
    const now = currentTime;
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "COMPLETED";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-900/20 text-blue-400 border border-blue-500/30";
      case "LIVE":
        return "bg-green-900/20 text-green-400 border border-green-500/30";
      case "COMPLETED":
        return "bg-gray-800/20 text-gray-400 border border-gray-500/30";
      default:
        return "bg-gray-800/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "UPCOMING":
        return <Timer className="w-4 h-4" />;
      case "LIVE":
        return <Play className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Timer className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (startTime) => {
    const now = currentTime;
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const status = getContestStatus(contest);
    return matchesSearch && status === statusFilter;
  });

  const handleRegister = async (contestId) => {
    try {
      const response = await axiosInstance.post(`/contests/${contestId}/register`);
      const data = response.data;

      if (data.success) {
        toast.success("Successfully registered for contest!");
        fetchContests(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("An error occurred while registering");
    }
  };

  if (loading) {
    return (
      <div className="min-w-screen flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Contests
        </h1>
        <p className="text-gray-400">Compete with other developers and showcase your skills</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            placeholder="Search contests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 w-full text-left text-gray-200"
          >
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <span className="flex-1">
              {statusFilter === "all" && "All Contests"}
              {statusFilter === "UPCOMING" && "Upcoming"}
              {statusFilter === "LIVE" && "Live"}
              {statusFilter === "COMPLETED" && "Completed"}
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md py-1 border border-gray-700">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
              >
                All Contests
              </button>
              <button
                onClick={() => {
                  setStatusFilter("UPCOMING");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
              >
                Upcoming
              </button>
              <button
                onClick={() => {
                  setStatusFilter("LIVE");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
              >
                Live
              </button>
              <button
                onClick={() => {
                  setStatusFilter("COMPLETED");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
              >
                Completed
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contest Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest, index) => {
            const status = getContestStatus(contest);
            const timeRemaining = getTimeRemaining(contest.startTime);

            return (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-full bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-100 line-clamp-2">{contest.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        {status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-3 mt-2">{contest.description}</p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {/* Contest Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="truncate">{formatDateTime(contest.startTime)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>
                            {contest.participantCount || 0}
                            {contest.maxParticipants && ` / ${contest.maxParticipants}`}
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span>
                          Duration:{" "}
                          {Math.round((new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60 * 60))}h
                        </span>
                      </div>

                      {/* Problems */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Problems:</span>
                        <div className="flex gap-1">
                          {contest.problems.slice(0, 3).map((cp) => (
                            <span
                              key={cp.id}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                cp.problem.difficulty === "EASY"
                                  ? "bg-green-900/20 text-green-400 border border-green-500/30"
                                  : cp.problem.difficulty === "MEDIUM"
                                    ? "bg-yellow-900/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-900/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {cp.problem.difficulty.charAt(0)}
                            </span>
                          ))}
                          {contest.problems.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/30">
                              +{contest.problems.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Premium Badge */}
                      {contest.isPremium && (
                        <div className="flex justify-end">
                          <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                            <Lock className="w-3 h-3" /> PREMIUM
                          </span>
                        </div>
                      )}

                      {/* Time Remaining */}
                      {status === "UPCOMING" && timeRemaining && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-blue-900/20 p-2 rounded-lg border border-blue-500/30"
                        >
                          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                            <Timer className="w-4 h-4" />
                            Starts in {timeRemaining}
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onContestSelect && onContestSelect(contest)}
                          className="flex-1 inline-flex items-center px-3 py-1.5 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <TrendingUp className="w-4 h-4 mr-1 text-purple-400" />
                          View Details
                        </button>

                        {status === "UPCOMING" && !contest.isRegistered && (
                          <button
                            onClick={() => handleRegister(contest.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            Register
                          </button>
                        )}

                        {status === "LIVE" && contest.isRegistered && (
                          <button
                            onClick={() => onContestSelect && onContestSelect(contest)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {filteredContests.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-12"
        >
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">No contests found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No contests available at the moment"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContestList;