import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" }
];

const BugHunt = () => {
  const [selectedLang, setSelectedLang] = useState("python");
  const [buggyCode, setBuggyCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const editorRef = useRef(null);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const gameRules = [
  "🪲 AI generates buggy code with logical errors (not syntax errors)",
  "🧠 Understand why the original code doesn't work as intended",
  "💻 Write your fix in the editor with syntax highlighting",
  "✅ Submit your fix and get instant AI feedback on your solution",
  "🌐 Try different languages and challenges powered by AI",
  "💡 Learn from AI explanations to improve your skills"
];

  const fetchBuggyCode = async () => {
    try {
      setGenerating(true);
      setApiError(null);
      setResult(null);
      setUserCode("");
      
      const res = await axiosInstance.post("breakzone/bug-hunt", { 
        language: selectedLang 
      });
      
      if (!res.data?.buggyCode) {
        throw new Error("Failed to generate buggy code");
      }
      
      setBuggyCode(res.data.buggyCode);
    } catch (err) {
      console.error("Error fetching buggy code:", err);
      setApiError(err.response?.data?.error || "Failed to generate challenge. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchBuggyCode();
  }, [selectedLang]);

  const checkAnswer = async () => {
    try {
      if (!userCode.trim()) {
        setApiError("Please write your fix before submitting");
        return;
      }
      
      setLoading(true);
      setApiError(null);
      
      const res = await axiosInstance.post("breakzone/bug-hunt/validate", {
        buggyCode,
        userFix: userCode,
        language: selectedLang
      });

    

      setResult({
        isCorrect: res.data.isCorrect,
        feedback: res.data.feedback || "No feedback provided"
      });
    } catch (err) {
      console.error("Error validating fix:", err);
      setApiError("Gemini API is currently unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getEditorLanguage = () => {
    switch(selectedLang) {
      case "cpp": return "cpp";
      case "c": return "c";
      case "java": return "java";
      case "python": return "python";
      case "typescript": return "typescript";
      default: return "javascript";
    }
  };

  return (
    <div className="min-h-screen min-w-screen  bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6 flex flex-col items-center relative">
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

      {/* Rules Button */}
      <motion.button
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-34 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm flex items-center"
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
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">
                  Bug Hunt Rules
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
                    <span className="text-pink-400 mr-2 mt-1">•</span>
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
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg font-medium"
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
        className="w-full max-w-6xl flex flex-col items-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 mt-6 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          🐛 Bug Hunt Challenge
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-6 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Find and fix logical bugs in AI-generated code
        </motion.p>

        <div className="flex gap-4 items-center mb-8 w-full max-w-2xl">
          <div className="relative flex-1">
            <motion.button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{languages.find(l => l.value === selectedLang)?.label}</span>
              <motion.span animate={{ rotate: showLanguageDropdown ? 180 : 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  {languages.map((lang) => (
                    <motion.li
                      key={lang.value}
                      whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.2)" }}
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setSelectedLang(lang.value);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {lang.label}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={fetchBuggyCode}
            disabled={generating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-medium ${
              generating
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
            }`}
          >
            {generating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "New Challenge"
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex justify-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                <p className="text-gray-400">AI is generating your buggy code...</p>
              </div>
            </motion.div>
          ) : buggyCode ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Buggy Code */}
                <div className="relative">
                  <div className="absolute top-2 right-2 bg-gray-800 text-pink-400 text-xs px-2 py-1 rounded">
                    Buggy Code
                  </div>
                  <div className="h-96 bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-auto">
                    <pre className="text-sm md:text-base font-mono whitespace-pre-wrap text-gray-300">
                      {buggyCode}
                    </pre>
                  </div>
                </div>

                {/* User Fix Editor */}
                <div className="relative">
                  <div className="absolute top-2 right-2 bg-gray-800 text-green-400 text-xs px-2 py-1 rounded">
                    Your Fix
                  </div>
                  <div className="h-96">
                    <Editor
                      height="100%"
                      language={getEditorLanguage()}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        suggestOnTriggerCharacters: true,
                        tabCompletion: "on",
                        quickSuggestions: true
                      }}
                      onChange={setUserCode}
                      onMount={(editor) => editorRef.current = editor}
                      value={userCode}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <motion.button
                  onClick={checkAnswer}
                  disabled={loading || !userCode.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    loading || !userCode.trim()
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    "Submit Fix"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center"
            >
              <p className="text-gray-400">Select a language and click "New Challenge" to begin</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-6 rounded-xl border max-w-2xl w-full ${
                result.isCorrect 
                  ? "bg-gradient-to-r from-green-900/50 to-teal-900/50 border-emerald-700/50"
                  : "bg-gradient-to-r from-red-900/50 to-pink-900/50 border-red-700/50"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="text-4xl mb-4"
              >
                {result.isCorrect ? "🎉" : "😅"}
              </motion.div>
              <h3 className="text-xl font-bold mb-4">
                {result.isCorrect ? "Correct Fix!" : "Try Again!"}
              </h3>
              
              <div className="bg-gray-900/70 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">AI Feedback:</h4>
                <p className="whitespace-pre-wrap">{result.feedback}</p>
              </div>

              <motion.button
                onClick={fetchBuggyCode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg font-medium w-full"
              >
                Try Another Challenge
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BugHunt;