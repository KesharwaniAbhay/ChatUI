import React from "react";
import "./Components.css"; 

export const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`custom-button ${className}`}>
    {children}
  </button>
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
