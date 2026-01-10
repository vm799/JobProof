
import React, { useState, useEffect } from 'react';
import { UserRole, Job, JobStatus } from './types';
import Dashboard from './screens/Dashboard';
import JobList from './screens/JobList';
import JobDetail from './screens/JobDetail';
import CameraView from './screens/CameraView';
import ReviewQueue from './screens/ReviewQueue';
import SignIn from './screens/SignIn';
import LandingPage from './screens/LandingPage';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('landing');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigate = (screen: string, jobId: string | null = null) => {
    setCurrentScreen(screen);
    if (jobId) setSelectedJobId(jobId);
  };

  const handleSignIn = (role: UserRole) => {
    setUserRole(role);
    setCurrentScreen(role === UserRole.TECHNICIAN ? 'jobs' : 'dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onSignIn={() => navigate('signin')} />;
      case 'signin':
        return <SignIn onSignIn={handleSignIn} onBack={() => navigate('landing')} />;
      case 'dashboard':
        return <Dashboard onReviewJob={(id) => navigate('review', id)} />;
      case 'jobs':
        return <JobList onSelectJob={(id) => navigate('job-detail', id)} />;
      case 'job-detail':
        return <JobDetail 
                  jobId={selectedJobId!} 
                  onBack={() => navigate('jobs')} 
                  onCapture={() => navigate('camera', selectedJobId)}
                />;
      case 'camera':
        return <CameraView 
                  jobId={selectedJobId!} 
                  onClose={() => navigate('job-detail', selectedJobId)}
                  onCaptured={() => navigate('job-detail', selectedJobId)}
                />;
      case 'review':
        return <ReviewQueue onBack={() => navigate('dashboard')} />;
      default:
        return <LandingPage onSignIn={() => navigate('signin')} />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 bg-background-light dark:bg-background-dark overflow-x-hidden flex justify-center">
      <div className="w-full max-w-md h-full relative">
        {renderScreen()}
        
        {userRole && currentScreen !== 'camera' && currentScreen !== 'signin' && (
          <Navigation 
            activeTab={currentScreen} 
            role={userRole} 
            onNavigate={(screen) => navigate(screen)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
