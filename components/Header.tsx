
import React from 'react';

type View = 'home' | 'shop' | 'calendar';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
  points: number;
}

const NavButton: React.FC<{
  label: string;
  view: View;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ label, view, activeView, onClick }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`px-4 py-2 rounded-md text-base font-medium transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-subtle/50 text-text-subtle hover:bg-subtle'
      }`}
    >
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, points }) => {
  return (
    <header className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <h1 className="text-6xl md:text-5.5xl font-bold text-primary font-heading">
                Productivity Pet 🥚
            </h1>
        </div>

        <nav className="flex space-x-2 md:space-x-4">
          {/* FIX: Changed view from "main" to "home" to match the 'View' type. */}
          <NavButton label="Home" view="home" activeView={activeView} onClick={onNavigate} />
          <NavButton label="Shop" view="shop" activeView={activeView} onClick={onNavigate} />
          <NavButton label="Calendar" view="calendar" activeView={activeView} onClick={onNavigate} />
        </nav>

        <div className="bg-surface border border-subtle rounded-lg px-4 py-2 text-center">
            <span className="text-2xl font-bold text-accent">{points}</span>
            <p className="text-sm text-text-subtle">Points</p>
        </div>
      </div>
    </header>
  );
};

export default Header;