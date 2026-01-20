import React, { useState, useEffect } from 'react';
import { UserProfile, SoilType, MoistureLevel, Task } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { CheckCircle2, Circle, AlertCircle, Sprout, Calendar as CalendarIcon, Coins, ShieldAlert, ArrowLeft, Plus, ChevronDown, ChevronUp, Image as ImageIcon, X, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCropRecommendations, getRiskAssessment, getCostAnalysis } from '../services/geminiService';
import { translations } from '../translations';
import Button from './Button';

interface MyPlanProps {
  userProfile: UserProfile;
}

type ViewState = 'menu' | 'crops' | 'calendar' | 'costs' | 'risk';

const MyPlan: React.FC<MyPlanProps> = ({ userProfile }) => {
  const [view, setView] = useState<ViewState>('menu');
  const t = translations[userProfile.language] || translations['English'];

  // --- CROPS STATE ---
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [moisture, setMoisture] = useState<MoistureLevel>('Medium');
  const [soilImage, setSoilImage] = useState<string | null>(null);
  const [cropRecs, setCropRecs] = useState<string>('');
  const [loadingCrops, setLoadingCrops] = useState(false);

  // --- TASKS STATE ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', week: 1, title: t.task1, status: 'completed', description: t.task1Desc },
    { id: '2', week: 1, title: t.task2, status: 'pending', description: t.task2Desc },
    { id: '3', week: 2, title: t.task3, status: 'pending', description: t.task3Desc },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Re-sync tasks when language changes (simple approach, resets status)
  useEffect(() => {
    setTasks([
      { id: '1', week: 1, title: t.task1, status: 'completed', description: t.task1Desc },
      { id: '2', week: 1, title: t.task2, status: 'pending', description: t.task2Desc },
      { id: '3', week: 2, title: t.task3, status: 'pending', description: t.task3Desc },
    ]);
  }, [userProfile.language]);

  // --- ANALYSIS STATE ---
  const [riskAnalysis, setRiskAnalysis] = useState<string>('');
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [costAnalysis, setCostAnalysis] = useState<string>('');
  const [loadingCost, setLoadingCost] = useState(false);

  // --- MOCK CHART DATA ---
  const costData = [
    { name: t.seeds, value: 2000 },
    { name: t.fertilizer, value: 4000 },
    { name: t.labor, value: 5000 },
    { name: t.waterElec, value: 3000 },
  ];
  const COLORS = ['#16a34a', '#ca8a04', '#ea580c', '#3b82f6'];

  // --- CALENDAR HELPERS ---
  const daysInMonth = 30; // Simplified
  const currentDay = 12; // Mock current day
  const taskDays = [5, 12, 18, 25]; // Mock days with tasks
  
  // Get localized month/year
  const date = new Date();
  const monthYear = date.toLocaleDateString(
      userProfile.language === 'English' ? 'en-IN' : 
      userProfile.language === 'Hindi' ? 'hi-IN' :
      userProfile.language === 'Tamil' ? 'ta-IN' :
      userProfile.language === 'Telugu' ? 'te-IN' :
      userProfile.language === 'Kannada' ? 'kn-IN' : 'en-IN', 
      { month: 'long', year: 'numeric' }
  );

  // --- EFFECTS ---
  useEffect(() => {
    if (view === 'risk' && !riskAnalysis && !loadingRisk) {
      setLoadingRisk(true);
      getRiskAssessment(userProfile).then(res => {
        setRiskAnalysis(res);
        setLoadingRisk(false);
      });
    }
    if (view === 'costs' && !costAnalysis && !loadingCost) {
      setLoadingCost(true);
      getCostAnalysis(userProfile).then(res => {
        setCostAnalysis(res);
        setLoadingCost(false);
      });
    }
  }, [view, userProfile, riskAnalysis, costAnalysis, loadingRisk, loadingCost]);

  // --- HANDLERS ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSoilImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchCrops = async () => {
    setLoadingCrops(true);
    const result = await getCropRecommendations(userProfile, soilType, moisture, soilImage || undefined);
    setCropRecs(result);
    setLoadingCrops(false);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      week: 1,
      title: newTaskTitle,
      description: 'Custom user task.',
      status: 'pending',
      isCustom: true
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  // --- RENDERERS ---

  const renderMenu = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div onClick={() => setView('crops')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Sprout /></div>
        <span className="font-semibold text-gray-900">{t.myCrops}</span>
      </div>
      <div onClick={() => setView('calendar')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><CalendarIcon /></div>
        <span className="font-semibold text-gray-900">{t.calendarTasks}</span>
      </div>
      <div onClick={() => setView('costs')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><Coins /></div>
        <span className="font-semibold text-gray-900">{t.costSummary}</span>
      </div>
      <div onClick={() => setView('risk')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600"><ShieldAlert /></div>
        <span className="font-semibold text-gray-900">{t.riskLevel}</span>
      </div>
    </div>
  );

  const renderCrops = () => (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">{t.soilConditions}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.soilType}</label>
            <select 
              value={soilType} 
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Loamy">{t.loamy}</option>
              <option value="Black">{t.black}</option>
              <option value="Red">{t.red}</option>
              <option value="Sandy">{t.sandy}</option>
              <option value="Clay">{t.clay}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.moisture}</label>
            <select 
              value={moisture} 
              onChange={(e) => setMoisture(e.target.value as MoistureLevel)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Low">{t.low}</option>
              <option value="Medium">{t.medium}</option>
              <option value="High">{t.high}</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t.uploadPhoto} (Assisted Analysis)</label>
             <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg p-3 text-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center justify-center gap-2 text-sm">
                    <ImageIcon className="w-4 h-4"/> {soilImage ? 'Change Photo' : 'Take/Upload Photo'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
                {soilImage && (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img src={soilImage} className="w-full h-full object-cover rounded-md" alt="Soil" />
                    <button onClick={() => setSoilImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3"/></button>
                  </div>
                )}
             </div>
             {soilImage && <p className="text-xs text-blue-600 mt-2 italic">Based on visual cues only. Not 100% accurate.</p>}
          </div>

          <Button fullWidth onClick={fetchCrops} disabled={loadingCrops}>
            {loadingCrops ? <><Loader2 className="animate-spin" /> {t.analyzing}</> : t.suggestCrops}
          </Button>
        </div>
      </div>

      {cropRecs && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200 animate-in fade-in slide-in-from-bottom-4">
           <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
             <Sprout className="w-5 h-5" /> Recommended Crops
           </h3>
           <div className="whitespace-pre-wrap text-sm text-green-900 leading-relaxed">
             {cropRecs}
           </div>
        </div>
      )}
    </div>
  );

  const renderCalendar = () => (
    <div className="p-4 space-y-6">
      {/* Calendar Widget */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 capitalize">{monthYear}</h3>
          <div className="flex gap-2">
            <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5"/></button>
            <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs font-semibold text-gray-400">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length: daysInMonth}).map((_, i) => {
            const day = i + 1;
            const hasTask = taskDays.includes(day);
            const isToday = day === currentDay;
            return (
              <div 
                key={day} 
                className={`h-9 flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer relative
                  ${isToday ? 'bg-green-600 text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}
                `}
              >
                {day}
                {hasTask && !isToday && <div className="w-1 h-1 bg-green-500 rounded-full mt-0.5"></div>}
                {hasTask && isToday && <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            placeholder="Add custom task..." 
            className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button onClick={addTask} className="bg-gray-800 text-white p-2 rounded-lg hover:bg-black"><Plus className="w-5 h-5"/></button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTaskStatus(task.id)} className="mt-0.5">
                  {task.status === 'completed' 
                    ? <CheckCircle2 className="text-green-600 w-5 h-5" /> 
                    : <Circle className="text-gray-300 w-5 h-5" />
                  }
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className={`text-sm font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">Wk {task.week}</span>
                  </div>
                  
                  {expandedTaskId === task.id && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      {task.description}
                    </p>
                  )}
                  
                  <button 
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1"
                  >
                    {expandedTaskId === task.id ? 'Hide Guide' : 'View Guide'} 
                    {expandedTaskId === task.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="p-4 space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">{t.costSummary}</h3>
        <p className="text-xs text-gray-500 mb-4">Note: These are rough estimates.</p>
        
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => `₹${value}`} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
           <div className="flex justify-between items-center mb-1">
             <span className="text-sm text-gray-600">{t.estimatedCost}</span>
             <span className="text-lg font-bold text-gray-900">₹14,000</span>
           </div>
           
           <div className="mt-4">
             {loadingCost ? (
                <div className="text-center text-sm text-gray-500 py-2"><Loader2 className="w-4 h-4 animate-spin inline mr-2"/> {t.analyzingBudget}</div>
             ) : (
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {costAnalysis || "Analysis unavailable."}
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );

  const renderRisk = () => (
    <div className="p-4 space-y-6">
      {loadingRisk ? (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-gray-500">{t.analyzing}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-4">
                <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.riskAssessment}</h3>
            <div className="whitespace-pre-wrap text-left text-sm text-gray-700 leading-relaxed">
              {riskAnalysis || "Risk assessment unavailable."}
            </div>
          </div>
          <div className="text-center">
             <button onClick={() => { setLoadingRisk(false); setRiskAnalysis(''); }} className="text-sm text-green-600 flex items-center justify-center gap-1 w-full">
               <RefreshCw className="w-3 h-3"/> {t.refresh}
             </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
        {view !== 'menu' && (
          <button onClick={() => setView('menu')} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <h2 className="text-xl font-bold text-gray-800">
          {view === 'menu' && t.myPlan}
          {view === 'crops' && t.myCrops}
          {view === 'calendar' && t.calendarTasks}
          {view === 'costs' && t.costSummary}
          {view === 'risk' && t.riskLevel}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'menu' && renderMenu()}
        {view === 'crops' && renderCrops()}
        {view === 'calendar' && renderCalendar()}
        {view === 'costs' && renderCosts()}
        {view === 'risk' && renderRisk()}
      </div>
    </div>
  );
};

export default MyPlan;
