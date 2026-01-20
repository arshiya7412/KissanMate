import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { CloudSun, Wind, Droplets, AlertTriangle, CheckSquare, TrendingUp, Lightbulb, CloudRain, Sun } from 'lucide-react';
import { getDashboardInsights } from '../services/geminiService';
import { translations } from '../translations';

interface HomeProps {
  userProfile: UserProfile;
  onNavigate: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ userProfile, onNavigate }) => {
  const [insight, setInsight] = useState("Loading daily tip...");
  const t = translations[userProfile.language] || translations['English'];

  useEffect(() => {
    getDashboardInsights(userProfile).then(setInsight);
  }, [userProfile]);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.namaste}, {userProfile.name.split(' ')[0]}! 
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {userProfile.location} • {userProfile.experienceLevel}
          </p>
        </div>
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-200">
            {userProfile.name.charAt(0)}
        </div>
      </div>

      {/* Weather Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-blue-400/30 px-2 py-1 rounded text-xs font-medium border border-blue-400/20">{t.weather}</span>
            <div className="text-4xl font-bold mt-2">28°C</div>
            <div className="text-blue-100 text-sm flex items-center gap-1">
               {t.partlyCloudy} <CloudSun className="w-4 h-4"/>
            </div>
          </div>
          <Sun className="w-14 h-14 text-yellow-300 opacity-90" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
          <div className="text-center">
            <div className="flex justify-center mb-1"><Wind className="w-4 h-4 opacity-70" /></div>
            <div className="text-xs opacity-90">12 km/h</div>
          </div>
          <div className="text-center border-l border-white/20">
            <div className="flex justify-center mb-1"><Droplets className="w-4 h-4 opacity-70" /></div>
            <div className="text-xs opacity-90">45% Hum</div>
          </div>
          <div className="text-center border-l border-white/20">
             <div className="flex justify-center mb-1"><CloudRain className="w-4 h-4 opacity-70" /></div>
             <div className="text-xs opacity-90">0% Rain</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-400 font-medium mb-1">{t.riskLevel}</div>
            <div className="text-green-600 font-bold text-lg">Low</div>
            <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-green-500 w-1/3 h-full"></div>
            </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-400 font-medium mb-1">{t.harvestIn}</div>
            <div className="text-amber-600 font-bold text-lg">45d</div>
            <div className="text-[10px] text-gray-400">Estimated</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-400 font-medium mb-1">{t.waterStress}</div>
            <div className="text-blue-600 font-bold text-lg">None</div>
            <Droplets className="w-3 h-3 text-blue-400 mt-1" />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-200 relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <Lightbulb className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-semibold uppercase tracking-wider">{t.aiInsight}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
                "{insight}"
            </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
            <TrendingUp className="w-32 h-32" />
        </div>
      </div>

      {/* Tasks to Do */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-600" />
                {t.tasksToDo}
            </h3>
            <button onClick={() => onNavigate('plan')} className="text-green-600 text-xs font-semibold hover:underline">{t.viewAll}</button>
        </div>
        <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-50">
                <div className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0"></div>
                <div>
                    <p className="text-sm font-medium text-gray-900">{t.checkSoil}</p>
                    <p className="text-xs text-gray-500">{t.dueToday}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                 <div className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0"></div>
                 <div>
                    <p className="text-sm font-medium text-gray-900">{t.prepFert}</p>
                    <p className="text-xs text-gray-500">{t.dueTom}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('plan')}
          className="bg-green-50 p-4 rounded-xl border border-green-100 active:scale-95 transition-transform flex flex-col items-center justify-center gap-2 text-center"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
            <span className="text-xl">🌱</span>
          </div>
          <span className="text-sm font-semibold text-green-800">{t.myCrops}</span>
        </div>

        <div 
          onClick={() => onNavigate('chat')}
          className="bg-blue-50 p-4 rounded-xl border border-blue-100 active:scale-95 transition-transform flex flex-col items-center justify-center gap-2 text-center"
        >
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
            <span className="text-xl">💬</span>
          </div>
          <span className="text-sm font-semibold text-blue-800">{t.askAssistant}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
