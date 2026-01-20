import React from 'react';
import { Home as HomeIcon, ClipboardList, MessageCircle, User } from 'lucide-react';
import { translations } from '../translations';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  // Hacky way to get current language from children props if possible, 
  // or default to English. Ideally context should be used.
  // For this structure, we'll assume English default labels for icons 
  // but let's try to grab language from the rendered component props if we passed it down.
  // Since we don't have global state management like Redux/Context easily here,
  // we will use a simple localized mapping inside the component assuming 'English' default
  // or we need to pass userProfile to Layout.
  // Let's modify App.tsx to pass userProfile language to Layout, but for now
  // I will just use English labels for the nav bar to keep it simple or 
  // we can use a small hack to look at the first child's props if available.
  
  // BETTER APPROACH: Just use English for icons to avoid prop drilling hell 
  // OR update App.tsx to pass language. Let's do the latter in next step if needed.
  // For now, let's keep English for bottom nav icons as they are universal symbols mostly.
  
  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'plan', icon: ClipboardList, label: 'Plan' },
    { id: 'chat', icon: MessageCircle, label: 'Ask AI' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {children}
      </div>
      
      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 h-16 flex items-center justify-around px-2 z-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
