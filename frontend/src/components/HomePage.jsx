import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import { Link } from "react-router-dom";
import {
  Lock,
  DollarSign,
  Loader2,
  Zap,
  Trophy,
  Users,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import { useUserStore } from "../store/useUserStore";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { getUserStats, isLoading, user } = useUserStore();
  const {
    latestPlaylists,
    getLatestUnpurchasedPaidPlaylists,
    initiatePlaylistPurchase,
    verifyPlaylistPurchase,
    isLoading: isPlaylistsLoading,
  } = usePlaylistStore();
  const {
    recommendedProblems,
    getRecommendedProblems,
    isLoading: isProblemsLoading,
  } = useProblemStore();
const [userStats, setUserStats] = useState({
  solved: 0,
  solvedToday: 0,
  streak: 0,
  accuracy: 0,
  rank: 'N/A',
  rankPercentile: 'N/A'
});

 useEffect(() => {
  const fetchData = async () => {
    try {
      getLatestUnpurchasedPaidPlaylists();
      getRecommendedProblems();

      if (user) {
        const response = await getUserStats();
        
        if (response.success && response.stats) {
          setUserStats(response.stats); 
        } else {
          setUserStats({
            solved: 0,
            solvedToday: 0,
            streak: 0,
            accuracy: 0,
            rank: 'N/A',
            rankPercentile: 'N/A'
          });
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  fetchData();
}, [user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePurchaseClick = async (playlistId) => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Payment system failed to load. Please try again.");
        return;
      }

      const response = await initiatePlaylistPurchase(playlistId);

      if (!response.success) {
        toast.error(response.message || "Failed to initiate payment");
        return;
      }

      const { order, key } = response;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Coding Playlists",
        description: `Purchase: ${order.receipt}`,
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await verifyPlaylistPurchase({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              playlistId: playlistId,
            });

            if (verificationResponse.success) {
              toast.success(verificationResponse.message);
              await getLatestUnpurchasedPaidPlaylists();
            } else {
              toast.error(
                verificationResponse.message || "Payment verification failed"
              );
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.user?.profile?.name || "",
          email: user?.user?.profile?.name || "",
          contact: "",
        },
        notes: {
          playlistId: playlistId,
          userId: user?.user?.profile?.id,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    }
  };


  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/30 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-400/10 rounded-full filter blur-xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-400/10 rounded-full filter blur-xl"></div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            <Zap className="w-8 h-8 text-yellow-400" />
            Welcome back{` ${user?.user?.profile?.name}`}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mt-3 text-lg max-w-3xl"
          >
            Building{" "}
            <span className="text-yellow-400 font-medium">
              an exciting new feature
            </span>{" "}
            where you can invite friends to solve problems together.
            Collaborate, compete, and grow together! Coming soon...
          </motion.p>

          <div className="mt-6 flex flex-wrap gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Daily Challenges</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-lg"
            >
              <Users className="w-5 h-5 text-blue-400" />
              <span>Community Solutions</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700/50 rounded-lg"
            >
              <Clock className="w-5 h-5 text-green-400" />
              <span>Time Tracking</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        { !isLoading ?  (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {/* Problems Solved */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 border border-blue-700/30 rounded-xl p-4"
            >
              <div className="text-blue-400 text-sm">Problems Solved</div>
              <div className="text-2xl font-bold mt-1">{userStats.solved}</div>
              <div className="text-green-400 text-xs mt-1">
                +{userStats.solvedToday} today
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-4"
            >
              <div className="text-purple-400 text-sm">Current Streak</div>
              <div className="text-2xl font-bold mt-1">
                {userStats.streak} {userStats.streak === 1 ? "day" : "days"}
              </div>
              <div className="text-yellow-400 text-xs mt-1">Keep going!</div>
            </motion.div>

            {/* Accuracy */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 border border-green-700/30 rounded-xl p-4"
            >
              <div className="text-green-400 text-sm">Accuracy</div>
              <div className="text-2xl font-bold mt-1">
                {userStats.accuracy}%
              </div>
              <div className="text-blue-400 text-xs mt-1">Great progress!</div>
            </motion.div>

            {/* Rank */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 border border-yellow-700/30 rounded-xl p-4"
            >
              <div className="text-yellow-400 text-sm">Rank</div>
              <div className="text-2xl font-bold mt-1">#{userStats.rank}</div>
              <div className="text-purple-400 text-xs mt-1">
                Top {userStats.rankPercentile}%
              </div>
            </motion.div>
          </motion.div>
        ): (
          <Loader2 />
        )}

        {/* Recommended Problems */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h3
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              className="text-2xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            >
              <Star className="w-6 h-6 text-yellow-400" />
              Recommended Problems – Tailored For You
            </motion.h3>
            <motion.div whileHover={{ x: 5 }}>
              <Link
                to="/break-zone"
                className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:underline flex items-center gap-1"
              >
                Visit Break Zone <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {isProblemsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {(recommendedProblems || []).map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, type: "spring" }}
                    whileHover={{ x: 5 }}
                    className="group flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          problem.difficulty === "EASY"
                            ? "bg-green-900/30 text-green-400"
                            : problem.difficulty === "MEDIUM"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                          {problem.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              problem.difficulty === "EASY"
                                ? "bg-green-900/50 text-green-400"
                                : problem.difficulty === "MEDIUM"
                                ? "bg-yellow-900/50 text-yellow-400"
                                : "bg-red-900/50 text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">
                            {problem.tags.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/problems/${problem.id}`}
                      className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      Solve <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm mt-6 italic"
          >
            Based on your recent activity and skill level. Try solving at least
            3 problems today!
          </motion.p>
        </motion.div>

        {/* Latest Paid Playlists */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <motion.h3
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="text-2xl font-bold mb-6 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            <Lock className="w-6 h-6 text-yellow-400" />
            Premium Problem Collections
          </motion.h3>

          {isPlaylistsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {latestPlaylists.map((playlist, index) => {
                  const totalProblems = playlist.problems?.length || 0;
                  const purchaseCount = playlist.purchases?.length || 0;

                  return (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-yellow-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h2 className="text-xl font-bold text-gray-100">
                                {playlist.name}
                              </h2>
                              <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                                <Lock className="w-3 h-3" /> PREMIUM
                              </span>
                            </div>

                            <p className="text-gray-300 mt-2">
                              {playlist.description ||
                                "No description provided."}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <span className="font-medium text-blue-400">
                                  {totalProblems} problems
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <span className="font-medium text-purple-400">
                                  {purchaseCount} purchases
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <span className="font-medium text-green-400">
                                  Updated {moment(playlist.updatedAt).fromNow()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-4 min-w-[180px]">
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                One-time purchase
                              </p>
                              <p className="text-xl font-bold text-yellow-400 flex items-center justify-end gap-1">
                                <span className="text-sm text-gray-300">₹</span>
                                {Number(playlist.price).toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Only ₹
                                {(playlist.price / totalProblems).toFixed(2)}{" "}
                                per problem
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handlePurchaseClick(playlist.id)}
                              className="btn bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white w-full flex items-center justify-center gap-2"
                            >
                              <DollarSign className="w-4 h-4" />
                              Buy Now
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 text-sm mt-6"
          >
            Unlock exclusive high-quality problems curated by industry experts
            to accelerate your learning.
          </motion.p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/30 rounded-xl p-8 backdrop-blur-sm text-center"
        >
          <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Ready to Level Up Your Skills?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have accelerated their learning
            with our premium problem collections.
          </p>
          <Link to={"/store"}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              Explore All Playlists
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
