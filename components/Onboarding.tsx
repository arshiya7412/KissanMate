import React, { useState } from 'react';
import { UserProfile } from '../types';
import Button from './Button';
import { Sprout, Droplets, MapPin, IndianRupee, Clock, LocateFixed, Loader2 } from 'lucide-react';
import { translations } from '../translations';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    experienceLevel: 'Beginner',
    language: 'English' // Default
  });

  // Safe fallback to English if language key is missing
  const t = translations[profile.language as any] || translations['English'];

  const handleNext = () => setStep(s => s + 1);
  
  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap Nominatim with addressdetails
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
            headers: {
              'User-Agent': 'KisaanMate-App'
            }
          });
          const data = await response.json();
          const addr = data.address || {};
          
          // Fallback logic for city name
          const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.suburb;
          const state = addr.state || addr.region;
          
          let locationStr = '';
          if (city && state) locationStr = `${city}, ${state}`;
          else if (state) locationStr = state;
          else if (city) locationStr = city;
          else locationStr = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

          updateProfile('location', locationStr);
        } catch (e) {
          console.error("Location error:", e);
          alert("Could not fetch address details. Please enter manually.");
        } finally {
          setIsLocating(false);
        }
      }, (err) => {
        console.error("Geolocation error:", err);
        setIsLocating(false);
        alert("Location permission denied or unavailable. Please enter manually.");
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const finish = () => {
    if (profile.name && profile.location) {
      onComplete(profile as UserProfile);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <div className="w-full mb-8">
        <div className="flex justify-between mb-4">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className={`h-2 rounded-full flex-1 mx-1 ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
           ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 && t.step1Title}
          {step === 2 && t.step2Title}
          {step === 3 && t.step3Title}
          {step === 4 && t.step4Title}
        </h1>
        <p className="text-gray-500">
          {step === 1 && t.step1Desc}
          {step === 2 && t.step2Desc}
          {step === 3 && t.step3Desc}
          {step === 4 && t.step4Desc}
        </p>
      </div>

      <div className="w-full flex-1 overflow-y-auto pb-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourName}</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder="e.g. Rahul Kumar"
                value={profile.name || ''}
                onChange={(e) => updateProfile('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.prefLanguage}</label>
              <select 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                value={profile.language || ''}
                onChange={(e) => updateProfile('language', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                   <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                   <input 
                    type="text" 
                    className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Pune, Maharashtra"
                    value={profile.location || ''}
                    onChange={(e) => updateProfile('location', e.target.value)}
                  />
                </div>
                <button 
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="bg-green-50 px-3 rounded-xl border border-green-200 text-green-700 hover:bg-green-100 flex items-center justify-center min-w-[50px]"
                  title={t.detectLocation}
                >
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.waterSource}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'Borewell', label: t.borewell },
                  { val: 'Canal', label: t.canal },
                  { val: 'Rain', label: t.rain },
                  { val: 'Unsure', label: t.unsure },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => updateProfile('waterSource', opt.val)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                      profile.waterSource === opt.val 
                      ? 'border-green-600 bg-green-50 text-green-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">{t.landSize}</label>
               <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. 2 Acres"
                value={profile.landSize || ''}
                onChange={(e) => updateProfile('landSize', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.primaryGoal}</label>
              <select 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                value={profile.goal || ''}
                onChange={(e) => updateProfile('goal', e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Income">{t.goalIncome}</option>
                <option value="Hobby">{t.goalHobby}</option>
                <option value="Organic Food">{t.goalOrganic}</option>
                <option value="Land Productivity">{t.goalLand}</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.budgetRange}</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. 50,000 - 1 Lakh"
                  value={profile.budget || ''}
                  onChange={(e) => updateProfile('budget', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.involvement}</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'Daily', label: t.daily, desc: t.dailyDesc },
                  { id: 'Weekend', label: t.weekend, desc: t.weekendDesc },
                  { id: 'Hired Help', label: t.hired, desc: t.hiredDesc },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateProfile('involvement', opt.id)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      profile.involvement === opt.id 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`font-semibold ${profile.involvement === opt.id ? 'text-green-800' : 'text-gray-800'}`}>{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full pt-4">
        {step < 4 ? (
          <Button 
            fullWidth 
            onClick={handleNext} 
            disabled={
              (step === 1 && (!profile.name || !profile.language)) ||
              (step === 2 && (!profile.location || !profile.waterSource)) ||
              (step === 3 && (!profile.goal || !profile.budget))
            }
          >
            {t.nextStep}
          </Button>
        ) : (
          <Button 
            fullWidth 
            onClick={finish}
            disabled={!profile.involvement}
          >
            {t.createPlan}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
