import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";

export default function RegexRush() {
  const [pattern, setPattern] = useState("");
  const [strings, setStrings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedString, setSelectedString] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const timerRef = useRef(null);
  const [apiError, setApiError] = useState(null);

  async function fetchGameData() {
    setIsLoading(true);
    setStatus("");
    setScore(0);
    setTimeLeft(30);
    setPattern("");
    setStrings([]);
    setSelectedString(null);

    try {
      const res = await axiosInstance.post("/breakzone/regex-rush");
      const data = res.data;

      setPattern(data.pattern);
      setStrings(data.strings);
      setScore(0);
      setStatus("");
      setTimeLeft(30);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setStatus("timeup");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to fetch game data:", err);
      setStatus("Failed to load game. Please try again.");
      setApiError("API is currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(str) {
    if (status === "timeup" || status === "finished") return;

    setSelectedString(str);

    try {
      const regex = new RegExp(pattern);
      const isMatch = regex.test(str);

      if (isMatch) {
        setScore((s) => s + 1);
        setStatus("correct");
      } else {
        setStatus("wrong");
      }
    } catch {
      setStatus("invalid regex");
    }
  }

  useEffect(() => {
    if (score === strings.length && strings.length > 0) {
      clearInterval(timerRef.current);
      setStatus("finished");
    }
  }, [score, strings.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white flex flex-col items-center justify-center p-6 space-y-6 relative">
      {/* Back Button - Moved down slightly */}
      <Link to="/break-zone" className="absolute top-6 left-4 group">
        <motion.div
          className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:text-purple-400 transition-colors"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
          <span className="font-medium text-sm group-hover:text-purple-400 transition-colors">
            Back to Break Zone
          </span>
        </motion.div>
      </Link>

      {/* Error Message */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-red-600/90 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-red-400/50 flex items-start">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="text-xl mr-3"
              >
                ⚠️
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold">API Error</h3>
                <p className="text-sm">{apiError}</p>
              </div>
              <button
                onClick={() => setApiError(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Badge - Moved down slightly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-6 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center"
      >
        <span className="mr-1">⚡</span> AI-Powered
      </motion.div>

      {/* Game Rules Button */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="absolute top-6 right-34 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
      >
        {showRules ? "Hide Rules" : "Show Rules"}
      </button>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2"
      >
        ⏱️ Regex Rush
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-6 text-center max-w-md"
      >
        Race against time to match strings with the given regex pattern
      </motion.p>

      {/* Game Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-md mx-4 mb-6"
          >
            <h3 className="text-xl font-bold mb-4 text-orange-400">
              Game Rules
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  You have <strong>30 seconds</strong> to match as many strings
                  as possible
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Click on strings that match the given regex pattern</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  Each correct match gives you <strong>1 point</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  The game ends when time runs out or you match all strings
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Watch out - wrong matches will cost you time!</span>
              </li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg"
            >
              Got it!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <svg
              className="animate-spin h-8 w-8 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-400">Generating regex challenge...</p>
        </motion.div>
      ) : pattern ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-lg mb-2">
              Match this pattern:{" "}
              <motion.code
                className="bg-gray-800 p-2 rounded-lg font-mono text-orange-400 border border-orange-500/50"
                whileHover={{ scale: 1.05 }}
              >
                {pattern}
              </motion.code>
            </p>
            <motion.p
              className="text-xl"
              animate={{
                color: timeLeft <= 10 ? "#ef4444" : "#ffffff",
                scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
              }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0 }}
            >
              Time left: {timeLeft}s | Score: {score}/{strings.length}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {strings.map((str, i) => (
              <motion.button
                key={i}
                onClick={() => handleSelect(str)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" }}
                className={`p-4 rounded-lg font-mono text-center transition-all ${
                  selectedString === str
                    ? status === "correct"
                      ? "bg-green-900/80 border-2 border-green-500 text-green-100"
                      : "bg-red-900/80 border-2 border-red-500 text-red-100"
                    : "bg-gray-800 hover:bg-orange-900/50 border border-gray-700 hover:border-orange-500 text-gray-200"
                }`}
                disabled={status === "timeup" || status === "finished"}
                whileHover={!selectedString ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                {str}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence>
            {status === "correct" && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-green-900/30 text-green-400 border border-green-500/50 rounded-lg text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ repeat: 2, duration: 0.5 }}
                >
                  ✅ Correct match! +1 point
                </motion.div>
              </motion.div>
            )}

            {status === "wrong" && (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-red-900/30 text-red-400 border border-red-500/50 rounded-lg text-center"
              >
                <motion.div
                  animate={{
                    x: [0, 10, -10, 0],
                  }}
                  transition={{ repeat: 2, duration: 0.3 }}
                >
                  ❌ Wrong match, try again!
                </motion.div>
              </motion.div>
            )}

            {(status === "timeup" || status === "finished") && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl text-center"
              >
                <motion.h2
                  className="text-2xl font-bold mb-4"
                  animate={{
                    color: ["#ffffff", "#f59e0b", "#ffffff"],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {status === "timeup" ? "⏰ Time's up!" : "🎉 You finished!"}
                </motion.h2>
                <p className="text-xl mb-6">
                  Your final score: <span className="font-bold">{score}</span>/
                  {strings.length}
                </p>
                <motion.button
                  onClick={fetchGameData}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl font-medium text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.button
          onClick={fetchGameData}
          className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl font-bold text-white text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Start Regex Rush
        </motion.button>
      )}
    </div>
  );
}
