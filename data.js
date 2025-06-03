 const tabs = [
    { id: "games", name: "🎮 Coding Games", color: "from-purple-600 to-indigo-600" },
    { id: "puzzles", name: "🧩 Brain Teasers", color: "from-cyan-600 to-blue-600"},
    { id: "jokes", name: "😂 Dev Humor", color: "from-amber-500 to-orange-500" },
    { id: "music", name: "🎵 Focus Music", color: "from-emerald-500 to-teal-500" },
    { id: "facts", name: "🤓 Tech Facts", color: "from-rose-500 to-pink-500", },
    { id: "daily", name: "📅 Daily Challenge", color: "from-violet-500 to-purple-500" },
  ];

  const contentItems = {
    games: [
      { 
        name: "Guess the Output", 
        desc: "Predict code execution results",
        to: "/games/guess-output",
        emoji: "🔍💻",
        color: "from-purple-600 to-indigo-600",
        animation: { rotate: [0, -5, 5, -5, 0] }
      },
      { 
        name: "Regex Rush", 
        desc: "Race against time to match patterns",
        to: "/games/regex-rush",
        emoji: "⏱️.*",
        color: "from-amber-600 to-orange-600",
        animation: { scale: [1, 1.05, 1] }
      },
      { 
        name: "Typing Speed Test", 
        desc: "Code as fast as you can",
        to: "/games/typing-test",
        emoji: "⌨️⚡",
        color: "from-emerald-600 to-teal-600",
        animation: { y: [0, -5, 0] }
      },
      { 
        name: "Bug Hunt", 
        desc: "Find and fix code errors",
        to: "/games/bug-hunt",
        emoji: "🐛🔫",
        color: "from-rose-600 to-pink-600",
        animation: { x: [0, -5, 5, 0] }
      },
      { 
        name: "Binary Clicker", 
        desc: "Incremental game with binary numbers",
        to: "/games/binary-clicker",
        emoji: "🔢⚡",
        color: "from-blue-600 to-cyan-600",
        animation: { scale: [1, 1.1, 1] }
      },
      { 
        name: "Shortcut Ninja", 
        desc: "Master IDE keyboard shortcuts",
        to: "/games/shortcut-ninja",
        emoji: "🥋⌨️",
        color: "from-green-600 to-lime-600",
        animation: { rotateY: [0, 180, 0] }
      },
      { 
        name: "Emoji Pictionary", 
        desc: "Guess coding terms from emojis",
        to: "/games/emoji-pictionary",
        emoji: "🎨🤔",
        color: "from-red-600 to-pink-600",
        animation: { scale: [1, 0.95, 1] }
      },
      { 
        name: "Code Golf", 
        desc: "Solve problems with fewest characters",
        to: "#",
        emoji: "🏌️‍♂️⛳",
        color: "from-yellow-600 to-amber-600",
        animation: { y: [0, -10, 0] }
      }
    ],
    puzzles: [
      { 
        name: "Rope Burning", 
        desc: "Measure time with burning ropes",
        to: "/puzzles/rope-burning",
        emoji: "🕯️⏱️",
        color: "from-cyan-600 to-blue-600",
        animation: { rotate: [0, 5, -5, 0] }
      },
      { 
        name: "River Crossing", 
        desc: "Get all entities across safely",
        to: "/puzzles/river-crossing",
        emoji: "🌊🚣",
        color: "from-sky-500 to-cyan-500",
        animation: { y: [0, -3, 0] }
      },
      { 
        name: "Einstein's Riddle", 
        desc: "Who owns the fish?",
        to: "/puzzles/einstein-riddle",
        emoji: "🧠🐟",
        color: "from-blue-500 to-indigo-500",
        animation: { scale: [1, 1.03, 1] }
      },
      { 
        name: "Sudoku Pro", 
        desc: "Advanced number placement",
        to: "",
        emoji: "🔢🧩",
        color: "from-indigo-500 to-violet-500",
        animation: { rotateZ: [0, 2, -2, 0] }
      },
      { 
        name: "Tower of Hanoi", 
        desc: "Classic recursive puzzle",
        to: "#",
        emoji: "🗼➡️",
        color: "from-purple-500 to-fuchsia-500",
        animation: { x: [0, 3, -3, 0] }
      },
      { 
        name: "Chess Puzzle", 
        desc: "Checkmate in 2 moves",
        to: "#",
        emoji: "♟️#",
        color: "from-fuchsia-500 to-pink-500",
        animation: { y: [0, -5, 0] }
      },
      { 
        name: "Logic Grid", 
        desc: "Deduce the solution",
        to: "#",
        emoji: "📊✔️",
        color: "from-pink-500 to-rose-500",
        animation: { scale: [1, 1.05, 1] }
      },
      { 
        name: "Math Paradox", 
        desc: "Seemingly impossible solutions",
        to: "#",
        emoji: "∞🤯",
        color: "from-rose-500 to-red-500",
        animation: { rotate: [0, 180, 360] }
      }
    ],
    facts: [
      { 
        name: "First Bug", 
        desc: "Actual moth found in 1947",
        to: "/facts/first-bug",
        emoji: "🐛🖥️",
        color: "from-rose-500 to-pink-500",
        animation: { y: [0, -5, 0] }
      },
      { 
        name: "QWERTY", 
        desc: "Designed to slow typists",
        to: "/facts/qwerty",
        emoji: "⌨️🐢",
        color: "from-pink-500 to-fuchsia-500",
        animation: { rotate: [0, 5, -5, 0] }
      },
      { 
        name: "Ada Lovelace", 
        desc: "First programmer (1843)",
        to: "/facts/ada-lovelace",
        emoji: "👩‍💻1️⃣",
        color: "from-fuchsia-500 to-purple-500",
        animation: { scale: [1, 1.05, 1] }
      },
      { 
        name: "Google", 
        desc: "Misspelling of 'googol'",
        to: "/facts/google",
        emoji: "🔍❌",
        color: "from-purple-500 to-violet-500",
        animation: { x: [0, 3, -3, 0] }
      },
      { 
        name: "First Computer", 
        desc: "ENIAC weighed 27 tons",
        to: "/facts/first-computer",
        emoji: "🏋️‍♂️💻",
        color: "from-violet-500 to-indigo-500",
        animation: { rotateZ: [0, 5, -5, 0] }
      },
      { 
        name: "First Website", 
        desc: "Still online at info.cern.ch",
        to: "/facts/first-website",
        emoji: "🌐1️⃣",
        color: "from-indigo-500 to-blue-500",
        animation: { scale: [1, 1.03, 1] }
      },
      { 
        name: "Spacebar", 
        desc: "Most used keyboard key",
        to: "/facts/spacebar",
        emoji: "␣🏆",
        color: "from-blue-500 to-cyan-500",
        animation: { y: [0, -3, 0] }
      },
      { 
        name: "Unicode", 
        desc: "Over 140,000 characters",
        to: "/facts/unicode",
        emoji: "🔣∞",
        color: "from-cyan-500 to-teal-500",
        animation: { rotate: [0, 360] }
      }
    ],
    daily: [
      { 
        name: "Riddle", 
        question: "I speak without a mouth...",
        answer: "An echo",
        to: "/daily/riddle",
        emoji: "🗣️👻",
        color: "from-violet-500 to-purple-500",
        animation: { opacity: [1, 0.8, 1] }
      },
      { 
        name: "Logic Puzzle", 
        question: "Two doors, one truth-teller...",
        answer: "Ask either guard what the other would say",
        to: "/daily/logic-puzzle",
        emoji: "🚪🤔",
        color: "from-indigo-500 to-blue-500",
        animation: { rotate: [0, 5, -5, 0] }
      },
      { 
        name: "Math Challenge", 
        question: "8, 5, 4, 9, 1, 7, ?",
        answer: "6 (alphabetical order)",
        to: "/daily/math-challenge",
        emoji: "🔢📊",
        color: "from-blue-500 to-cyan-500",
        animation: { scale: [1, 1.05, 1] }
      },
      { 
        name: "Lateral Thinking", 
        question: "Man lives on 10th floor...",
        answer: "He's a dwarf",
        to: "/daily/lateral-thinking",
        emoji: "🧒🏢",
        color: "from-cyan-500 to-teal-500",
        animation: { y: [0, -5, 0] }
      },
      { 
        name: "Code Puzzle", 
        question: "What does this Python code output?",
        answer: "Surprising result!",
        to: "/daily/code-puzzle",
        emoji: "🐍❓",
        color: "from-teal-500 to-emerald-500",
        animation: { rotate: [0, 360] }
      },
      { 
        name: "Algorithm Challenge", 
        question: "Most efficient sorting for nearly sorted data?",
        answer: "Insertion Sort",
        to: "/daily/algorithm-challenge",
        emoji: "📊⚡",
        color: "from-emerald-500 to-green-500",
        animation: { scale: [1, 1.1, 1] }
      },
      { 
        name: "Regex Test", 
        question: "Pattern to match valid emails?",
        answer: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
        to: "/daily/regex-test",
        emoji: "📧.*",
        color: "from-green-500 to-lime-500",
        animation: { x: [0, 5, -5, 0] }
      },
      { 
        name: "System Design", 
        question: "Design a URL shortener",
        answer: "Base62 encoding, distributed counter",
        to: "/daily/system-design",
        emoji: "🔗✂️",
        color: "from-lime-500 to-yellow-500",
        animation: { rotateY: [0, 180, 0] }
      }
    ]
  };