import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, TrendingUp, Clock } from "lucide-react";
import { axiosInstance } from "../../libs/axios";

const ContestLeaderboard = ({ contestId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contestId) {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 30000);
      return () => clearInterval(interval);
    }
  }, [contestId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get(`/contests/${contestId}/leaderboard`);
      const data = response.data;
      if (data.success) setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-500" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-600 to-yellow-800 text-white";
      case 2: return "bg-gradient-to-r from-gray-600 to-gray-800 text-white";
      case 3: return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
      default: return "bg-gray-800 border border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      {leaderboard.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-center flex items-center justify-center gap-2 text-white">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Top Performers
              </h3>
            </div>
            <div className="p-4">
              <div className="flex justify-center items-end gap-4 mb-6">
                {/* Second Place */}
                {leaderboard[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-20 h-16 bg-gradient-to-t from-gray-600 to-gray-800 rounded-t-lg flex items-end justify-center pb-2 mb-2">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div className="w-12 h-12 mx-auto mb-2 border-2 border-gray-500 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white">
                      {leaderboard[1].user.name.charAt(0)}
                    </div>
                    <p className="font-medium text-sm text-white">{leaderboard[1].user.name}</p>
                    <p className="text-xs text-gray-400">@{leaderboard[1].user.username}</p>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {leaderboard[1].totalScore} pts
                    </span>
                  </motion.div>
                )}

                {/* First Place */}
                {leaderboard[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-20 bg-gradient-to-t from-yellow-600 to-yellow-800 rounded-t-lg flex items-end justify-center pb-2 mb-2 relative">
                      <Crown className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-400" />
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <div className="w-16 h-16 mx-auto mb-2 border-4 border-yellow-500 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
                      {leaderboard[0].user.name.charAt(0)}
                    </div>
                    <p className="font-bold text-white">{leaderboard[0].user.name}</p>
                    <p className="text-sm text-gray-400">@{leaderboard[0].user.username}</p>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white">
                      {leaderboard[0].totalScore} pts
                    </span>
                  </motion.div>
                )}

                {/* Third Place */}
                {leaderboard[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-18 h-12 bg-gradient-to-t from-amber-600 to-amber-800 rounded-t-lg flex items-end justify-center pb-2 mb-2">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="w-10 h-10 mx-auto mb-2 border-2 border-amber-500 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
                      {leaderboard[2].user.name.charAt(0)}
                    </div>
                    <p className="font-medium text-sm text-white">{leaderboard[2].user.name}</p>
                    <p className="text-xs text-gray-400">@{leaderboard[2].user.username}</p>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {leaderboard[2].totalScore} pts
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Full Leaderboard
          </h2>
        </div>
        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No participants yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg flex items-center gap-4 ${getRankColor(participant.rank)} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(participant.rank)}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
                      {participant.user.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <p className={`font-medium ${participant.rank <= 3 ? "text-white" : "text-white"}`}>
                        {participant.user.name}
                      </p>
                      <p className={`text-sm ${participant.rank <= 3 ? "text-gray-300" : "text-gray-400"}`}>
                        @{participant.user.username}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-lg ${participant.rank <= 3 ? "text-white" : "text-white"}`}>
                      {participant.totalScore}
                    </p>
                    <p className={`text-sm ${participant.rank <= 3 ? "text-gray-300" : "text-gray-400"}`}>points</p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${participant.rank <= 3 ? "text-gray-300" : "text-gray-500"}`} />
                      <span className={`text-sm ${participant.rank <= 3 ? "text-gray-300" : "text-gray-400"}`}>
                        {new Date(participant.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestLeaderboard;