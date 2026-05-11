import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Map, HelpCircle, FileText, LogOut, X } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logoNoBg from '../assets/logo-no-bg.png';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navItems = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.aiAssistant'), path: '/assistant', icon: MessageSquare },
    { name: t('sidebar.roadmap'), path: '/roadmap', icon: Map },
    { name: t('sidebar.quizGen'), path: '/quiz', icon: HelpCircle },
    { name: t('sidebar.summarizer'), path: '/summarizer', icon: FileText },
  ];

  return (
    <div className={`h-screen w-64 glass border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] overflow-hidden">
            <img src={logoNoBg} alt="CyberLearn Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CyberLearn AI</span>
        </div>
        <button 
          className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button 
          onClick={() => {
            signOut(auth);
            navigate('/');
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
