import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";

const BinaryClicker = () => {
  const [count, setCount] = useState(0);
  const [binary, setBinary] = useState("0");
  const [geminiResult, setGeminiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const gameRules = [
    "🔢 Click the binary number to increment it",
    "⚡ Watch as the decimal number converts to binary in real-time",
    "🧠 Learn about binary numbers with AI explanations",
    "🏆 Challenge yourself to reach interesting binary patterns",
    "💡 Try to predict what the next binary number will be"
  ];

  useEffect(() => {
    setBinary(count.toString(2));
  }, [count]);

  const incrementCount = () => {
    setIsAnimating(true);
    setCount(count + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const fetchGeminiContent = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const prompt = `Explain the binary number ${binary} (which equals ${count} in decimal) in simple terms, and provide an interesting fact about binary numbers.`;
      const response = await axiosInstance.post("/breakzone/binary-clicker", { prompt });
      
      if (!response.data?.result) {
        throw new Error("No response from AI");
      }
      
      setGeminiResult(response.data.result);
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setApiError("Gemini API is currently unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetCounter = () => {
    setCount(0);
    setGeminiResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 text-white p-6 flex flex-col items-center justify-start relative">
      {/* Back Button */}
      <Link to="/break-zone" className="absolute top-4 left-4 group">
        <motion.div
          className="flex items-center text-gray-400 hover:text-blue-400 transition-colors"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} className="mr-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 group-hover:text-blue-400 transition-colors"
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
          <span className="font-medium text-sm group-hover:text-blue-400 transition-colors">
            Back to Break Zone
          </span>
        </motion.div>
      </Link>

      {/* Rules Button */}
      <motion.button
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-34 bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center"
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
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  Binary Clicker Rules
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
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium"
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
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          🔢⚡ Binary Clicker
        </motion.h1>

        <motion.p
          className="text-blue-200 mb-8 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Click to increment and learn about binary numbers
        </motion.p>

        <div className="flex flex-col items-center space-y-6">
          {/* Decimal Counter */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-2xl text-blue-200"
          >
            Decimal: <span className="font-bold">{count}</span>
          </motion.div>

          {/* Binary Display */}
          <motion.div
            onClick={incrementCount}
            className={`text-7xl font-mono cursor-pointer select-none ${
              isAnimating ? "text-cyan-300" : "text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: isAnimating ? [1, 1.2, 1] : 1,
              color: isAnimating ? "#7dd3fc" : "#ffffff"
            }}
            transition={{ duration: 0.3 }}
          >
            {binary}
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={fetchGeminiContent}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Asking AI...
                </span>
              ) : (
                "Explain Binary"
              )}
            </motion.button>

            <motion.button
              onClick={resetCounter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* AI Explanation */}
        <AnimatePresence>
          {geminiResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-800/50 to-cyan-800/50 rounded-xl border border-cyan-500/30 backdrop-blur-sm max-w-2xl w-full"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-cyan-200">AI Explanation</h3>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-blue-100">
                  {typeof geminiResult === "string"
                    ? geminiResult
                    : JSON.stringify(geminiResult, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BinaryClicker;