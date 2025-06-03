import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../libs/axios";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";

const languageOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "TypeScript",
  "Ruby"
];

const gameRules = [
  "⌨️ Type the displayed code snippet within the time limit",
  "⏱️ Fixed time challenge - complete as much as you can",
  "⚡ Real-time WPM and accuracy tracking",
  "🎯 Code editor with syntax highlighting and suggestions",
  "🔄 Unlimited attempts with different code snippets",
  "🌐 Multiple programming languages available"
];

const TIME_LIMIT = 60; // 1 minute time limit

export default function TypingTest() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [charStatus, setCharStatus] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [apiError, setApiError] = useState(null);
  const [progress, setProgress] = useState(0);
  const editorRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && !finished) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = TIME_LIMIT - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
        setProgress((elapsed / TIME_LIMIT) * 100);

        if (remaining <= 0) {
          calculateResults();
          setFinished(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, finished]);

  // Character accuracy tracking
  useEffect(() => {
    if (userInput && code) {
      const newCharStatus = [];
      for (let i = 0; i < userInput.length; i++) {
        newCharStatus.push({
          char: userInput[i],
          correct: userInput[i] === code[i],
          extra: i >= code.length
        });
      }
      setCharStatus(newCharStatus);
      
      // Calculate current accuracy
      const correctChars = [...userInput].filter((ch, i) => ch === code[i]).length;
      const newAccuracy = Math.round((correctChars / userInput.length) * 100);
      setAccuracy(isNaN(newAccuracy) ? 100 : newAccuracy);
      
      // Calculate real-time WPM
      if (startTime) {
        const timeTakenMinutes = (Date.now() - startTime) / 60000;
        const words = userInput.split(/\s+/).length;
        const currentWpm = Math.round(words / timeTakenMinutes);
        setWpm(currentWpm);
      }

      // Check if user completed the code before time ran out
      if (userInput === code) {
        calculateResults();
        setFinished(true);
      }
    } else {
      setCharStatus([]);
      setAccuracy(100);
    }
  }, [userInput, code, startTime]);

  const calculateResults = () => {
    const end = Date.now();
    const timeTakenMinutes = (end - startTime) / 60000;
    const words = userInput.split(/\s+/).length;
    const finalWpm = Math.round(words / timeTakenMinutes);
    const correctChars = [...userInput].filter((ch, i) => ch === code[i]).length;
    const finalAccuracy = Math.round((correctChars / userInput.length) * 100);

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
  };

  const fetchSnippet = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axiosInstance.post(`/breakzone/typing-test`, { language });

      setCode(res.data.code);
      setUserInput("");
      setStartTime(null);
      setFinished(false);
      setWpm(0);
      setAccuracy(100);
      setTimeLeft(TIME_LIMIT);
      setProgress(0);
    } catch (err) {
      console.error(err);
      setApiError('API is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (value, event) => {
    setUserInput(value);
    
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleStartTest = () => {
    fetchSnippet();
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getEditorLanguage = () => {
    switch(language) {
      case "C++": return "cpp";
      case "C#": return "csharp";
      case "Java": return "java";
      case "Python": return "python";
      case "Ruby": return "ruby";
      case "TypeScript": return "typescript";
      case "Go": return "go";
      default: return "javascript";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6 flex flex-col items-center justify-start relative">
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
                  rotate: [0, 10, -10, 0]
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  Typing Test Rules
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
                    <span className="text-teal-400 mr-2 mt-1">•</span>
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
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium"
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
        className="w-full max-w-4xl flex flex-col items-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mt-6 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          ⚡ Typing Speed Test
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-6 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Type the code within {TIME_LIMIT} seconds!
        </motion.p>

        {/* Time Progress Bar */}
        {(startTime || finished) && (
          <div className="w-full max-w-2xl mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-teal-400">
                Time Remaining: {formatTime(timeLeft)}
              </span>
              <span className="text-sm font-medium text-gray-400">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: "100%" }}
                animate={{ width: `${100 - progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {(startTime || finished) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-gray-900/50 rounded-lg p-3 mb-4 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <div className="text-sm text-gray-400">Time</div>
              <div className="text-xl font-mono font-bold text-teal-400">
                {formatTime(TIME_LIMIT - timeLeft)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Speed</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {wpm} <span className="text-sm">WPM</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Accuracy</div>
              <div className={`text-xl font-mono font-bold ${
                accuracy > 90 ? 'text-green-400' : 
                accuracy > 70 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {accuracy}%
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4 items-center mb-8">
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{language}</span>
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
                  {languageOptions.map((lang) => (
                    <motion.li
                      key={lang}
                      whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {lang}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleStartTest}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-lg font-medium ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              code ? "Restart Test" : "Start Test"
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex justify-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                <p className="text-gray-400">AI is generating your code snippet...</p>
              </div>
            </motion.div>
          ) : code ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-6"
            >
              <div className="relative">
                <div className="absolute top-2 right-2 bg-gray-800 text-teal-400 text-xs px-2 py-1 rounded">
                  {language}
                </div>
                <pre className="bg-gray-900 p-6 rounded-lg border border-gray-700 overflow-x-auto text-sm md:text-base font-mono whitespace-pre-wrap">
                  {code}
                </pre>
              </div>

              <div className="relative h-64">
                <Editor
                  height="100%"
                  defaultLanguage={getEditorLanguage()}
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
                    quickSuggestions: true,
                    suggest: {
                      snippetsPreventQuickSuggestions: false,
                      showWords: true,
                      showSnippets: true
                    }
                  }}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  value={userInput}
                />
              </div>

              {charStatus.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 font-mono text-sm md:text-base whitespace-pre-wrap">
                  {charStatus.map((char, index) => (
                    <span
                      key={index}
                      className={`
                        ${char.correct ? 'text-green-400' : 'text-red-400'}
                        ${char.extra ? 'bg-red-900/50' : ''}
                        transition-colors duration-100
                      `}
                    >
                      {char.char}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center"
            >
              <p className="text-gray-400">Select a language and click "Start Test" to begin</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl border border-emerald-700/50 text-center max-w-md w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="text-4xl mb-4"
              >
                {accuracy > 70 ? "🎉" : "😅"}
              </motion.div>
              <h3 className="text-xl font-bold mb-4">
                {accuracy > 70 ? "Great Job!" : "Keep Practicing!"}
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-teal-400">{formatTime(TIME_LIMIT - timeLeft)}</div>
                  <div className="text-xs text-gray-400">TIME</div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">{wpm}</div>
                  <div className="text-xs text-gray-400">WPM</div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <div className={`text-2xl font-bold ${
                    accuracy > 90 ? 'text-green-400' : 
                    accuracy > 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {accuracy}%
                  </div>
                  <div className="text-xs text-gray-400">ACCURACY</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      accuracy > 90 ? 'bg-green-500' : 
                      accuracy > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <motion.button
                onClick={handleStartTest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium w-full"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}