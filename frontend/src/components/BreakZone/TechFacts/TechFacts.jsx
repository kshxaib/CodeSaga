import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../../libs/axios';

const TechFacts = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/breakzone/daily-facts');
        console.log('Fetched facts response.data.facts:', response.data.facts);
        setFacts(response.data.facts);
        
        // Set last updated time
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Failed to load facts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();

    // Check if we need to refresh (after 8 AM)
    const now = new Date();
    const hours = now.getHours();
    const isAfter8AM = hours >= 8;
    
    // If it's after 8 AM, set a timer to refresh at next 8 AM
    if (isAfter8AM) {
      const next8AM = new Date();
      next8AM.setDate(next8AM.getDate() + 1);
      next8AM.setHours(8, 0, 0, 0);
      
      const timeUntilNext8AM = next8AM - now;
      const refreshTimer = setTimeout(fetchFacts, timeUntilNext8AM);
      
      return () => clearTimeout(refreshTimer);
    } else {
      // If it's before 8 AM, set timer for today's 8 AM
      const today8AM = new Date();
      today8AM.setHours(8, 0, 0, 0);
      
      const timeUntil8AM = today8AM - now;
      const refreshTimer = setTimeout(fetchFacts, timeUntil8AM);
      
      return () => clearTimeout(refreshTimer);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-6 rounded-3xl shadow-2xl max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
          🌟 Daily Tech Facts
        </h2>
        <p className="text-indigo-200">
          Fresh knowledge served daily at 8 AM
          {lastUpdated && (
            <span className="text-indigo-300 text-sm ml-2">
              (Last updated: {lastUpdated})
            </span>
          )}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <motion.ul className="space-y-4">
          <AnimatePresence>
            {facts.map((fact, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-start">
                  <span className="text-amber-400 mr-3 text-lg">{index + 1}.</span>
                  <p className="text-indigo-50 flex-1">{fact}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <motion.div 
        className="mt-6 text-center text-indigo-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>New facts automatically update every day at 8 AM</p>
      </motion.div>
    </div>
  );
};

export default TechFacts;