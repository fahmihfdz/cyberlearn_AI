import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import logoNoBg from '../assets/logo-no-bg.png';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-white font-sans selection:bg-primary/30 relative">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 glass border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_rgba(6,182,212,0.5)] overflow-hidden">
            <img src={logoNoBg} alt="CyberLearn Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CyberLearn AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 md:ml-64 p-4 md:p-8 relative overflow-y-auto h-[calc(100vh-73px)] md:h-screen z-10 w-full">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 hidden md:block">
          <LanguageSwitcher />
        </div>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
        <div className="max-w-6xl mx-auto w-full overflow-x-hidden pt-4 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
