import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Sidebar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[103px] flex-col justify-between bg-[#373B53] dark:bg-[#1E2139] z-50 rounded-r-[20px] overflow-hidden">
        {/* Logo */}
        <div className="relative w-full h-[103px] bg-[#7C5DFA] rounded-r-[20px] flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#9277FF] rounded-tl-[20px]" />
          <div className="relative z-10">
            <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.6942 0.292847L20.4 19.9999L10.6942 0.292847Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M0 19.9999H20.4L10.6942 0.292847L0 19.9999Z" fill="white" fillOpacity="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M20.4 19.9999L29.7 38.0001L39.6 19.9999H20.4Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M20.4 19.9999H39.6L29.7 38.0001L20.4 19.9999Z" fill="white" fillOpacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-6 pb-6">
          <button
            onClick={toggleTheme}
            className="text-[#858BB2] hover:text-[#DFE3FA] transition-colors p-2"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="w-full h-px bg-[#494E6E]" />
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#7C5DFA] cursor-pointer transition-all">
            <div className="w-full h-full bg-gradient-to-br from-[#7C5DFA] to-[#9277FF] flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-[72px] bg-[#373B53] dark:bg-[#1E2139] z-50 flex items-center justify-between">
        {/* Logo */}
        <div className="relative w-[72px] h-[72px] bg-[#7C5DFA] rounded-br-[20px] flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#9277FF] rounded-tl-[20px]" />
          <div className="relative z-10">
            <svg width="28" height="26" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.6942 0.292847L20.4 19.9999L10.6942 0.292847Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M0 19.9999H20.4L10.6942 0.292847L0 19.9999Z" fill="white" fillOpacity="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M20.4 19.9999L29.7 38.0001L39.6 19.9999H20.4Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M20.4 19.9999H39.6L29.7 38.0001L20.4 19.9999Z" fill="white" fillOpacity="0.5"/>
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-6">
          <button
            onClick={toggleTheme}
            className="text-[#858BB2] hover:text-[#DFE3FA] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#7C5DFA] to-[#9277FF] flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Sidebar;
