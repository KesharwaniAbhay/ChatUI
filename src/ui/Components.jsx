import React from "react";
import "./Components.css"; // Importing CSS file

export const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`custom-button ${className}`}>
    {children}
  </button>
);

export const Card = ({ children }) => (
  <div className="custom-card">{children}</div>
);

export const Input = ({ value, onChange, onKeyDown }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className="custom-input"
    placeholder="Type your message..."
  />
);
