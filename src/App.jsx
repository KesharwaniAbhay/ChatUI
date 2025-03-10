import React from "react";
import ChatInterface from "./components/ChatInterface";
import "./App.css";
import ChatSidebar from "./components/ChatSidebar";

const App = () => {
  return (
    <div className="app-container">
      <ChatSidebar/>
      <ChatInterface />
    </div>
  );
};

export default App;