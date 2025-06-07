import { create } from "zustand";
import { showToast } from "../libs/showToast";
import { io } from "socket.io-client";

export const useDiscussionStore = create((set, get) => ({
  socket: null,
  messages: [],
  currentProblemId: null,
  currentUser: null,
  isLoading: false,
  isSending: false,
  replyingTo: null,
  error: null,
  autoScroll: true,
  messagesEndRef: null,
  messagesContainerRef: null,
  tempMessageIds: new Set(),

  initializeSocket: (problemId, currentUser) => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io",
      withCredentials: true,
    });

    const handleConnect = () => {
      console.log("Socket connected");
      set({ socket: newSocket });
      newSocket.emit("joinDiscussion", problemId);
    };

    const handleInitialMessages = (initialMessages) => {
      console.log("Received initial messages");
      set({ messages: initialMessages, isLoading: false });
      get().scrollToBottom(false);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("initialMessages", handleInitialMessages);
    newSocket.on("newMessage", get().handleNewMessage);
    newSocket.on("newReply", get().handleNewReply);
    newSocket.on("messageUpdated", get().handleMessageUpdated);
    newSocket.on("connect_error", get().handleConnectionError);

    set({ currentProblemId: problemId, currentUser });

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("initialMessages", handleInitialMessages);
      newSocket.off("newMessage", get().handleNewMessage);
      newSocket.off("newReply", get().handleNewReply);
      newSocket.off("messageUpdated", get().handleMessageUpdated);
      newSocket.off("connect_error", get().handleConnectionError);
      newSocket.disconnect();
    };
  },

    handleNewMessage: (message) => {
    if (get().tempMessageIds.has(message.id)) return;
    
    set((state) => {
      const exists = state.messages.some(m => m.id === message.id);
      return exists ? state : { 
        messages: [...state.messages, message],
        ...(state.autoScroll ? { scrollToBottom: true } : {})
      };
    });
  },

  handleNewReply: (reply) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id !== reply.messageId) return msg;
        
        const replyExists = msg.replies?.some(r => r.id === reply.id) || false;
        if (replyExists) return msg;
        
        return {
          ...msg,
          replies: [...(msg.replies || []), reply]
        };
      }),
      ...(state.autoScroll ? { scrollToBottom: true } : {})
    }));
  },

  handleMessageUpdated: ({ messageId, isUpvoted }) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              upvotes: isUpvoted
                ? [...(msg.upvotes || []), { userId: state.currentUser?.id }]
                : msg.upvotes?.filter((u) => u.userId !== state.currentUser?.id) || [],
            }
          : msg
      )
    }));
  },

  handleConnectionError: (err) => {
    console.error("Socket connection error:", err);
    set({ isLoading: false, error: err.message });
    showToast({ error: "Failed to connect to discussion" });
  },

  sendMessage: async (content, problemId) => {
    const { socket, currentUser } = get();
    if (!content.trim() || !socket || !currentUser) return;

    set({ isSending: true });
    const tempId = `temp-${Date.now()}`;
    get().tempMessageIds.add(tempId);

    try {
      const tempMessage = {
        id: tempId,
        content,
        userId: currentUser?.user?.profile?.id,
        user: {
          id: currentUser?.user?.profile?.id,
          username: currentUser?.user?.profile?.username,
          image: currentUser?.user?.profile?.image,
        },
        createdAt: new Date(),
        replies: [],
        upvotes: [],
        isTemp: true
      };

      set((state) => ({ messages: [...state.messages, tempMessage] }));
      get().scrollToBottom(true);

      socket.emit(
        "newMessage",
        {
          problemId,
          userId: currentUser?.user?.profile?.id,
          content,
        },
        (confirmedMessage) => {
          get().tempMessageIds.delete(tempId);
          set((state) => ({
            messages: state.messages.map((msg) => 
              msg.id === tempId ? confirmedMessage : msg
            )
          }));
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      get().tempMessageIds.delete(tempId);
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== tempId)
      }));
      showToast({ error: "Failed to send message" });
    } finally {
      set({ isSending: false });
    }
  },

  sendReply: async (content, messageId) => {
    const { socket, currentUser, messages } = get();
    if (!content.trim() || !messageId || !socket || !currentUser) return;

    set({ isSending: true });
    const tempId = `temp-reply-${Date.now()}`;
    get().tempMessageIds.add(tempId);

    try {
      const messageBeingRepliedTo = messages.find(m => m.id === messageId);
      
      const tempReply = {
        id: tempId,
        messageId,
        content,
        userId: currentUser?.user?.profile?.id,
        user: {
          id: currentUser?.user?.profile?.id,
          username: currentUser?.user?.profile?.username,
          image: currentUser?.user?.profile?.image,
        },
        replyingToUsername: messageBeingRepliedTo?.user?.username,
        createdAt: new Date(),
        isTemp: true
      };

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, replies: [...(msg.replies || []), tempReply] }
            : msg
        ),
        replyingTo: null
      }));
      get().scrollToBottom(true);

      socket.emit(
        "newReply",
        {
          messageId,
          userId: currentUser?.user?.profile?.id,
          content,
          replyingToUsername: messageBeingRepliedTo?.user?.username,
        },
        (confirmedReply) => {
          get().tempMessageIds.delete(tempId);
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    replies: msg.replies.map((r) =>
                      r.id === tempId ? confirmedReply : r
                    ),
                  }
                : msg
            )
          }));
        }
      );
    } catch (error) {
      console.error("Error sending reply:", error);
      get().tempMessageIds.delete(tempId);
      set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId
            ? {
                ...msg,
                replies: msg.replies?.filter(r => r.id !== tempId) || []
              }
            : msg
        )
      }));
      showToast({ error: "Failed to send reply" });
    } finally {
      set({ isSending: false });
    }
  },

  upvoteMessage: (messageId) => {
    const { socket, currentUser } = get();
    if (!socket || !currentUser) return;

    socket.emit("upvoteMessage", {
      messageId,
      userId: currentUser?.user?.profile?.id,
    });
  },

  setReplyingTo: (messageId) => set({ replyingTo: messageId }),

  isUpvoted: (message) => {
    const { currentUser } = get();
    return message.upvotes?.some((u) => u.userId === currentUser?.user?.profile?.id);
  },

  isCurrentUserMessage: (userId) => {
    const { currentUser } = get();
    return currentUser && userId === currentUser?.user?.profile?.id;
  },

  scrollToBottom: (smooth = true) => {
    requestAnimationFrame(() => {
      const messagesEndRef = get().messagesEndRef;
      if (messagesEndRef?.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    });
  },

  setMessagesEndRef: (ref) => set({ messagesEndRef: ref }),
  setMessagesContainerRef: (ref) => set({ messagesContainerRef: ref }),
  setAutoScroll: (value) => set({ autoScroll: value }),
}));