import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${theme}`}
      aria-label="Toggle theme"
    >
      <div className="toggle-thumb" />
      <div className="toggle-icons">
        <div className="icon-wrapper">
          <Sun size={16} className={`icon ${theme === 'light' ? 'active' : ''}`} />
        </div>
        <div className="icon-wrapper">
          <Moon size={16} className={`icon ${theme === 'dark' ? 'active' : ''}`} />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
