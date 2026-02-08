
import React, { useState } from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { UserRole, AccountStatus } from '../types';
import { Shield, ArrowLeft, HelpCircle, Eye, EyeOff, Globe, Zap, Fingerprint, Sun, Moon } from 'lucide-react';
import OnboardingGuide from '../components/OnboardingGuide';

const Auth: React.FC = () => {
  const { setUser, setCurrentPage, currentPage, isDarkMode, setDarkMode, setTutorialStep } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(currentPage === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || (activeTab === 'login' ? 'User' : 'New Member'),
      email: email || 'user@email.com',
      role: currentPage === 'beneficiary-auth' ? UserRole.BENEFICIARY : UserRole.BENEFACTOR,
      status: AccountStatus.ACTIVE,
      lastActive: new Date().toISOString()
    };
    
    if (activeTab === 'signup' && currentPage !== 'beneficiary-auth') {
      setTempUser(mockUser);
      setShowOnboarding(true);
    } else {
      setUser(mockUser);
      setCurrentPage(currentPage === 'beneficiary-auth' ? 'beneficiary-dashboard' : 'dashboard');
    }
  };

  const finishOnboarding = () => {
    setUser(tempUser);
    setShowOnboarding(false);
    setTutorialStep('WELCOME'); // Start initialization protocol
    setCurrentPage('dashboard');
  };

  const isBeneficiaryAuth = currentPage === 'beneficiary-auth';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 3D-ish Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[400px] h-[400px] border border-accent/10 rounded-full -mr-48 -mt-48 -z-10"
      />

      <OnboardingGuide isOpen={showOnboarding} onClose={finishOnboarding} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 text-zinc-500 hover:text-accent transition-all font-bold text-[11px] uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Start
          </button>
          
          <button 
            onClick={() => setDarkMode(!isDarkMode)}
            className="p-3 glass rounded-xl hover:bg-white/5 transition-colors text-zinc-500 hover:text-accent"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="glass p-10 rounded-[32px] shadow-3d relative overflow-hidden">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-accent-glow">
              <Globe className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black dark:text-white tracking-tight uppercase leading-none mb-2">
              {isBeneficiaryAuth ? 'Heir Portal' : (activeTab === 'login' ? 'Welcome Back' : 'Create Account')}
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-80">
              {isBeneficiaryAuth 
                ? 'Check in to an inheritance shared with you.' 
                : 'Protect your digital future in just a few clicks.'}
            </p>
          </div>

          {!isBeneficiaryAuth && (
            <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[16px] mb-10 border border-slate-200 dark:border-white/5 shadow-inner">
              <button 
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-[12px] font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'login' ? 'bg-accent text-white shadow-accent-glow' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 rounded-[12px] font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'signup' ? 'bg-accent text-white shadow-accent-glow' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {activeTab === 'signup' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] focus:border-accent outline-none transition-all dark:text-white font-bold text-lg shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] focus:border-accent outline-none transition-all dark:text-white font-bold text-lg shadow-inner"
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3">Secret Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] focus:border-accent outline-none transition-all dark:text-white font-bold text-lg pr-16 shadow-inner"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-accent text-white rounded-[20px] font-bold text-lg uppercase tracking-tight shadow-accent-glow hover:scale-[1.02] active:scale-95 transition-all mt-8"
            >
              {isBeneficiaryAuth ? 'Enter Gateway' : (activeTab === 'login' ? 'Unlock Vault' : 'Secure My Legacy')}
            </button>
          </form>

          {isBeneficiaryAuth && (
            <div className="mt-10 p-6 bg-accent/5 rounded-[24px] border border-accent/10 flex gap-4 items-start shadow-inner">
              <Fingerprint className="text-accent shrink-0 mt-1" size={24} />
              <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wide opacity-90">
                To enter, you'll need the unique 12-digit heritage key provided by the benefactor.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
