import React from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { Shield, Users, Lock, ChevronRight, Moon, Sun, Heart, Activity, Globe } from 'lucide-react';
import VaultAnimation from '../components/VaultAnimation';

const LandingPage: React.FC = () => {
  const { setCurrentPage, isDarkMode, setDarkMode } = useApp();

  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 glass rounded-[28px] px-8 h-16 flex items-center justify-between shadow-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-accent-glow">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter dark:text-white uppercase">E.D.I.T.H</span>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <button 
            onClick={() => setCurrentPage('privacy')}
            className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-accent transition-colors hidden md:block"
          >
            Trust Center
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-500 hover:text-accent"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 bg-accent text-white rounded-[14px] font-bold text-[10px] uppercase tracking-widest shadow-accent-glow hover:scale-105 hover:shadow-button-hover active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-10 shadow-highlight">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Electronic Digital Inheritance & Transfer Hub</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1] dark:text-white tracking-tight mb-10">
              Your legacy, <br /><span className="text-accent italic">safely passed on.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-14 max-w-lg leading-relaxed font-medium">
              E.D.I.T.H provides a premium gateway for your digital estate—ensuring vital assets reach your chosen heirs with absolute security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => setCurrentPage('signup')}
                className="px-10 py-5 bg-accent text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-accent-glow hover:scale-[1.03] hover:shadow-button-hover active:scale-95 transition-all uppercase tracking-tight"
              >
                Secure My Future <ChevronRight size={24} />
              </button>
              <button 
                onClick={() => setCurrentPage('beneficiary-auth')}
                className="px-10 py-5 glass dark:text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-highlight active:scale-95 transition-all uppercase tracking-tight"
              >
                Access Legacy <Users size={24} />
              </button>
            </div>
          </motion.div>

          <div className="hidden lg:block relative h-[600px] w-full">
            <VaultAnimation />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-48 grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            { 
              icon: <Lock size={26} className="text-accent" />, 
              title: "Digital Vault", 
              desc: "Store critical assets in an end-to-end encrypted space that remains invisible until life events are verified." 
            },
            { 
              icon: <Activity size={26} className="text-accent" />, 
              title: "Active Pulse", 
              desc: "Intelligent inactivity monitoring ensures that if you stop checking in, your legacy process initiates automatically." 
            },
            { 
              icon: <Heart size={26} className="text-accent" />, 
              title: "Human Protocol", 
              desc: "Verified handover ensures that your digital wealth and final messages reach the correct hands with honor." 
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, boxShadow: 'var(--shadow-3d)' }}
              className="p-10 md:p-12 glass rounded-[40px] shadow-highlight group transition-all duration-500 border border-white/5"
            >
              <div className="w-16 h-16 bg-accent/5 rounded-[24px] flex items-center justify-center mb-10 border border-accent/20 group-hover:bg-accent group-hover:text-white group-hover:shadow-accent-glow transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-5 dark:text-white tracking-tighter uppercase">{item.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
      
      <footer className="relative z-10 py-20 text-center">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] opacity-50">Secure Handover Technology • E.D.I.T.H Council</p>
      </footer>
    </div>
  );
};

export default LandingPage;