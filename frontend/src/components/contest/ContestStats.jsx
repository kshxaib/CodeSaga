import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Code, Target, Users } from "lucide-react";
import { axiosInstance } from "../../libs/axios";

const ContestStats = ({ contestId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contestId) {
      fetchStats();
    }
  }, [contestId]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(`/contests/${contestId}/stats`);
      const data = response.data;

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "HARD":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLanguageColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-gray-500",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-w-screen flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="border-l-4 border-l-blue-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalParticipants}</p>
                <p className="text-sm text-gray-400">Total Participants</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-green-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalSubmissions}</p>
                <p className="text-sm text-gray-400">Total Submissions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-purple-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.acceptedSubmissions}</p>
                <p className="text-sm text-gray-400">Accepted Solutions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-l-orange-500 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.acceptanceRate}%</p>
                <p className="text-sm text-gray-400">Acceptance Rate</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problem Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Problem-wise Statistics
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.problemStats.map((problem, index) => (
                <motion.div
                  key={problem.problemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-white">{problem.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === "EASY"
                            ? "bg-green-900 text-green-300"
                            : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {problem.acceptedSubmissions} / {problem.totalSubmissions} solved
                      </p>
                      <p className="font-medium text-green-400">{problem.acceptanceRate.toFixed(1)}% success rate</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Acceptance Rate</span>
                      <span className="text-white">{problem.acceptanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${problem.acceptanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Language Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <PieChart className="w-5 h-5 text-purple-400" />
              Programming Language Distribution
            </h2>
          </div>
          <div className="p-6">
            {Object.keys(stats.languageStats).length === 0 ? (
              <p className="text-center text-gray-400 py-8">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.languageStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([language, count], index) => {
                    const percentage = (count / stats.totalSubmissions) * 100;
                    return (
                      <motion.div
                        key={language}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-4 h-4 rounded ${getLanguageColor(index)}`} />
                          <span className="font-medium text-white">{language}</span>
                        </div>

                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getLanguageColor(index)}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-16 text-right">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContestStats;