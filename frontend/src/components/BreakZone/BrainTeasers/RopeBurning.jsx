import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";

export default function RopeBurning() {
  const [puzzle, setPuzzle] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const gameRules = [
    "🧠 Solve classic rope burning logic puzzles",
    "⏱️ Measure time using ropes that burn unevenly",
    "💡 Use hints if you get stuck",
    "📚 Learn the underlying concepts with explanations",
    "🔄 Generate new puzzles with varying difficulty",
    "🔍 Think outside the box for creative solutions"
  ];

  const fetchPuzzle = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axiosInstance.post("/breakzone/rope-burning");
      setPuzzle(res.data);
      setShowHint(false);
      setShowExplanation(false);
      setResult(null);
      setGuess("");
    } catch (err) {
      console.error("Error fetching puzzle:", err);
      setApiError(err.response?.data?.error || "Failed to load puzzle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const checkAnswer = async () => {
    if (!puzzle || !guess.trim()) return;
    
    setChecking(true);
    setApiError(null);
    try {
      const res = await axiosInstance.post("/breakzone/rope-burning/validate", {
        guess,
        correctAnswer: puzzle.puzzle
      });

      setResult({
        correct: res.data.isCorrect,
        message: res.data.isCorrect 
          ? "🎉 Correct! Brilliant solution!" 
          : "❌ Incorrect! Try again.",
        feedback: res.data.feedback
      });
    } catch (err) {
      console.error("Error checking answer:", err);
      setApiError(err.response?.data?.error || "Failed to check answer. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-blue-800 text-white p-6 flex flex-col items-center justify-start relative">
      {/* Back Button */}
      <Link to="/break-zone" className="absolute top-4 left-4 group">
        <motion.div
          className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} className="mr-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 group-hover:text-cyan-400 transition-colors"
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
          <span className="font-medium text-sm group-hover:text-cyan-400 transition-colors">
            Back to Break Zone
          </span>
        </motion.div>
      </Link>

      {/* Rules Button */}
      <motion.button
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-34 bg-cyan-800 hover:bg-cyan-700 px-3 py-1 rounded-lg text-sm flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Rules
      </motion.button>

      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-bold px-3 py-1 rounded-full flex items-center"
      >
        <span className="mr-1">⚡</span> AI-Powered
      </motion.div>

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
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="text-xl mr-3"
              >
                ⚠️
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold">Error</h3>
                <p className="text-sm">{apiError}</p>
              </div>
              <button 
                onClick={() => setApiError(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Rope Burning Rules
                </h2>
                <button 
                  onClick={() => setShowRules(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {gameRules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    <p className="text-gray-300">{rule}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: gameRules.length * 0.1 + 0.3 }}
                className="mt-6 pt-4 border-t border-gray-800 flex justify-center"
              >
                <motion.button
                  onClick={() => setShowRules(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl flex flex-col items-center mt-16"
      >
        <motion.h1 
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          🔥 Rope Burning Puzzle
        </motion.h1>

        <motion.p
          className="text-cyan-200 mb-8 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Solve classic logic puzzles by measuring time with burning ropes
        </motion.p>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex justify-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                <p className="text-gray-400">Generating puzzle...</p>
              </div>
            </motion.div>
          ) : puzzle ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-6"
            >
              {/* Puzzle Display */}
              <motion.div
                className="bg-gray-900/50 p-6 rounded-lg border border-gray-700"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-cyan-300">Puzzle Challenge</h3>
                </div>
                <p className="whitespace-pre-wrap text-lg">{puzzle.puzzle}</p>
              </motion.div>

              {/* Input and Buttons */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 rounded-lg bg-white/90 text-blue-900 font-medium text-center text-lg shadow"
                  placeholder="Type your solution..."
                  disabled={checking || result?.correct}
                />

                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    onClick={checkAnswer}
                    disabled={!guess.trim() || checking || result?.correct}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      !guess.trim() || checking || result?.correct
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    }`}
                  >
                    {checking ? "Checking..." : "Submit Solution"}
                  </motion.button>

                  <motion.button
                    onClick={() => setShowHint(!showHint)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium"
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </motion.button>

                  <motion.button
                    onClick={() => setShowExplanation(!showExplanation)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium"
                  >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                  </motion.button>
                </div>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-cyan-800/50 rounded-lg text-cyan-200 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">💡</span>
                      <span className="font-medium">Hint:</span>
                    </div>
                    <p>{puzzle.hint}</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg text-center ${
                      result.correct ? "bg-green-900/50" : "bg-red-900/50"
                    }`}
                  >
                    <p className={`text-xl font-bold ${
                      result.correct ? "text-green-300" : "text-red-300"
                    }`}>
                      {result.message}
                    </p>
                    {result.feedback && (
                      <p className="mt-2">{result.feedback}</p>
                    )}
                  </motion.div>
                )}

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-600 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-blue-300">Concept Explanation</h3>
                    </div>
                    <p className="whitespace-pre-wrap">{puzzle.explanation}</p>
                  </motion.div>
                )}
              </div>

              {/* New Puzzle Button */}
              <div className="flex justify-center mt-6">
                <motion.button
                  onClick={fetchPuzzle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-medium"
                >
                  Generate New Puzzle
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center"
            >
              <p className="text-gray-400">No puzzle available. Please try again later.</p>
              <button
                onClick={fetchPuzzle}
                className="mt-4 px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}