import { create } from "zustand";

const useChatStore = create((set) => ({
  chats: [],
  currentChat: [],
  activeChatIndex: 0,
  addMessage: (message, response) =>
    set((state) => {
      const lastMessage = state.currentChat[state.currentChat.length - 1];
      let updatedChats;
      if (lastMessage && lastMessage.response === "Waiting...") {
        // Update the "Waiting..." entry with the actual response
        updatedChats = state.chats.map((chat, i) =>
          i === state.activeChatIndex
            ? chat.map((msg, idx) =>
              idx === chat.length - 1 ? { message, response } : msg
            )
            : chat
        );
      } else {
        // Add new message pair
        updatedChats = state.chats.map((chat, i) =>
          i === state.activeChatIndex ? [...chat, { message, response }] : chat
        );
      }
      return {
        chats: updatedChats,
        currentChat: updatedChats[state.activeChatIndex],
      };
    }),

  saveChat: () =>
    set((state) => ({
      chats: [...state.chats, []],
      currentChat: [],
      activeChatIndex: state.chats.length,
    })),
  switchChat: (index) =>
    set((state) => ({
      currentChat: state.chats[index] || [],
      activeChatIndex: index >= 0 && index < state.chats.length ? index : 0,
    })),
  resetChats: () =>
    set({
      chats: [[]],
      currentChat: [],
      activeChatIndex: 0,
    }),   
  setChatHistory: (history) =>
    set(() => ({
      chats: Array.isArray(history) && history.length > 0 ? history : [[]],
      currentChat: history[0] || [],
      activeChatIndex: 0,
    })),
}));

export default useChatStore;