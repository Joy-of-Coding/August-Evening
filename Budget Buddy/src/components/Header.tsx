import React, { useEffect, useState } from "react";
import { getUserProfile, saveUserProfile } from "../utils/localStorageUtils";


const Header: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile && profile.username) {
      setUsername(profile.username);
    } else {
      setUsername("Shelly"); // Default name
    }
  }, []);

  const handleProfileClick = () => {
    setShowPrompt(true);
  };

  const handlePromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("username") as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
      setUsername(name);
      saveUserProfile({ username: name });
      setShowPrompt(false);
    }
  };

  return (
    <header style={{ position: "relative", width: "100%", height: "60px" }}>
      <h1 style={{ textAlign: "center", margin: 0, lineHeight: "60px" }}>Budget Buddy</h1>
      <div
        style={{
          position: "absolute",
          top: "-176px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          background: "#e3f2fd",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "6px 16px",
          minWidth: "64px",
          height: "48px",
          zIndex: 20,
        }}
      >
        <button
          aria-label="Profile"
          onClick={handleProfileClick}
          style={{
            background: "#e3f2fd",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginRight: "8px",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            position: "relative",
            top: "-4px"
          }}
        >
          {/* Black, thicker, larger profile icon SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4" />
          </svg>
        </button>
        <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "#1976d2" }}>{username}</span>
        {showPrompt && (
          <form
            onSubmit={handlePromptSubmit}
            style={{
              position: "absolute",
              top: "36px",
              right: 0,
              background: "#fff",
              border: "1px solid #90caf9",
              borderRadius: "8px",
              padding: "0.5rem",
              zIndex: 30,
              minWidth: "120px"
            }}
          >
            <label htmlFor="username" style={{ fontSize: "0.85rem" }}>Enter your name:</label>
            <input type="text" id="username" name="username" defaultValue={username} required style={{ margin: "0 0.5rem", fontSize: "0.85rem" }} />
            <button type="submit" style={{ fontSize: "0.85rem" }}>Save</button>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;
