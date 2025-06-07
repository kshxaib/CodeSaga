import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Programming", emoji: "💻", color: "from-purple-600 to-indigo-600" },
  { name: "Misc", emoji: "🎭", color: "from-cyan-600 to-blue-600" },
  { name: "Pun", emoji: "😂", color: "from-amber-500 to-orange-500" },
  { name: "Dark", emoji: "🖤", color: "from-gray-600 to-gray-800" },
  { name: "Spooky", emoji: "👻", color: "from-violet-500 to-purple-500" },
];

export default function DevHumors() {
  const [joke, setJoke] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const safe = category.name === "Dark" ? "" : "&safe-mode";
      const { data } = await axios.get(
        `https://v2.jokeapi.dev/joke/${category.name}?type=twopart${safe}`
      );
      if (data.error) {
        throw new Error(data.message);
      }
      setJoke(data);
      setShowExplanation(false);
    } catch (err) {
      console.error("Error fetching joke:", err.message);
      setError("Failed to load joke. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!joke) return;
    
    const jokeKey = `${joke.setup}-${joke.delivery}`;
    if (favorites.some(fav => `${fav.setup}-${fav.delivery}` === jokeKey)) {
      setFavorites(favorites.filter(fav => `${fav.setup}-${fav.delivery}` !== jokeKey));
    } else {
      setFavorites([...favorites, joke]);
    }
  };

  const fetchExplanation = async () => {
    if (!joke) return;
    
    setLoading(true);
    try {
      const explanation = await new Promise(resolve => {
        setTimeout(() => {
          resolve(`This joke plays on the common experience of programmers. The setup "${joke.setup}" sets up a scenario that resonates with developers, and the punchline "${joke.delivery}" delivers a humorous twist based on technical concepts. It's funny because...`);
        }, 1000);
      });
      setAiExplanation(explanation);
      setShowExplanation(true);
    } catch (err) {
      console.error("Error fetching explanation:", err);
      setError("Failed to get explanation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-xl text-gray-400">
            Laugh your way through programming jokes and puns
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-xl text-lg font-medium transition-all flex items-center gap-2 ${
                category.name === cat.name
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setCategory(cat)}
            >
              <span className="text-xl">{cat.emoji}</span>
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 p-4 rounded-lg mb-6 flex items-start"
            >
              <span className="text-xl mr-3">⚠️</span>
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : joke ? (
            <>
              {/* Joke Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${category.color} p-8 rounded-2xl shadow-lg mb-8 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xs" />
                <div className="relative z-10">
                  <p className="text-2xl md:text-3xl font-medium mb-6 text-center">
                    {joke.setup}
                  </p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-center"
                  >
                    {joke.delivery}
                  </motion.p>
                </div>
                <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {category.emoji}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <motion.button
                  onClick={fetchJoke}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl font-medium text-lg"
                >
                  <span className="text-2xl">🔁</span> 
                  <span>New Joke</span>
                </motion.button>

                <motion.button
                  onClick={toggleFavorite}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-lg ${
                    favorites.some(fav => 
                      fav.setup === joke.setup && fav.delivery === joke.delivery
                    )
                      ? "bg-gradient-to-r from-yellow-600 to-amber-600"
                      : "bg-gradient-to-r from-gray-700 to-gray-600"
                  }`}
                >
                  <span className="text-2xl">⭐</span> 
                  <span>
                    {favorites.some(fav => 
                      fav.setup === joke.setup && fav.delivery === joke.delivery
                    ) ? "Favorited" : "Favorite"}
                  </span>
                </motion.button>

                <motion.button
                  onClick={fetchExplanation}
                  disabled={showExplanation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-lg ${
                    showExplanation
                      ? "bg-gradient-to-r from-purple-700 to-blue-700"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  }`}
                >
                  <span className="text-2xl">🤖</span> 
                  <span>Explain Joke</span>
                </motion.button>
              </div>

              {/* AI Explanation */}
              <AnimatePresence>
                {showExplanation && aiExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 mb-8 overflow-hidden"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 p-3 rounded-xl mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-blue-300">AI Explanation</h3>
                    </div>
                    <p className="text-lg whitespace-pre-wrap text-blue-300">{aiExplanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-xl">No joke loaded. Try refreshing.</p>
            </div>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mt-12">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 justify-center">
                <span className="text-4xl">⭐</span> 
                <span>Your Favorite Jokes</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((favJoke, index) => (
                  <motion.div
                    key={`${favJoke.setup}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 p-6 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition-colors"
                  >
                    <p className="text-xl mb-3 font-medium">{favJoke.setup}</p>
                    <p className="text-xl font-semibold text-amber-300">{favJoke.delivery}</p>
                    <button
                      onClick={() => setFavorites(favorites.filter((_, i) => i !== index))}
                      className="mt-4 text-sm text-amber-200 hover:text-white flex items-center gap-2"
                    >
                      <span className="text-lg">✕</span> 
                      <span>Remove from favorites</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Static Joke Examples */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 justify-center">
              <span className="text-4xl">🎭</span>
              <span>Classic Dev Jokes</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  setup: "Why do programmers prefer dark mode?",
                  delivery: "Because light attracts bugs!",
                  category: "Programming"
                },
                {
                  setup: "How many programmers does it take to change a light bulb?",
                  delivery: "None, that's a hardware problem!",
                  category: "Programming"
                },
                {
                  setup: "Why do Java developers wear glasses?",
                  delivery: "Because they can't C#!",
                  category: "Programming"
                },
                {
                  setup: "What's a programmer's favorite drink?",
                  delivery: "Java!",
                  category: "Pun"
                }
              ].map((staticJoke, index) => (
                <motion.div
                  key={`static-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setJoke(staticJoke);
                    setShowExplanation(false);
                  }}
                >
                  <p className="text-xl mb-3 font-medium text-blue-300">{staticJoke.setup}</p>
                  <p className="text-xl font-semibold text-purple-300">{staticJoke.delivery}</p>
                  <span className="text-sm text-gray-400 mt-3 block">
                    Category: {staticJoke.category}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}