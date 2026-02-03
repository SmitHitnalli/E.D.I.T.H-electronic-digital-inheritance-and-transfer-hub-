import React from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Shield, Bell, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const TriggerSettings: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen relative flex flex-col p-8 gap-8 text-slate-800 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto w-full">
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="mb-12 flex items-center gap-3 text-slate-500 dark:text-zinc-500 hover:text-accent transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <header className="mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-8">
            <Activity size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Inactivity Triggers</span>
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tight dark:text-white text-slate-900 uppercase">Safety Protocol</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xl font-medium max-w-2xl">Configure how the E.D.I.T.H hub monitors your activity and when heritage assets are shared.</p>
        </header>

        <div className="grid gap-10">
          <motion.div whileHover={{ scale: 1.01 }} className="glass p-12 rounded-[56px] shadow-3d border border-slate-200 dark:border-white/10 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-start gap-10">
               <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent border border-accent/20 group-hover:scale-110 transition-transform">
                  <Clock size={40} />
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tight">Active Pulse</h3>
                   <span className="px-5 py-2 glass bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">Active</span>
                 </div>
                 <p className="text-slate-500 dark:text-zinc-400 mb-10 leading-relaxed text-lg font-medium">
                   If the terminal remains inactive for <span className="text-accent font-black">90 days</span>, E.D.I.T.H will initiate the secure check-in protocol.
                 </p>
                 <div className="flex items-center gap-6 p-6 glass rounded-[32px] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2">
                    <Bell className="text-accent" size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">Global notifications sent to linked heirs.</span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Sequence Box with fixed visibility for bluish/whitish light mode */}
          <div className="bg-accent p-12 md:p-16 rounded-[64px] text-white shadow-accent-glow relative overflow-hidden border border-accent/20">
             <div className="absolute top-0 right-0 p-16 opacity-10">
                <Shield size={240} />
             </div>
             <h3 className="text-4xl font-black mb-12 uppercase tracking-tight leading-none relative z-10">Protocol Sequence</h3>
             <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-6 p-8 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-2xl bg-white text-accent flex items-center justify-center font-black text-xl shadow-lg shrink-0">1</div>
                    <p className="font-bold text-lg uppercase tracking-tight text-white">Heir submits Heritage ID Key</p>
                </div>
                <div className="flex items-center gap-6 p-8 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-2xl bg-white text-accent flex items-center justify-center font-black text-xl shadow-lg shrink-0">2</div>
                    <p className="font-bold text-lg uppercase tracking-tight text-white">Hub verifies identity and active trigger status</p>
                </div>
                <div className="flex items-center gap-6 p-8 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-2xl bg-white text-accent flex items-center justify-center font-black text-xl shadow-lg shrink-0">3</div>
                    <p className="font-bold text-lg uppercase tracking-tight text-white">Asset encryption released for download</p>
                </div>
             </div>
             <button className="w-full mt-16 py-8 bg-white text-accent rounded-[32px] font-black text-2xl uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-3d flex items-center justify-center gap-4 active:scale-95 relative z-10">
                Lock Protocol <Shield size={28} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerSettings;