import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Send, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const DiscussionSection = ({ problemId }) => {
  const { authUser: currentUser } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const tempMessageIds = useRef(new Set());

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io",
      withCredentials: true,
    });

    const handleConnect = () => {
      console.log("Socket connected");
      setSocket(newSocket);
      newSocket.emit("joinDiscussion", problemId);
    };

    const handleInitialMessages = (initialMessages) => {
      console.log("Received initial messages");
      setMessages(initialMessages);
      setIsLoading(false);
      scrollToBottom(false);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("initialMessages", handleInitialMessages);
    newSocket.on("newMessage", handleNewMessage);
    newSocket.on("newReply", handleNewReply);
    newSocket.on("messageUpdated", handleMessageUpdated);
    newSocket.on("connect_error", handleConnectionError);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("initialMessages", handleInitialMessages);
      newSocket.off("newMessage", handleNewMessage);
      newSocket.off("newReply", handleNewReply);
      newSocket.off("messageUpdated", handleMessageUpdated);
      newSocket.off("connect_error", handleConnectionError);
      newSocket.disconnect();
    };
  }, [problemId]);

  // Socket event handlers
  const handleNewMessage = (message) => {
    if (tempMessageIds.current.has(message.id)) return;
    
    setMessages((prev) => {
      const exists = prev.some(m => m.id === message.id);
      return exists ? prev : [...prev, message];
    });
    
    if (autoScroll) scrollToBottom(true);
  };

  const handleNewReply = (reply) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== reply.messageId) return msg;
        
        const replyExists = msg.replies?.some(r => r.id === reply.id) || false;
        if (replyExists) return msg;
        
        return {
          ...msg,
          replies: [...(msg.replies || []), reply]
        };
      })
    );
    
    if (autoScroll) scrollToBottom(true);
  };

  const handleMessageUpdated = ({ messageId, isUpvoted }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              upvotes: isUpvoted
                ? [...(msg.upvotes || []), { userId: currentUser?.id }]
                : msg.upvotes?.filter((u) => u.userId !== currentUser?.id) || [],
            }
          : msg
      )
    );
  };

  const handleConnectionError = (err) => {
    console.error("Socket connection error:", err);
    setIsLoading(false);
  };

  // Scroll handling
  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setAutoScroll(isNearBottom);
    }
  };

  // Message handling
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentUser) return;

    setIsSending(true);
    const tempId = `temp-${Date.now()}`;
    tempMessageIds.current.add(tempId);

    try {
      const tempMessage = {
        id: tempId,
        content: newMessage,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          image: currentUser.image,
        },
        createdAt: new Date(),
        replies: [],
        upvotes: [],
        isTemp: true
      };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      scrollToBottom(true);

      socket.emit(
        "newMessage",
        {
          problemId,
          userId: currentUser.id,
          content: newMessage,
        },
        (confirmedMessage) => {
          tempMessageIds.current.delete(tempId);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempId ? confirmedMessage : msg))
          );
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      tempMessageIds.current.delete(tempId);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyingTo || !socket || !currentUser) return;

    setIsSending(true);
    const tempId = `temp-reply-${Date.now()}`;
    tempMessageIds.current.add(tempId);

    try {
      const tempReply = {
        id: tempId,
        messageId: replyingTo,
        content: replyContent,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          image: currentUser.image,
        },
        createdAt: new Date(),
        isTemp: true
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyingTo
            ? { ...msg, replies: [...(msg.replies || []), tempReply] }
            : msg
        )
      );
      setReplyingTo(null);
      setReplyContent("");
      scrollToBottom(true);

      socket.emit(
        "newReply",
        {
          messageId: replyingTo,
          userId: currentUser.id,
          content: replyContent,
        },
        (confirmedReply) => {
          tempMessageIds.current.delete(tempId);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === replyingTo
                ? {
                    ...msg,
                    replies: msg.replies.map((r) =>
                      r.id === tempId ? confirmedReply : r
                    ),
                  }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Error sending reply:", error);
      tempMessageIds.current.delete(tempId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === replyingTo
            ? {
                ...msg,
                replies: msg.replies?.filter(r => r.id !== tempId) || []
              }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleUpvote = (messageId) => {
    if (!socket || !currentUser) return;
    socket.emit("upvoteMessage", {
      messageId,
      userId: currentUser.id,
    });
  };

  const isUpvoted = (message) => {
    return message.upvotes?.some((u) => u.userId === currentUser?.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-h-screen flex flex-col h-full bg-base-100 rounded-lg border border-base-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-base-300 bg-base-200 sticky top-0 z-10">
        <h3 className="text-xl font-bold">Discussion</h3>
        <span className="badge badge-neutral">{messages.length}</span>
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
          messages.map((message) => (
            <div key={message.id} className={`rounded-lg border border-base-300 p-4 bg-base-100 ${message.isTemp ? 'opacity-70' : ''}`}>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={message.user.image || "https://placehold.co/100"}
                        alt={message.user.username}
                        className="bg-base-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold truncate">
                      {message.user.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                    {message.isTemp && <span className="text-xs text-gray-500">(sending...)</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{message.content}</p>

                  <div className="flex gap-4 mt-2">
                    <button
                      className={`flex items-center gap-1 text-sm ${
                        isUpvoted(message) ? "text-primary" : "text-gray-500"
                      }`}
                      onClick={() => handleUpvote(message.id)}
                      disabled={!currentUser || message.isTemp}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{message.upvotes?.length || 0}</span>
                    </button>
                    {currentUser && (
                      <button
                        className={`flex items-center gap-1 text-sm ${
                          replyingTo === message.id ? "text-primary" : "text-gray-500"
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
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-base-300">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className={`flex gap-3 ${reply.isTemp ? 'opacity-70' : ''}`}>
                          <div className="flex-shrink-0">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img
                                  src={reply.user.image || "https://placehold.co/80"}
                                  alt={reply.user.username}
                                  className="bg-base-300"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">
                                {reply.user.username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.createdAt).toLocaleString()}
                              </span>
                              {reply.isTemp && <span className="text-xs text-gray-500">(sending...)</span>}
                            </div>
                            <p className="text-sm mt-1 whitespace-pre-wrap">
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300 bg-base-200 sticky bottom-0">
        {replyingTo ? (
          <form onSubmit={handleSendReply} className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Replying to:</span>
              <button
                type="button"
                className="btn btn-circle btn-xs"
                onClick={() => setReplyingTo(null)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className="btn btn-primary"
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
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={currentUser.image || "https://placehold.co/100"}
                  alt={currentUser.username}
                  className="bg-base-300"
                />
              </div>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                className="input input-bordered w-full pr-12"
                placeholder="Ask a question or share your thoughts..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Send className="h-5 w-5 text-primary" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info">
            <Link to="/login" className="link link-primary">
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