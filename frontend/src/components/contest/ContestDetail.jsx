import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Play,
  CheckCircle,
  Timer,
  ArrowLeft,
  Code,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import ContestLeaderboard from "./ContestLeaderboard";
import ContestStats from "./ContestStats";
import { axiosInstance } from "../../libs/axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

const ContestDetail = ({ contestId, onBack }) => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (contestId) {
      fetchContestDetail();
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
    }
  }, [contestId]);

  const fetchContestDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/contests/${contestId}`);
      const data = response.data;
      if (data.success) setContest(data.contest);
    } catch (error) {
      console.error("Error fetching contest:", error);
      toast.error("Failed to fetch contest details");
    } finally {
      setLoading(false);
    }
  };

  const getContestStatus = () => {
    if (!contest) return "UPCOMING";
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const nowDate = new Date(now);
    const start = new Date(
      new Date(contest.startTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );
    const end = new Date(
      new Date(contest.endTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );

    if (nowDate < start) return "UPCOMING";
    if (nowDate >= start && nowDate <= end) return "LIVE";
    return "COMPLETED";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-900 text-blue-300";
      case "LIVE":
        return "bg-green-900 text-green-300";
      case "COMPLETED":
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
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
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeRemaining = () => {
    if (!contest) return null;

    const now = new Date(
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    );
    const start = new Date(
      new Date(contest.startTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );
    const end = new Date(
      new Date(contest.endTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );
    const status = getContestStatus();

    let targetTime, label;
    if (status === "UPCOMING") {
      targetTime = start;
      label = "Starts in";
    } else if (status === "LIVE") {
      targetTime = end;
      label = "Ends in";
    } else return null;

    const diff = targetTime - now;
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m`;

    return { label, time: timeString.trim() };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-900 text-green-300 border-green-700";
      case "MEDIUM":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "HARD":
        return "bg-red-900 text-red-300 border-red-700";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post(
        `/contests/${contestId}/register`
      );
      const data = response.data;
      if (data.success) {
        toast.success("Successfully registered for contest!");
        fetchContestDetail();
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("An error occurred while registering");
    }
  };

  const handleJoinContest = async () => {
    try {
      const status = getContestStatus();
      if (status !== "LIVE") {
        toast.error("Contest is not currently live");
        return;
      }

      if (!contest.isRegistered) {
        toast.error("You need to register first");
        return;
      }

      navigate(`/contests/${contestId}/live`);
    } catch (error) {
      console.error("Error joining contest:", error);
      toast.error("Failed to join contest");
    }
  };

  if (loading) {
    return (
      <div className="min-w-screen flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          Contest not found
        </h3>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contests
        </button>
      </div>
    );
  }

  const status = getContestStatus();
  const timeRemaining = getTimeRemaining();
  const duration = Math.round(
    (new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60 * 60)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-w-screen mx-auto py-6 px-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contests
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {contest.name}
            </h1>
            <p className="text-gray-400 max-w-2xl">{contest.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status
              )}`}
            >
              {getStatusIcon(status)}
              {status}
            </span>

            {status === "UPCOMING" && !contest.isRegistered && (
              <button
                onClick={handleRegister}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register Now
              </button>
            )}

            {status === "LIVE" && contest.isRegistered && (
              <button
                onClick={handleJoinContest}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Play className="w-4 h-4 mr-2" />
                Join Contest
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contest Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="border-l-4 border-l-blue-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Start Time</p>
                <p className="font-semibold text-white">
                  {formatDateTime(contest.startTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-green-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-semibold text-white">{duration} hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-purple-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Participants</p>
                <p className="font-semibold text-white">
                  {contest.participantCount || 0}
                  {contest.maxParticipants && ` / ${contest.maxParticipants}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-orange-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Problems</p>
                <p className="font-semibold text-white">
                  {contest.problems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Countdown Timer */}
      {timeRemaining && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700 border rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-blue-300">
                  {timeRemaining.label}
                </h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 font-mono">
                {timeRemaining.time}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-full">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Target className="w-4 h-4" />
              Overview
            </button>
            {user && user?.user?.profile?.role === "ADMIN" && (
              <button
                onClick={() => setActiveTab("problems")}
                className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "problems"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Code className="w-4 h-4" />
                Problems
              </button>
            )}
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                activeTab === "leaderboard"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Award className="w-4 h-4" />
              Leaderboard
            </button>
            {user && user?.user?.profile?.role === "ADMIN" && (
              <button
                onClick={() => setActiveTab("stats")}
                className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "stats"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Statistics
              </button>
            )}
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contest Details */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Contest Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-400">{contest.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-2">Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start:</span>
                          <span className="font-medium text-white">
                            {formatDateTime(contest.startTime)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">End:</span>
                          <span className="font-medium text-white">
                            {formatDateTime(contest.endTime)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span className="font-medium text-white">
                            {duration} hours
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-2">
                        Created by
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {contest.creator.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {contest.creator.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            @{contest.creator.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Status */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                      <Users className="w-5 h-5 text-blue-400" />
                      Registration Status
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Your Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contest.isRegistered
                            ? "bg-blue-900 text-blue-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {contest.isRegistered ? "Registered" : "Not Registered"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Participants:</span>
                      <span className="font-medium text-white">
                        {contest.participantCount || 0}
                      </span>
                    </div>

                    {contest.maxParticipants && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Max Participants:</span>
                        <span className="font-medium text-white">
                          {contest.maxParticipants}
                        </span>
                      </div>
                    )}

                    {contest.maxParticipants && (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((contest.participantCount || 0) /
                                contest.maxParticipants) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}

                    {status === "UPCOMING" && !contest.isRegistered && (
                      <button
                        onClick={handleRegister}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Register for Contest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "problems" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contest.problems.map((contestProblem, index) => (
                  <motion.div
                    key={contestProblem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="hover:shadow-lg transition-shadow duration-300 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                              {contestProblem.order}
                            </div>
                            <h3 className="text-lg text-white">
                              {contestProblem.problem.title}
                            </h3>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                              contestProblem.problem.difficulty
                            )}`}
                          >
                            {contestProblem.problem.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-400 line-clamp-3">
                            {contestProblem.problem.description.substring(
                              0,
                              150
                            )}
                            ...
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Points:</span>
                            <span className="font-medium text-blue-400">
                              {contestProblem.points}
                            </span>
                          </div>

                          {status === "LIVE" && contest.isRegistered && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/contests/${contestId}/live/${contestProblem.problem.id}`
                                )
                              }
                              className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <Code className="w-4 h-4 mr-2" />
                              Solve Problem
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "leaderboard" && (
              <ContestLeaderboard contestId={contestId} />
            )}
            {activeTab === "stats" && <ContestStats contestId={contestId} />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContestDetail;
