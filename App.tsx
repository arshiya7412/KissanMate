import React, { useState } from 'react';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Home from './components/Home';
import MyPlan from './components/MyPlan';
import AIChat from './components/AIChat';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setActiveTab('home');
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
  };

  const renderContent = () => {
    if (!userProfile) return null;

    switch (activeTab) {
      case 'home':
        return <Home userProfile={userProfile} onNavigate={setActiveTab} />;
      case 'plan':
        return <MyPlan userProfile={userProfile} />;
      case 'chat':
        return <AIChat userProfile={userProfile} />;
      case 'profile':
        return (
          <Profile 
            userProfile={userProfile} 
            onLogout={handleLogout} 
            onUpdateProfile={handleUpdateProfile} 
          />
        );
      default:
        return <Home userProfile={userProfile} onNavigate={setActiveTab} />;
    }
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
