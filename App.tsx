import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserRole, AccountStatus, UserProfile, Asset, Nominee } from './types';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BeneficiaryDashboard from './pages/BeneficiaryDashboard';
import TriggerSettings from './pages/TriggerSettings';
import PrivacyTrust from './pages/PrivacyTrust';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, LogOut, Skull, Heart } from 'lucide-react';

export type TutorialStep = 
  | 'WELCOME' 
  | 'NAV_VAULT' 
  | 'ADD_ASSET' 
  | 'NAV_PEOPLE' 
  | 'ADD_NOMINEE' 
  | 'NAV_VOICE' 
  | 'NAV_PROFILE'
  | 'EDIT_PROFILE'
  | 'COMPLETE';

interface AppContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  isDarkMode: boolean;
  setDarkMode: (d: boolean) => void;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  nominees: Nominee[];
  setNominees: React.Dispatch<React.SetStateAction<Nominee[]>>;
  currentPage: string;
  setCurrentPage: (p: string) => void;
  markAsDeceased: (benefactorId: string) => void;
  tutorialStep: TutorialStep | null;
  setTutorialStep: (step: TutorialStep | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edith_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDarkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('edith_theme');
    return saved ? saved === 'dark' : true;
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep | null>(() => {
    const saved = localStorage.getItem('edith_tutorial_step');
    return saved ? (saved as TutorialStep) : null;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('edith_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('edith_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('edith_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edith_user');
    }
  }, [user]);

  useEffect(() => {
    if (tutorialStep) {
      localStorage.setItem('edith_tutorial_step', tutorialStep);
    } else {
      localStorage.removeItem('edith_tutorial_step');
    }
  }, [tutorialStep]);

  const markAsDeceased = (benefactorId: string) => {
    if (user && user.id === benefactorId) {
      setUser({ ...user, status: AccountStatus.DECEASED });
    }
  };

  const renderPage = () => {
    if (user && user.status === AccountStatus.DECEASED) {
       return (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-void-950/90 backdrop-blur-xl">
           <motion.div 
             initial={{ scale: 0.95, opacity: 0, y: 15 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             className="glass p-12 rounded-[32px] max-w-lg w-full text-center shadow-3d relative"
           >
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-rose-500 to-accent" />
             <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500 border border-rose-500/20 shadow-lg">
                <Skull size={40} />
             </div>
             <h2 className="text-3xl font-black mb-4 tracking-tight uppercase leading-none dark:text-white">Inheritance Locked</h2>
             <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg leading-relaxed font-medium">
               This account is now in legacy mode. Your digital estate has been handed over to your chosen heirs.
             </p>
             <button 
               onClick={() => { setUser(null); setCurrentPage('home'); setTutorialStep(null); }}
               className="w-full py-5 bg-accent text-white rounded-[18px] font-bold text-lg uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-accent-glow"
             >
               <LogOut size={20} className="inline mr-3" /> Exit Securely
             </button>
           </motion.div>
         </div>
       );
    }

    if (!user) {
      switch (currentPage) {
        case 'login': 
        case 'signup': 
        case 'beneficiary-auth': return <Auth />;
        case 'privacy': return <PrivacyTrust />;
        case 'home':
        default: return <LandingPage />;
      }
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'beneficiary-dashboard': return <BeneficiaryDashboard />;
      case 'triggers': return <TriggerSettings />;
      case 'privacy': return <PrivacyTrust />;
      case 'home': return <LandingPage />;
      default: return user.role === UserRole.BENEFACTOR ? <Dashboard /> : <BeneficiaryDashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, isDarkMode, setDarkMode, assets, setAssets, 
      nominees, setNominees, currentPage, setCurrentPage, markAsDeceased,
      tutorialStep, setTutorialStep
    }}>
      <div className="min-h-screen relative overflow-x-hidden selection:bg-accent selection:text-white transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (user?.id || 'guest')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export default App;