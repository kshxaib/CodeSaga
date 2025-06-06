import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import DevHumor from "./DevHumor/DevHumors";
import FocusMusicPlayer from "./FocusMusic/FocusMusicPlayer";
import TechFacts from "./TechFacts/TechFacts";

const BreakZone = () => {
  const [activeTab, setActiveTab] = useState("games");

  const tabs = [
    {
      id: "games",
      name: "🎮 Coding Games",
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: "puzzles",
      name: "🧩 Brain Teasers",
      color: "from-cyan-600 to-blue-600",
    },
    {
      id: "jokes",
      name: "😂 Dev Humor",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "music",
      name: "🎵 Focus Music",
      color: "from-emerald-500 to-teal-500",
    },
    { id: "facts", name: "🤓 Tech Facts", color: "from-rose-500 to-pink-500" },
    {
      id: "daily",
      name: "📅 Daily Challenge",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const contentItems = {
    games: [
      {
        name: "Guess the Output",
        desc: "Predict code execution results",
        to: "/games/guess-output",
        emoji: "🔍💻",
        color: "from-purple-600 to-indigo-600",
        animation: { rotate: [0, -5, 5, -5, 0] },
      },
      {
        name: "Regex Rush",
        desc: "Race against time to match patterns",
        to: "/games/regex-rush",
        emoji: "⏱️.*",
        color: "from-amber-600 to-orange-600",
        animation: { scale: [1, 1.05, 1] },
      },
      {
        name: "Typing Speed Test",
        desc: "Code as fast as you can",
        to: "/games/typing-test",
        emoji: "⌨️⚡",
        color: "from-emerald-600 to-teal-600",
        animation: { y: [0, -5, 0] },
      },
      {
        name: "Bug Hunt",
        desc: "Find and fix code errors",
        to: "/games/bug-hunt",
        emoji: "🐛🔫",
        color: "from-rose-600 to-pink-600",
        animation: { x: [0, -5, 5, 0] },
      },
      {
        name: "Binary Clicker",
        desc: "Incremental game with binary numbers",
        to: "/games/binary-clicker",
        emoji: "🔢⚡",
        color: "from-blue-600 to-cyan-600",
        animation: { scale: [1, 1.1, 1] },
      },
      {
        name: "Shortcut Ninja",
        desc: "Master IDE keyboard shortcuts",
        to: "/games/shortcut-ninja",
        emoji: "🥋⌨️",
        color: "from-green-600 to-lime-600",
        animation: { rotateY: [0, 180, 0] },
      },
      {
        name: "Emoji Pictionary",
        desc: "Guess coding terms from emojis",
        to: "/games/emoji-pictionary",
        emoji: "🎨🤔",
        color: "from-red-600 to-pink-600",
        animation: { scale: [1, 0.95, 1] },
      },
      {
        name: "Code Golf",
        desc: "Solve problems with fewest characters",
        to: "#",
        emoji: "🏌️‍♂️⛳",
        color: "from-yellow-600 to-amber-600",
        animation: { y: [0, -10, 0] },
      },
    ],
    puzzles: [
      {
        name: "Rope Burning",
        desc: "Measure time with burning ropes",
        to: "/puzzles/rope-burning",
        emoji: "🕯️⏱️",
        color: "from-cyan-600 to-blue-600",
        animation: { rotate: [0, 5, -5, 0] },
      },
      {
        name: "River Crossing",
        desc: "Get all entities across safely",
        to: "/puzzles/river-crossing",
        emoji: "🌊🚣",
        color: "from-sky-500 to-cyan-500",
        animation: { y: [0, -3, 0] },
      },
      {
        name: "Einstein's Riddle",
        desc: "Who owns the fish?",
        to: "/puzzles/einstein-riddle",
        emoji: "🧠🐟",
        color: "from-blue-500 to-indigo-500",
        animation: { scale: [1, 1.03, 1] },
      },
      {
        name: "Sudoku Pro",
        desc: "Advanced number placement",
        to: "",
        emoji: "🔢🧩",
        color: "from-indigo-500 to-violet-500",
        animation: { rotateZ: [0, 2, -2, 0] },
      },
      {
        name: "Tower of Hanoi",
        desc: "Classic recursive puzzle",
        to: "#",
        emoji: "🗼➡️",
        color: "from-purple-500 to-fuchsia-500",
        animation: { x: [0, 3, -3, 0] },
      },
      {
        name: "Chess Puzzle",
        desc: "Checkmate in 2 moves",
        to: "#",
        emoji: "♟️#",
        color: "from-fuchsia-500 to-pink-500",
        animation: { y: [0, -5, 0] },
      },
      {
        name: "Logic Grid",
        desc: "Deduce the solution",
        to: "#",
        emoji: "📊✔️",
        color: "from-pink-500 to-rose-500",
        animation: { scale: [1, 1.05, 1] },
      },
      {
        name: "Math Paradox",
        desc: "Seemingly impossible solutions",
        to: "#",
        emoji: "∞🤯",
        color: "from-rose-500 to-red-500",
        animation: { rotate: [0, 180, 360] },
      },
    ],
    facts: [
      {
        name: "First Bug",
        desc: "Actual moth found in 1947",
        to: "/facts/first-bug",
        emoji: "🐛🖥️",
        color: "from-rose-500 to-pink-500",
        animation: { y: [0, -5, 0] },
      },
      {
        name: "QWERTY",
        desc: "Designed to slow typists",
        to: "/facts/qwerty",
        emoji: "⌨️🐢",
        color: "from-pink-500 to-fuchsia-500",
        animation: { rotate: [0, 5, -5, 0] },
      },
      {
        name: "Ada Lovelace",
        desc: "First programmer (1843)",
        to: "/facts/ada-lovelace",
        emoji: "👩‍💻1️⃣",
        color: "from-fuchsia-500 to-purple-500",
        animation: { scale: [1, 1.05, 1] },
      },
      {
        name: "Google",
        desc: "Misspelling of 'googol'",
        to: "/facts/google",
        emoji: "🔍❌",
        color: "from-purple-500 to-violet-500",
        animation: { x: [0, 3, -3, 0] },
      },
      {
        name: "First Computer",
        desc: "ENIAC weighed 27 tons",
        to: "/facts/first-computer",
        emoji: "🏋️‍♂️💻",
        color: "from-violet-500 to-indigo-500",
        animation: { rotateZ: [0, 5, -5, 0] },
      },
      {
        name: "First Website",
        desc: "Still online at info.cern.ch",
        to: "/facts/first-website",
        emoji: "🌐1️⃣",
        color: "from-indigo-500 to-blue-500",
        animation: { scale: [1, 1.03, 1] },
      },
      {
        name: "Spacebar",
        desc: "Most used keyboard key",
        to: "/facts/spacebar",
        emoji: "␣🏆",
        color: "from-blue-500 to-cyan-500",
        animation: { y: [0, -3, 0] },
      },
      {
        name: "Unicode",
        desc: "Over 140,000 characters",
        to: "/facts/unicode",
        emoji: "🔣∞",
        color: "from-cyan-500 to-teal-500",
        animation: { rotate: [0, 360] },
      },
    ],
    daily: [
      {
        name: "Riddle",
        question: "I speak without a mouth...",
        answer: "An echo",
        to: "/daily/riddle",
        emoji: "🗣️👻",
        color: "from-violet-500 to-purple-500",
        animation: { opacity: [1, 0.8, 1] },
      },
      {
        name: "Logic Puzzle",
        question: "Two doors, one truth-teller...",
        answer: "Ask either guard what the other would say",
        to: "/daily/logic-puzzle",
        emoji: "🚪🤔",
        color: "from-indigo-500 to-blue-500",
        animation: { rotate: [0, 5, -5, 0] },
      },
      {
        name: "Math Challenge",
        question: "8, 5, 4, 9, 1, 7, ?",
        answer: "6 (alphabetical order)",
        to: "/daily/math-challenge",
        emoji: "🔢📊",
        color: "from-blue-500 to-cyan-500",
        animation: { scale: [1, 1.05, 1] },
      },
      {
        name: "Lateral Thinking",
        question: "Man lives on 10th floor...",
        answer: "He's a dwarf",
        to: "/daily/lateral-thinking",
        emoji: "🧒🏢",
        color: "from-cyan-500 to-teal-500",
        animation: { y: [0, -5, 0] },
      },
      {
        name: "Code Puzzle",
        question: "What does this Python code output?",
        answer: "Surprising result!",
        to: "/daily/code-puzzle",
        emoji: "🐍❓",
        color: "from-teal-500 to-emerald-500",
        animation: { rotate: [0, 360] },
      },
      {
        name: "Algorithm Challenge",
        question: "Most efficient sorting for nearly sorted data?",
        answer: "Insertion Sort",
        to: "/daily/algorithm-challenge",
        emoji: "📊⚡",
        color: "from-emerald-500 to-green-500",
        animation: { scale: [1, 1.1, 1] },
      },
      {
        name: "Regex Test",
        question: "Pattern to match valid emails?",
        answer: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
        to: "/daily/regex-test",
        emoji: "📧.*",
        color: "from-green-500 to-lime-500",
        animation: { x: [0, 5, -5, 0] },
      },
      {
        name: "System Design",
        question: "Design a URL shortener",
        answer: "Base62 encoding, distributed counter",
        to: "/daily/system-design",
        emoji: "🔗✂️",
        color: "from-lime-500 to-yellow-500",
        animation: { rotateY: [0, 180, 0] },
      },
    ],
  };

  const renderContentCard = (item, index) => (
    <Link to={item.to} key={index}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          ...item.animation,
        }}
        transition={{
          delay: index * 0.1,
          repeat: Infinity,
          repeatDelay: 3,
          duration: 1.5,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
        className={`bg-gradient-to-r ${item.color} p-6 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer h-full relative overflow-hidden group`}
      >
        <div className="absolute -right-6 -top-6 text-7xl opacity-20 group-hover:opacity-30 transition-opacity">
          {item.emoji}
        </div>
        <h4 className="text-2xl font-bold text-white mb-2 relative z-10">
          {item.name}
        </h4>
        {item.desc && (
          <p className="text-white/80 text-lg relative z-10">{item.desc}</p>
        )}
        {item.question && (
          <>
            <p className="text-white/90 mb-3 italic relative z-10">
              "{item.question}"
            </p>
            <div className="relative z-10">
              <p className="text-white/70 text-sm">Answer:</p>
              <p className="text-white font-medium">{item.answer}</p>
            </div>
          </>
        )}
        <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Link>
  );

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-3"
          >
            Coder Break Zone
          </motion.h1>

          {/* Add this marquee/slider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="overflow-hidden max-w-2xl mx-auto mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/30 to-gray-900 z-10 pointer-events-none" />
              <motion.div
                animate={{
                  x: ["100%", "-100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="whitespace-nowrap text-sm text-amber-400 py-2"
              >
                <span className="inline-block px-2">
                  🚀 Powered by Gemini's free API
                </span>
                <span className="inline-block px-2">
                  ✨ Please enjoy this zone responsibly
                </span>
                <span className="inline-block px-2">
                  ⏳ API requests are rate-limited
                </span>
                <span className="inline-block px-2">
                  💡 Refresh at 8 AM for new daily facts
                </span>
                <span className="inline-block px-2">
                  🎉 Take breaks and have fun!
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Recharge with coding-themed fun activities
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex rounded-full bg-gray-800 p-1 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-lg ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 100 },
            }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
          >
            {activeTab === "jokes" ? (
              <DevHumor />
            ) : activeTab === "music" ? (
              <FocusMusicPlayer />
            ) : activeTab === "facts" ? (
              <TechFacts />
            ) : (
              <>
                <motion.h3
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
                >
                  {tabs.find((t) => t.id === activeTab)?.name}
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {
                      tabs
                        .find((t) => t.id === activeTab)
                        ?.name.match(/[\p{Emoji}]/gu)?.[0]
                    }
                  </motion.span>
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contentItems[activeTab]?.map((item, index) =>
                    renderContentCard(item, index)
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 text-center"
                >
                  <p className="text-gray-400 text-lg">
                    {activeTab === "games" &&
                      "More coding games coming soon! What would you like to see?"}
                    {activeTab === "puzzles" &&
                      "New puzzles added weekly! Can you solve them all?"}
                    {activeTab === "jokes" &&
                      "Got a good dev joke? Submit it to our collection!"}
                    {activeTab === "music" &&
                      "Suggest your favorite coding playlist!"}
                    {activeTab === "facts" && "New tech facts added daily!"}
                    {activeTab === "daily" &&
                      "Come back tomorrow for a fresh challenge!"}
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BreakZone;
