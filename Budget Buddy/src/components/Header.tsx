import React from "react";

const Header: React.FC = () => {
  return (
    <header style={{
      textAlign: 'center',
      marginBottom: '32px',
      padding: '20px',
      backgroundColor: '#1F2937',
      borderRadius: '16px',
      border: '3px solid #4B5563',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '3.5em',
        fontWeight: 800,
        color: '#F9FAFB',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Budget Buddy
      </h1>
    </header>
  );
};

export default Header;
