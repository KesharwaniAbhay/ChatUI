import React from "react";
import useChatStore from "../store/chatStore";
import { Button } from "../ui/Components";
import "./ChatSidebar.css";

const ChatSidebar = () => {
  const { chats, saveChat, switchChat, resetChats, activeChatIndex } = useChatStore();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Chat History</h2>
      <Button onClick={saveChat} className="sidebar-btn">
        New Chat
      </Button>
      
      <div className="chat-list">
        {chats.length === 0 ? (
          <p>No chats yet</p>
        ) : (
          chats.map((chat, index) => (
            <Button
              key={index}
              onClick={() => switchChat(index)}
              className={`chat-item ${index === activeChatIndex ? "active" : ""}`}
            >
              Chat {index + 1}
            </Button>
          ))
        )}
      </div>
      <Button onClick={resetChats} className="sidebar-btn reset-btn">
        Reset Chats
      </Button>
    </div>
  );
};

export default ChatSidebar;