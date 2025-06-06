import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react';

const ConfirmationDialog = ({
  loading,
  isOpen,
  onClose,
  title,
  content,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-700 w-full max-w-md overflow-hidden"
          >
            {title && (
              <div className="border-b border-gray-700 px-6 py-4">
                <motion.h3 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-semibold"
                >
                  {title}
                </motion.h3>
              </div>
            )}

            <div className="px-6 py-5 text-sm text-gray-300">
              {typeof content === 'string' ? <p>{content}</p> : content}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-t border-gray-700 px-6 py-4 flex justify-end space-x-3"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                disabled={loading}
                className="cursor-pointer px-4 py-2 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                disabled={loading}
                className="cursor-pointer px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-md transition-colors flex items-center justify-center min-w-20"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : confirmText}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;