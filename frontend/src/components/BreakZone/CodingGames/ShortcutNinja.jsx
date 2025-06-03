import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";

export default function ShortcutNinja() {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [topics] = useState([
    "IDE keyboard shortcuts",
    "VS Code shortcuts",
    "Windows shortcuts",
    "MacOS shortcuts",
    "Linux shortcuts",
    "Chrome shortcuts"
  ]);
  const [selectedTopic, setSelectedTopic] = useState("IDE keyboard shortcuts");

  const gameRules = [
    "🥋 Test your knowledge of keyboard shortcuts",
    "⌨️ Type the shortcut you think answers the question",
    "💡 Use hints if you get stuck",
    "🔄 Get new questions to learn more shortcuts",
    "🏆 Challenge yourself to answer without hints",
    "🌐 Multiple topics available (IDEs, OS, browsers)"
  ];

  const fetchQuestion = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axiosInstance.post("breakzone/shortcut-ninja", {
        topic: selectedTopic,
      });
      setQuestionData(res.data);
      setUserAnswer("");
      setResult(null);
      setFlipped(false);
      setShowHint(false);
    } catch (err) {
      console.error("Error fetching question:", err);
      setApiError(err.response?.data?.error || "Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [selectedTopic]);

  const checkAnswer = async () => {
    if (!questionData || !userAnswer.trim()) return;
    
    setChecking(true);
    setApiError(null);
    try {
      const res = await axiosInstance.post("breakzone/shortcut-ninja/check", {
        question: questionData.question,
        userAnswer,
      });
      
      setResult({
        correct: res.data.correct,
        message: res.data.correct 
          ? "✅ Correct! You're a Shortcut Ninja! 🥋" 
          : "❌ Incorrect!",
        explanation: res.data.explanation,
        correctAnswer: questionData.answer
      });
    } catch (err) {
      console.error("Error checking answer:", err);
      setApiError(err.response?.data?.error || "Failed to check answer. Please try again.");
    } finally {
      setFlipped(true);
      setChecking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-lime-800 text-white p-6 flex flex-col items-center justify-start relative">
      {/* Back Button */}
      <Link to="/break-zone" className="absolute top-4 left-4 group">
        <motion.div
          className="flex items-center text-gray-400 hover:text-green-400 transition-colors"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} className="mr-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 group-hover:text-green-400 transition-colors"
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
          <span className="font-medium text-sm group-hover:text-green-400 transition-colors">
            Back to Break Zone
          </span>
        </motion.div>
      </Link>

      {/* Rules Button */}
      <motion.button
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-34 bg-green-800 hover:bg-green-700 px-3 py-1 rounded-lg text-sm flex items-center"
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
        className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center"
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
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">
                  Shortcut Ninja Rules
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
                    <span className="text-green-400 mr-2 mt-1">•</span>
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
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg font-medium"
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
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-lime-400 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          🥋 Shortcut Ninja
        </motion.h1>

        <motion.p
          className="text-green-200 mb-8 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Master keyboard shortcuts like a ninja!
        </motion.p>

        {/* Topic Selector */}
        <div className="mb-6 w-full max-w-md">
          <label className="block text-green-200 mb-2">Select Topic:</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-700 text-white"
            disabled={loading || checking}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Flash Card */}
        <motion.div
          className={`relative w-full max-w-md h-64 perspective-1000 cursor-pointer mb-8`}
          onClick={() => setFlipped(!flipped)}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className={`absolute w-full h-full bg-white text-green-900 rounded-xl shadow-xl
            transition-all duration-500 transform-style-preserve-3d
            ${flipped ? "rotate-y-180" : ""}
            flex flex-col justify-center items-center p-6`}
            style={{ backfaceVisibility: "hidden" }}
            animate={{ 
              rotateY: flipped ? 180 : 0,
              backgroundColor: loading ? "#e5e7eb" : "#ffffff"
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4">Generating question...</p>
              </div>
            ) : (
              <p className="text-xl text-center">{questionData?.question || "No question available"}</p>
            )}
          </motion.div>

          <motion.div
            className={`absolute w-full h-full bg-green-700 text-white rounded-xl shadow-xl
            transition-all duration-500 transform-style-preserve-3d rotate-y-180
            ${flipped ? "rotate-y-0" : ""}
            flex flex-col justify-center items-center p-6`}
            style={{ backfaceVisibility: "hidden" }}
            animate={{ rotateY: flipped ? 0 : 180 }}
          >
            {result ? (
              <div className="text-center">
                <p className={`text-2xl font-bold mb-4 ${
                  result.correct ? "text-green-300" : "text-red-300"
                }`}>
                  {result.message}
                </p>
                {!result.correct && (
                  <div className="mt-2">
                    <p className="text-lg">Correct answer:</p>
                    <p className="font-mono text-xl bg-green-900/50 px-3 py-1 rounded mt-1">
                      {result.correctAnswer}
                    </p>
                  </div>
                )}
                {result.explanation && (
                  <p className="mt-4 text-green-200">{result.explanation}</p>
                )}
              </div>
            ) : (
              <p className="text-xl">Flip to see the answer</p>
            )}
          </motion.div>
        </motion.div>

        {/* Answer Input */}
        <motion.div
          className="w-full max-w-md space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 rounded-lg bg-white/90 text-green-900 font-mono text-center text-lg shadow"
            placeholder="Type the shortcut..."
            disabled={loading || checking || flipped}
          />

          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              onClick={checkAnswer}
              disabled={loading || checking || !userAnswer.trim() || flipped}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium ${
                loading || checking || !userAnswer.trim() || flipped
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700"
              }`}
            >
              {checking ? "Checking..." : "Check Answer"}
            </motion.button>

            <motion.button
              onClick={() => fetchQuestion()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-800 hover:bg-green-700 rounded-lg font-medium"
              disabled={loading || checking}
            >
              New Question
            </motion.button>

            {questionData?.hint && !flipped && (
              <motion.button
                onClick={() => setShowHint(!showHint)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </motion.button>
            )}
          </div>

          {showHint && !flipped && questionData?.hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-green-800/50 rounded-lg text-green-200 text-center"
            >
              💡 Hint: {questionData.hint}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}