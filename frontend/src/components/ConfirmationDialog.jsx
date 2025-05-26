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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-700 w-full max-w-md overflow-hidden">
        {title && (
          <div className="border-b border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}

        <div className="px-6 py-5 text-sm text-gray-300">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>

        <div className="border-t border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-4 py-2 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-md transition-colors flex items-center justify-center min-w-20"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
