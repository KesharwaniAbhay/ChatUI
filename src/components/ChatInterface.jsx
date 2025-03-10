import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import useChatStore from "../store/chatStore";
import { Input, Button } from "../ui/Components";
import "./ChatInterface.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const requestLock = useRef(false);
  const { currentChat, addMessage, setChatHistory, chats } = useChatStore();

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const storedChats = localStorage.getItem("chatHistory");
    if (storedChats) {
      setChatHistory(JSON.parse(storedChats));
    }
  }, [setChatHistory]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chats));
  }, [chats]);

  const handleSend = useCallback(async () => {  
    if (input.trim() === "" || loading || requestLock.current) return (alert("Enter Something!"));

    requestLock.current = true;
    const userMessage = input;
    setInput("");
    setLoading(true);
    addMessage(userMessage, "Waiting..."); // Add user message once
    console.log("API call triggered for session:", userMessage);

    try {
      const sessionHistory = currentChat
        .filter((chat) => chat.response !== "Waiting...")
        .map((chat) => `User: ${chat.message}\nAssistant: ${chat.response}`)
        .join("\n\n"); 

      const prompt = `${sessionHistory.length > 0 ? sessionHistory + "\n\n" : ""}User: ${userMessage}\nAssistant: (keep it short, max 1-2 sentences)`;

      const result = await model.generateContent(prompt);
      const botResponse = result.response.text().trim() || "No response from AI.";
      addMessage(userMessage, botResponse); // Update "Waiting..." with response
      
    } catch (error) {
      console.error("Gemini API Error:", error);
      let errorMessage = "Failed to get a response.";
      if (error.message.includes("429")) {
        errorMessage = "Rate limit reached. Wait a sec.";
      }
      addMessage(userMessage, errorMessage);
    } finally {
      setLoading(false);
      requestLock.current = false;
    }
  }, [input, loading, addMessage, model, currentChat]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !requestLock.current) {
      handleSend();
    }
  };

  const handleClick = () => {
    if (!loading && !requestLock.current) {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* <ChatSidebar /> */}
      <div className="chat-content">
        <div className="chat-box">
        <div style={{ backgroundColor: "black", color: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ textAlign: "center", text:"bold", fontSize:"30px" }}>This is the chat area</p>
        </div>
        <div style={{marginTop:"20px"}}>
          {currentChat.map((chat, index) => (
            <div key={index} className="message-wrapper user">
              <div className="user-message-wrapper">
                <p className="user-message">You:</p>  
                <p className="message">{chat.message}</p>
              </div>
              {chat.response !== "Waiting..." && (
                <div className="ai-message-wrapper">
                  <p className="ai-message">AI:</p>
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p {...props} className="chat-response" />,
                      code: ({ node, inline, ...props }) => (
                        inline ? (
                          <code className="inline-code" {...props} />
                        ) : (
                          <pre className="code-block">
                            <code {...props} />
                          </pre>
                        )
                      ),
                    }}
                  >
                    {chat.response}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
        <div className="chat-input-container">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Type your message..."
          />
          <Button onClick={handleClick} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;