import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Send, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useDiscussionStore } from "../../store/useDiscussionStore";

const DiscussionSection = ({ problemId }) => {
  const { authUser: currentUser } = useAuthStore();
  const {
    messages,
    isLoading,
    isSending,
    replyingTo,
    initializeSocket,
    sendMessage,
    sendReply,
    upvoteMessage,
    isUpvoted,
    isCurrentUserMessage,
    setReplyingTo,
    setMessagesEndRef,
    setMessagesContainerRef,
    scrollToBottom,
    setAutoScroll
  } = useDiscussionStore();
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    setMessagesEndRef(messagesEndRef);
    setMessagesContainerRef(messagesContainerRef);
    const cleanup = initializeSocket(problemId, currentUser);
    return cleanup;
  }, [problemId, initializeSocket, currentUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessage(newMessage, problemId);
    setNewMessage("");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    sendReply(replyContent, replyingTo);
    setReplyContent("");
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setAutoScroll(isNearBottom);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-800/80 rounded-lg border border-purple-500/30">
        <div className="h-12 w-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-h-screen flex flex-col h-full bg-gray-800/80 rounded-lg border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-purple-500/30 bg-gradient-to-r from-blue-900/30 to-purple-900/30 sticky top-0 z-10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Discussion</h3>
        <span className="badge bg-gray-700 text-purple-400 border border-purple-500/30">
          {messages.length}
        </span>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No discussions yet. Be the first to start!
          </div>
        ) : (
          messages.map((message) => {
            console.log("message: ",message);
            return (
            <div 
              key={message.id} 
              className={`flex ${isCurrentUserMessage(message.userId) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`rounded-lg border ${message.isTemp ? 'border-gray-600' : 'border-purple-500/30'} p-4 ${isCurrentUserMessage(message.userId) ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'bg-gray-800'} ${message.isTemp ? 'opacity-70' : ''} max-w-[80%]`}>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={message.user.image || "https://placehold.co/100"}
                          alt={message.user.username}
                          className="bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold truncate text-gray-100">
                        {message.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                      {message.isTemp && <span className="text-xs text-gray-500">(sending...)</span>}
                    </div>
                    
                    <p className="mt-2 whitespace-pre-wrap text-gray-300">{message.content}</p>

                    <div className="flex gap-4 mt-3">
                      <button
                        className={`flex items-center gap-1 text-sm cursor-pointer ${
                          isUpvoted(message) ? "text-purple-400" : "text-gray-500 hover:text-purple-400"
                        }`}
                        onClick={() => upvoteMessage(message.id)}
                        disabled={!currentUser || message.isTemp}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{message.upvotes?.length || 0}</span>
                      </button>
                      {currentUser && (
                        <button
                          className={`flex items-center gap-1 text-sm cursor-pointer ${
                            replyingTo === message.id ? "text-blue-400" : "text-gray-500 hover:text-blue-400"
                          }`}
                          onClick={() =>
                            setReplyingTo(replyingTo === message.id ? null : message.id)
                          }
                          disabled={message.isTemp}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{message.replies?.length || 0}</span>
                        </button>
                      )}
                    </div>

                    {message.replies?.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-purple-500/30">
                        {message.replies.map((reply) => (
                          <div 
                            key={reply.id} 
                            className={`flex gap-3 ${reply.isTemp ? 'opacity-70' : ''}`}
                          >
                            <div className="flex-shrink-0">
                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img
                                    src={reply.user.image || "https://placehold.co/80"}
                                    alt={reply.user.username}
                                    className="bg-gray-700"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm truncate text-gray-100">
                                  {reply.user.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                                {reply.isTemp && <span className="text-xs text-gray-500">(sending...)</span>}
                              </div>
                              {reply.replyingToUsername && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Replying to: {reply.replyingToUsername}
                                </div>
                              )}
                              <p className="text-sm mt-1 whitespace-pre-wrap text-gray-300">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )})
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 sticky bottom-0">
        {replyingTo ? (
          <form onSubmit={handleSendReply} className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Replying to: {messages.find(m => m.id === replyingTo)?.user?.username}
              </span>
              <button
                type="button"
                className="btn btn-circle btn-xs cursor-pointer text-gray-400 hover:text-gray-300"
                onClick={() => setReplyingTo(null)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1 bg-gray-700 border-purple-500/30 text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-gray-100"
                disabled={!replyContent.trim() || isSending}
              >
                {isSending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        ) : currentUser ? (
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="input w-full bg-gray-700 border-purple-500/30 text-gray-300 pr-12 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Ask a question or share your thoughts..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-400 hover:text-purple-300"
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert bg-gray-700 text-gray-300 border border-purple-500/30">
            <Link to="/login" className="link text-purple-400 hover:text-purple-300 cursor-pointer">
              Please login
            </Link>{" "}
            to participate in the discussion
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionSection;