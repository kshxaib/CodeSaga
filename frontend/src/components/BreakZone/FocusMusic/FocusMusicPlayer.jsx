import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FocusMusicPlayer = () => {
  const [query, setQuery] = useState("lofi coding");
  const [results, setResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeCategory, setActiveCategory] = useState("lofi");
  const audioRef = React.useRef(null);

  const categories = [
    { id: "lofi", name: "🎧 Lofi Coding", query: "lofi coding" },
    { id: "classical", name: "🎻 Classical Code", query: "classical coding" },
    { id: "nature", name: "🌿 Nature Sounds", query: "nature sounds coding" },
    { id: "electronic", name: "⚡ Electronic Focus", query: "electronic focus" },
    { id: "jazz", name: "🎷 Jazz Programming", query: "jazz coding" },
    { id: "ambient", name: "🌀 Ambient Coding", query: "ambient coding" }
  ];

  const presetPlaylists = {
  lofi: [
    { 
      title: "Chill Coding Session", 
      user: { name: "Lofi Vibes" },
      stream_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/J5Q9X9N.jpg"
    },
    { 
      title: "Late Night Coding", 
      user: { name: "Code & Coffee" },
      stream_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/3ZQ9X9N.jpg"
    }
  ],
  classical: [
    { 
      title: "Mozart for Programmers", 
      user: { name: "Classical Coders" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lee_Rosevere/10_Music_For_Podcasts/Lee_Rosevere_-_03_-_More_On_That_Later.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/4ZQ9X9N.jpg"
    },
    { 
      title: "Bach Coding Session", 
      user: { name: "Baroque Bytes" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Dee_Yan-Key/Bach/Dee_Yan-Key_-_01_-_Bach_Prelude_in_C_Major_BWV_846.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/5ZQ9X9N.jpg"
    }
  ],
  nature: [
    { 
      title: "Forest Coding", 
      user: { name: "Nature Sounds" },
      stream_url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_21147e2a2a.mp3?filename=relaxing-nature-sounds-forest-stream-birds-5417.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/6ZQ9X9N.jpg"
    },
    { 
      title: "Ocean Waves", 
      user: { name: "Beach Coders" },
      stream_url: "https://cdn.pixabay.com/download/audio/2021/10/23/audio_73fce87b75.mp3?filename=beach-waves-ambient-8967.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/7ZQ9X9N.jpg"
    }
  ],
  electronic: [
    { 
      title: "Deep Focus", 
      user: { name: "Electronic Flow" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Saw_Squared/Coding_Beats/Saw_Squared_-_01_-_Pixel_Lounge.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/8ZQ9X9N.jpg"
    },
    { 
      title: "Synthwave Coding", 
      user: { name: "Retro Coders" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Saw_Squared/Coding_Beats/Saw_Squared_-_06_-_Cosmic_Analog.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/9ZQ9X9N.jpg"
    }
  ],
  jazz: [
    { 
      title: "Jazz for Developers", 
      user: { name: "Smooth Coders" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Unheard_Music/Kevin_MacLeod_-_Bossa_Antigua.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/AZQ9X9N.jpg"
    },
    { 
      title: "Coffee Shop Jazz", 
      user: { name: "Java Jazz" },
      stream_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Dee_Yan-Key/Cafe_Bar/Cafe_Bar_-_04_-_Jazz_Lounge.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/BZQ9X9N.jpg"
    }
  ],
  ambient: [
    { 
      title: "Space Coding", 
      user: { name: "Cosmic Coders" },
      stream_url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_fa2e15bfe0.mp3?filename=ambient-cyber-sci-fi-music-2080.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/CZQ9X9N.jpg"
    },
    { 
      title: "Ambient Programming", 
      user: { name: "Dream Coders" },
      stream_url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_682439c57a.mp3?filename=deep-ambient-meditation-2079.mp3",
      duration: 3600,
      cover: "https://i.imgur.com/DZQ9X9N.jpg"
    }
  ]
};


  const searchTracks = async () => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        setResults(presetPlaylists[activeCategory] || []);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTracks();
  }, [activeCategory]);

  useEffect(() => {
    // Handle play/pause when isPlaying changes
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, selectedTrack]);

  const handlePlay = (track) => {
    // If same track is clicked, just toggle play/pause
    if (selectedTrack?.title === track.title) {
      togglePlay();
      return;
    }
    
    setSelectedTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
    setDuration(e.target.duration || 0);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Background playback support
  useEffect(() => {
    const handleWindowBlur = () => {
      // Keep playing when window loses focus
    };

    const handleWindowFocus = () => {
      // Resume playback if needed
      if (isPlaying && audioRef.current?.paused) {
        audioRef.current.play().catch(console.error);
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isPlaying]);

  return (
    <div className="min-w-screen  bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-2xl text-white max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
          🎵 Focus Music Player
        </h2>
        <p className="text-gray-400">Boost your coding productivity with curated music</p>
      </motion.div>

      {/* Category Selector */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.id
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => {
              setActiveCategory(category.id);
              setQuery(category.query);
            }}
          >
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search music (e.g., lofi, chill, jazz)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
        />
        <motion.button
          onClick={searchTracks}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium flex items-center gap-2"
        >
          <span>🔍</span>
          <span>Search</span>
        </motion.button>
      </motion.div>

      {/* Now Playing */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={selectedTrack.cover} 
                alt="Track cover" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 w-full">
              <h3 className="text-2xl font-bold mb-1">{selectedTrack.title}</h3>
              <p className="text-gray-400 mb-4">{selectedTrack.user?.name}</p>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <span className="text-xl">⏸️</span>
                    ) : (
                      <span className="text-xl">▶️</span>
                    )}
                  </motion.button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🔈</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-700 rounded-lg"
                  >
                    <span className="text-xl">🔁</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-700 rounded-lg"
                  >
                    <span className="text-xl">🔀</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio element */}
          <audio
            ref={audioRef}
            src={selectedTrack.stream_url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error("Audio error:", e.target.error);
              setIsPlaying(false);
            }}
            loop
          />
        </motion.div>
      )}

      {/* Track List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"
            />
          </div>
        ) : results.length > 0 ? (
          results.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePlay(track)}
              className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                selectedTrack?.title === track.title
                  ? "bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-700/50"
                  : "bg-gray-700/50 hover:bg-gray-700/70"
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={track.cover} 
                  alt="Track cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{track.title}</h4>
                <p className="text-sm text-gray-400">{track.user?.name}</p>
              </div>
              <div className="text-gray-400 text-sm">
                {formatTime("rack.duration")}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            No tracks found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMusicPlayer;