import React, { useState } from 'react';
import { UserProfile, Land } from '../types';
import { User, MapPin, Plus, CreditCard, Settings, Globe, X, Check, Edit2, LogOut, LocateFixed, Loader2 } from 'lucide-react';
import Button from './Button';
import { translations } from '../translations';

interface ProfileProps {
  userProfile: UserProfile;
  onLogout?: () => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onLogout, onUpdateProfile }) => {
  const t = translations[userProfile.language] || translations['English'];
  
  const [lands, setLands] = useState<Land[]>(
    userProfile.lands || [{ id: '1', name: 'Main Farm', size: userProfile.landSize, location: userProfile.location }]
  );

  // Modals state
  const [showAddLand, setShowAddLand] = useState(false);
  const [showEditLand, setShowEditLand] = useState<Land | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Temp form state
  const [tempLand, setTempLand] = useState<Partial<Land>>({});

  const detectLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
            headers: { 'User-Agent': 'KisaanMate-App' }
          });
          const data = await response.json();
          const addr = data.address || {};
          
          const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.suburb;
          const state = addr.state || addr.region;
          
          let locationStr = '';
          if (city && state) locationStr = `${city}, ${state}`;
          else if (state) locationStr = state;
          else if (city) locationStr = city;
          else locationStr = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

          setTempLand(prev => ({ ...prev, location: locationStr }));
        } catch (e) {
          alert("Could not fetch location automatically.");
        } finally {
          setIsLocating(false);
        }
      }, (err) => {
        setIsLocating(false);
        alert("Location permission denied.");
      }, { enableHighAccuracy: true, timeout: 10000 });
    }
  };

  const handleAddLand = () => {
    if (tempLand.name && tempLand.location && tempLand.size) {
      const newLand: Land = {
        id: Date.now().toString(),
        name: tempLand.name,
        location: tempLand.location,
        size: tempLand.size
      };
      const updatedLands = [...lands, newLand];
      setLands(updatedLands);
      if (onUpdateProfile) onUpdateProfile({ lands: updatedLands });
      setShowAddLand(false);
      setTempLand({});
    }
  };

  const handleUpdateLand = () => {
    if (showEditLand && tempLand.name) {
      const updatedLands = lands.map(l => l.id === showEditLand.id ? { ...l, ...tempLand } as Land : l);
      setLands(updatedLands);
      if (onUpdateProfile) onUpdateProfile({ lands: updatedLands });
      setShowEditLand(null);
      setTempLand({});
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ language: e.target.value as any });
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-full pb-20 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t.profile}</h1>
      
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="bg-gradient-to-r from-green-600 to-green-500 h-24"></div>
        <div className="px-4 pb-4">
           <div className="relative -mt-10 mb-3">
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-sm">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <User className="w-10 h-10" />
              </div>
            </div>
           </div>
           <h2 className="text-xl font-bold text-gray-800">{userProfile.name}</h2>
           <div className="flex gap-2 mt-1">
             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                {userProfile.experienceLevel}
             </span>
             <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                {userProfile.language}
             </span>
           </div>
        </div>
      </div>

      {/* My Lands */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-gray-700">{t.myLands}</h3>
            <button 
              onClick={() => setShowAddLand(true)}
              className="text-green-600 text-sm font-medium flex items-center gap-1"
            >
                <Plus className="w-4 h-4"/> {t.addLand}
            </button>
        </div>
        <div className="space-y-3">
            {lands.map(land => (
                <div key={land.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-gray-900">{land.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {land.location}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{land.size}</span>
                        </div>
                    </div>
                    <button 
                      onClick={() => { setShowEditLand(land); setTempLand(land); }}
                      className="text-gray-400 hover:text-green-600"
                    >
                      <Edit2 className="w-4 h-4"/>
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Subscription */}
      <div>
         <h3 className="font-bold text-gray-700 mb-3 px-1">{t.subscription}</h3>
         <div 
           onClick={() => setShowSubscription(true)}
           className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-lg cursor-pointer active:scale-95 transition-transform"
         >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-sm text-gray-300 font-medium">{t.currentPlan}</div>
                    <div className="text-2xl font-bold">{t.freeTier}</div>
                </div>
                <CreditCard className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-400 mb-4">{t.unlockPotential}</p>
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/10">
               {t.viewUpgrade}
            </div>
         </div>
      </div>

      {/* Settings */}
      <div>
         <h3 className="font-bold text-gray-700 mb-3 px-1">{t.settings}</h3>
         <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Globe className="w-5 h-5"/></div>
                    <span className="text-sm font-medium text-gray-700">{t.appLanguage}</span>
                </div>
                <select 
                  className="text-sm bg-transparent text-right font-medium text-gray-600 outline-none cursor-pointer" 
                  value={userProfile.language}
                  onChange={handleLanguageChange}
                >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                </select>
             </div>
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-600"><Settings className="w-5 h-5"/></div>
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                </div>
                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
             </div>
         </div>
      </div>

      <div className="mt-8 text-center pb-6">
         <button 
           onClick={onLogout}
           className="text-red-500 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 w-full"
         >
           <LogOut className="w-4 h-4"/> {t.logout}
         </button>
      </div>

      {/* --- MODALS --- */}

      {/* Add Land Modal */}
      {showAddLand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">{t.addLand}</h3>
            <div className="space-y-3">
              <input 
                placeholder="Land Name (e.g. Riverside Plot)" 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setTempLand({...tempLand, name: e.target.value})}
              />
              <div className="relative flex gap-2">
                 <input 
                  placeholder="Location" 
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                  value={tempLand.location || ''}
                  onChange={(e) => setTempLand({...tempLand, location: e.target.value})}
                />
                <button 
                  onClick={detectLocation} 
                  className="bg-green-50 px-3 rounded-xl border border-green-200 text-green-700 flex items-center justify-center"
                  disabled={isLocating}
                >
                   {isLocating ? <Loader2 className="animate-spin w-5 h-5"/> : <LocateFixed className="w-5 h-5"/>}
                </button>
              </div>
               <input 
                placeholder="Size (e.g. 2 Acres)" 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setTempLand({...tempLand, size: e.target.value})}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" fullWidth onClick={() => setShowAddLand(false)}>{t.cancel}</Button>
              <Button fullWidth onClick={handleAddLand}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Land Modal */}
      {showEditLand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">Edit Land</h3>
            <div className="space-y-3">
              <input 
                defaultValue={showEditLand.name}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setTempLand({...tempLand, name: e.target.value})}
              />
              <input 
                defaultValue={showEditLand.location}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setTempLand({...tempLand, location: e.target.value})}
              />
               <input 
                defaultValue={showEditLand.size}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setTempLand({...tempLand, size: e.target.value})}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" fullWidth onClick={() => setShowEditLand(null)}>{t.cancel}</Button>
              <Button fullWidth onClick={handleUpdateLand}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button onClick={() => setShowSubscription(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full">
                <X className="w-5 h-5"/>
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t.upgrade}</h2>
                <p className="text-gray-500 text-sm mt-1">{t.unlockPotential}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                 {[t.ben1, t.ben2, t.ben3, t.ben4].map((b, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="bg-green-100 p-1 rounded-full"><Check className="w-3 h-3 text-green-600"/></div>
                     <span className="text-sm font-medium text-gray-700">{b}</span>
                   </div>
                 ))}
              </div>

              {/* Plans */}
              <div className="space-y-3">
                <div className="border border-green-600 bg-green-50 p-4 rounded-xl relative">
                  <div className="absolute -top-3 right-4 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{t.bestValue}</div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-900">Yearly</span>
                    <span className="font-bold text-xl">₹999<span className="text-xs font-normal text-gray-500">/yr</span></span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">{t.freeTrial}</p>
                </div>

                <div className="border border-gray-200 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Monthly</span>
                    <span className="font-bold text-xl">₹199<span className="text-xs font-normal text-gray-500">/mo</span></span>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-xl">
                   <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Weekly</span>
                    <span className="font-bold text-xl">₹49<span className="text-xs font-normal text-gray-500">/wk</span></span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button fullWidth onClick={() => alert("Payment gateway would open here.")}>
                  {t.startTrial}
                </Button>
                <p className="text-xs text-center text-gray-400 mt-3">
                   {t.autoRenew}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
