import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";

const languageOptions = [
  "JavaScript",
  "Python",
  "C++",
  "Java",
  "TypeScript",
  "Go",
  "Ruby",
];

const gameRules = [
  "🤖 AI will generate a code snippet in your chosen language",
  "🧠 Predict what the code will output when executed",
  "⏱️ No time limit - think carefully before answering",
  "✅ You get unlimited attempts to try different questions",
  "🎯 Difficulty increases as you answer correctly",
];

export default function App() {
  const [language, setLanguage] = useState("");
  const [inputLang, setInputLang] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setSelected(null);
    setStatus("");

    try {
      const res = await axiosInstance.post(
        `/breakzone/guess-output?language=${language}`
      );
      const data = await res.data;
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setApiError("API is currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inputLang.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = languageOptions.filter((l) =>
        l.toLowerCase().includes(inputLang.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [inputLang]);

  const handleSelectLang = (lang) => {
    setLanguage(lang);
    setInputLang(lang);
    setShowSuggestions(false);
  };

  const handleAnswer = (opt) => {
    setSelected(opt);
    setStatus(opt === question.correct ? "correct" : "wrong");
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="min-h-screen min-w-screen  bg-gradient-to-br from-gray-900 to-gray-950 text-white flex flex-col items-center justify-start p-6 space-y-6 relative">
      {/* Back Button */}
      <Link to="/break-zone" className="absolute top-4 left-4 group">
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

      <motion.button
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-34 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Rules
      </motion.button>

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
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Game Rules
                </h2>
                <button
                  onClick={() => setShowRules(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                    <span className="text-purple-400 mr-2 mt-1">•</span>
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
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium"
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center"
      >
        <span className="mr-1">⚡</span> AI-Powered
      </motion.div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mt-6 mb-2"
      >
        🎮 Guess the Output
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-6 text-center max-w-md"
      >
        Test your coding knowledge by predicting AI-generated code outputs
      </motion.p>

      {/* AI Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 max-w-md text-center"
      >
        <p>This game uses AI to generate unique code challenges in real-time</p>
      </motion.div>

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block mb-2 text-sm text-gray-300 font-medium">
          Choose a programming language:
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500 transition-all duration-200"
            value={inputLang}
            onChange={(e) => {
              setInputLang(e.target.value);
              setLanguage(e.target.value);
            }}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Type or select a language..."
          />
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              >
                {suggestions.map((lang, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-4 py-2 hover:bg-purple-600 cursor-pointer transition-colors"
                    onClick={() => handleSelectLang(lang)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {lang}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.button
        onClick={fetchQuestion}
        disabled={!language || isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
          !language || isLoading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            {question
              ? "Generating next challenge..."
              : "Generating AI challenge..."}
          </span>
        ) : question ? (
          "Next Question"
        ) : (
          "Generate Question"
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex justify-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <svg
                  className="animate-spin h-8 w-8 text-purple-500"
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs">AI</span>
                </div>
              </div>
              <p className="text-gray-400">
                AI is crafting your unique challenge...
              </p>
            </div>
          </motion.div>
        )}

        {question && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-300">
                What will be the output of this code?
              </h3>
              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                AI-Generated
              </span>
            </div>

            <pre className="bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm md:text-base border border-gray-800 font-mono mb-4">
              {question.code}
            </pre>

            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    selected
                      ? opt === question.correct
                        ? "bg-green-900/80 border-2 border-green-500 text-green-100"
                        : opt === selected
                        ? "bg-red-900/80 border-2 border-red-500 text-red-100"
                        : "bg-gray-800/50 border border-gray-700 text-gray-300"
                      : "bg-gray-800 hover:bg-purple-900/50 border border-gray-700 hover:border-purple-500 text-gray-200"
                  }`}
                  disabled={!!selected}
                  whileHover={!selected ? { scale: 1.02 } : {}}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: status === "correct" ? [1, 1.1] : [1, 0.9],
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                  }}
                  className={`mt-6 p-4 rounded-lg text-center text-xl font-bold ${
                    status === "correct"
                      ? "bg-green-900/30 text-green-400 border border-green-500/50"
                      : "bg-red-900/30 text-red-400 border border-red-500/50"
                  }`}
                >
                  {status === "correct" ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{
                          scale: [1, 1.5, 1],
                          rotate: [0, 20, -20, 0],
                        }}
                        transition={{ repeat: 3, duration: 0.5 }}
                      >
                        🎉
                      </motion.span>
                      <span>Correct! Well done!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{ repeat: 3, duration: 0.3 }}
                      >
                        ❌
                      </motion.span>
                      <span>Oops! Try again next time!</span>
                    </div>
                  )}
                  {status === "correct" && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2 text-sm text-gray-400"
                    >
                      The correct output is: {question.correct}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
