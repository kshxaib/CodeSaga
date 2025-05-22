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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        {title && (
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {typeof content === 'string' ? (
            <p className="text-gray-700">{content}</p>
          ) : (
            content
          )}
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-20"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;