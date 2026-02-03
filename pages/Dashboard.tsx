import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Database, Users, User, Bell, LogOut, Plus, 
  Trash2, FileText, ChevronRight, Activity, ShieldCheck, 
  Clock, CheckCircle2, AlertCircle, X, Search, MoreVertical, 
  Camera, Heart, Lock, Shield, Moon, Sun,
  Fingerprint, Smartphone, Video, Image as ImageIcon, Eye, PieChart,
  Download, Paperclip, Cloud, CreditCard, Scale, Package, 
  Edit3, Key, ShieldAlert, Phone, UserCircle, EyeOff, Upload,
  Gamepad2, Zap, Award, Save, Globe, Trash, Calendar, ListChecks, ChevronDown, MessageSquare, RefreshCw, Play, File as FileIcon
} from 'lucide-react';
import { AssetCategory, VerificationStatus, Asset, Nominee, UserRole, LegacyMedia, Permission } from '../types';

const Dashboard: React.FC = () => {
  const { user, setUser, assets, setAssets, nominees, setNominees, isDarkMode, setDarkMode, setCurrentPage } = useApp();
  const [activeView, setActiveView] = useState<'overview' | 'assets' | 'nominees' | 'legacy' | 'summary' | 'profile'>('overview');
  
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isAddingNominee, setIsAddingNominee] = useState(false);
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [assetCategory, setAssetCategory] = useState<AssetCategory>(AssetCategory.SOCIAL);
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>(['VIEW']);
  const [legacyMedia, setLegacyMedia] = useState<LegacyMedia[]>(user?.legacyMedia || []);
  const [tempAttachments, setTempAttachments] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const assetAttachmentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingAsset) {
      setTempAttachments(editingAsset.attachments || []);
    } else {
      setTempAttachments([]);
    }
  }, [editingAsset, isAddingAsset]);

  const stats = useMemo(() => [
    { label: 'Saved Assets', value: assets.length, icon: <Database size={20} />, color: 'text-accent' },
    { label: 'Trusted People', value: nominees.length, icon: <Heart size={20} />, color: 'text-rose-400' },
    { label: 'System Check', value: 'Healthy', icon: <ShieldCheck size={20} />, color: 'text-emerald-400' },
    { label: 'Syncing', value: 'Live', icon: <RefreshCw size={20} className="animate-spin" />, color: 'text-cyan-400' }
  ], [assets.length, nominees.length]);

  const assetCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(a => { 
      const cat = a.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1; 
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [assets]);

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const assetData: Asset = {
      id: editingAsset?.id || Math.random().toString(36).substr(2, 9),
      name: form.assetName.value,
      category: assetCategory,
      handle: form.dynamicField?.value || '',
      password: form.assetPassword?.value || '',
      description: form.description.value,
      attachments: tempAttachments,
      assignedNomineeIds: editingAsset?.assignedNomineeIds || [],
      status: 'Locked'
    };
    if (editingAsset) setAssets(assets.map(a => a.id === editingAsset.id ? assetData : a));
    else setAssets([...assets, assetData]);
    setIsAddingAsset(false);
    setEditingAsset(null);
    setTempAttachments([]);
  };

  const handleAssetAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files) as File[];
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setTempAttachments(prev => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (index: number) => {
    setTempAttachments(tempAttachments.filter((_, i) => i !== index));
  };

  const handleSaveNominee = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const nomineeData: Nominee = {
      id: editingNominee?.id || Math.random().toString(36).substr(2, 9),
      name: form.name.value,
      email: form.email.value,
      relationship: form.relationship.value,
      aadharNumber: form.aadhar.value,
      panNumber: form.pan.value,
      verificationStatus: VerificationStatus.VERIFIED,
      securityKey: editingNominee?.securityKey || `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-LEGACY`,
      permissions: selectedPerms
    };
    if (editingNominee) setNominees(nominees.map(n => n.id === editingNominee.id ? nomineeData : n));
    else setNominees([...nominees, nomineeData]);
    setIsAddingNominee(false);
    setEditingNominee(null);
    setSelectedPerms(['VIEW']);
  };

  const handleUploadMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia: LegacyMedia = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith('video') ? 'video' : 'image',
          name: file.name,
          url: reader.result as string
        };
        const updatedMedia = [...legacyMedia, newMedia];
        setLegacyMedia(updatedMedia);
        if (user) setUser({ ...user, legacyMedia: updatedMedia });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMedia = (id: string) => {
    const updatedMedia = legacyMedia.filter(m => m.id !== id);
    setLegacyMedia(updatedMedia);
    if (user) setUser({ ...user, legacyMedia: updatedMedia });
  };

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case AssetCategory.SOCIAL: return <Smartphone size={20} />;
      case AssetCategory.FINANCIAL: return <CreditCard size={20} />;
      case AssetCategory.CRYPTO: return <Fingerprint size={20} />;
      case AssetCategory.LEGAL: return <Scale size={20} />;
      case AssetCategory.GAMING: return <Gamepad2 size={20} />;
      case AssetCategory.HEIRLOOM: return <Package size={20} />;
      case AssetCategory.PERSONAL: return <FileText size={20} />;
      default: return <FileIcon size={20} />;
    }
  };

  const needsPassword = (cat: AssetCategory) => [AssetCategory.SOCIAL, AssetCategory.GAMING, AssetCategory.CRYPTO, AssetCategory.FINANCIAL].includes(cat);
  const needsHandle = (cat: AssetCategory) => [AssetCategory.SOCIAL, AssetCategory.CRYPTO, AssetCategory.GAMING, AssetCategory.FINANCIAL].includes(cat);
  const needsAttachments = (cat: AssetCategory) => [AssetCategory.FINANCIAL, AssetCategory.LEGAL, AssetCategory.PERSONAL, AssetCategory.HEIRLOOM].includes(cat);

  const viewTitles: Record<string, string> = {
    overview: 'Welcome Home',
    summary: 'The Big Picture',
    assets: 'My Assets',
    nominees: 'My Circle',
    legacy: 'My Voice',
    profile: 'My Info'
  };

  return (
    <div className="flex h-screen p-6 lg:p-10 gap-8 relative z-10 overflow-hidden text-slate-800 dark:text-slate-100">
      <aside className="w-64 glass rounded-[36px] flex flex-col p-8 shadow-3d shrink-0 border border-white/5">
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-accent-glow">
                <Globe className="text-white w-6 h-6" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase leading-none">E.D.I.T.H</span>
          </div>
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.4em] px-1">Heritage Gateway</span>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'overview', label: 'Home', icon: <LayoutDashboard size={20} /> },
            { id: 'summary', label: 'Summary', icon: <PieChart size={20} /> },
            { id: 'assets', label: 'My Vault', icon: <Database size={20} /> },
            { id: 'nominees', label: 'My People', icon: <Users size={20} /> },
            { id: 'legacy', label: 'My Voice', icon: <Heart size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[18px] font-black transition-all text-[11px] uppercase tracking-[0.15em] ${
                activeView === item.id ? 'bg-accent text-white shadow-accent-glow' : 'text-zinc-500 hover:text-accent dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => setCurrentPage('triggers')} className="w-full flex items-center gap-4 px-5 py-4 rounded-[18px] font-black text-zinc-500 hover:text-accent dark:hover:text-white transition-all text-[11px] uppercase tracking-[0.15em] hover:bg-black/5 dark:hover:bg-white/5">
            <Activity size={20} /> Safety Check
          </button>
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
          <button onClick={() => setDarkMode(!isDarkMode)} className="w-full flex items-center gap-4 px-5 py-4 rounded-[18px] font-black text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[11px] uppercase tracking-[0.15em]">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Go Bright' : 'Go Dark'}
          </button>
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-4 px-5 py-4 rounded-[18px] font-black text-rose-500 hover:bg-rose-500/10 transition-all text-[11px] uppercase tracking-[0.15em]">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-8 overflow-hidden">
        <header className="glass h-20 px-10 rounded-[28px] flex items-center justify-between shadow-glass border border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex flex-col">
             <h2 className="text-[10px] font-black tracking-[0.35em] text-accent uppercase leading-none">{viewTitles[activeView]}</h2>
             <span className="text-slate-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 opacity-70">Hey, {user?.name.split(' ')[0]}</span>
          </div>
          <button onClick={() => setActiveView('profile')} className="flex items-center gap-4 group hover:bg-black/5 dark:hover:bg-white/5 p-1.5 pr-6 rounded-[24px] transition-all">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-black dark:text-white text-slate-900 uppercase leading-none tracking-tight">{user?.name}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center shadow-accent-glow"><User size={22} /></div>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pb-20 pr-3">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div key={i} whileHover={{ y: -6, boxShadow: 'var(--shadow-3d)' }} className="glass p-8 rounded-[32px] relative overflow-hidden shadow-3d group">
                      <div className={`mb-5 transition-transform group-hover:scale-110 duration-500 ${stat.color}`}>{stat.icon}</div>
                      <p className="text-slate-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-60">{stat.label}</p>
                      <p className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass p-10 rounded-[40px] shadow-3d space-y-10 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">My Secure Vault</h3>
                      <button onClick={() => setActiveView('assets')} className="text-[10px] font-black text-accent uppercase tracking-widest hover:brightness-125 transition-all">Expand View</button>
                    </div>
                    {assets.length === 0 ? (
                      <div className="text-center py-24 bg-accent/[0.03] dark:bg-white/[0.01] rounded-[32px] border border-dashed border-accent/20 dark:border-white/10 shadow-inner">
                        <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-300 dark:text-zinc-600">
                          <Cloud size={44} className="opacity-40" />
                        </div>
                        <h4 className="text-lg font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-3">No Assets Secured</h4>
                        <p className="text-zinc-400 dark:text-zinc-500 mb-10 font-bold uppercase tracking-[0.1em] text-[10px] max-w-xs mx-auto">Start building your digital legacy by adding your first secure item.</p>
                        <button onClick={() => setIsAddingAsset(true)} className="px-10 py-5 bg-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-accent-glow hover:scale-105 active:scale-95 transition-all">Add First Asset</button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {assets.slice(0, 4).map(asset => (
                          <div key={asset.id} className="p-7 glass rounded-[32px] border border-slate-200 dark:border-white/5 hover:border-accent/40 shadow-3d group relative overflow-hidden">
                             <div className="flex items-center gap-3 mb-6 relative z-10">
                               <div className="text-accent bg-accent/5 p-2 rounded-lg">{getCategoryIcon(asset.category)}</div>
                               <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{asset.category}</span>
                             </div>
                             <p className="text-xl font-black dark:text-white text-slate-900 uppercase mb-4 truncate relative z-10">{asset.name}</p>
                             <div className="flex items-center gap-2 relative z-10">
                               <ShieldCheck size={14} className="text-emerald-400" />
                               <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest">End-to-End Encrypted</span>
                             </div>
                             <button onClick={() => { setEditingAsset(asset); setAssetCategory(asset.category); setIsAddingAsset(true); }} className="absolute top-7 right-7 p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-zinc-400 hover:text-accent transition-all opacity-0 group-hover:opacity-100"><Edit3 size={18} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="glass p-10 rounded-[40px] shadow-3d border border-slate-200 dark:border-white/10 group cursor-pointer hover:shadow-accent-glow transition-all" onClick={() => setActiveView('nominees')}>
                       <div className="w-16 h-16 bg-accent/5 rounded-3xl flex items-center justify-center mb-8 text-accent border border-accent/20 group-hover:scale-105 group-hover:shadow-accent-glow transition-all"><Users size={32} /></div>
                       <h3 className="text-lg font-black dark:text-white text-slate-900 uppercase leading-none mb-4 tracking-tight">Trusted People</h3>
                       <p className="text-slate-500 dark:text-zinc-400 text-[13px] font-medium mb-10 leading-relaxed">Securely assign guardians to manage your digital inheritance.</p>
                       <div className="flex items-center gap-2 text-[11px] font-black text-accent uppercase tracking-widest">Guardian List <ChevronRight size={16} /></div>
                    </div>
                    <div className="p-10 rounded-[40px] bg-accent text-white shadow-accent-glow cursor-pointer group border border-accent/10 hover:brightness-105 hover:shadow-button-hover transition-all" onClick={() => setActiveView('legacy')}>
                       <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-highlight group-hover:scale-105 transition-all"><Heart size={32} /></div>
                       <h3 className="text-lg font-black uppercase leading-none mb-4 tracking-tight">Final Messages</h3>
                       <p className="font-bold text-white/70 text-[13px] mb-10 leading-relaxed">Your voice matters. Record a legacy message or share a final heartfelt note.</p>
                       <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest">Open Recorder <ChevronRight size={16} /></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'assets' && (
              <motion.div key="assets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">My Vault</h3>
                  <button onClick={() => { setEditingAsset(null); setAssetCategory(AssetCategory.SOCIAL); setIsAddingAsset(true); }} className="px-8 py-4 bg-accent text-white rounded-[18px] font-black text-[11px] uppercase tracking-[0.2em] shadow-accent-glow hover:shadow-button-hover flex items-center gap-3 transition-all">
                    <Plus size={22} /> Secure New Item
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {assets.length === 0 ? (
                    <div className="col-span-full py-40 text-center glass rounded-[48px] border-2 border-dashed border-accent/20 dark:border-white/10 flex flex-col items-center justify-center shadow-inner">
                      <div className="w-24 h-24 bg-accent/5 rounded-[36px] flex items-center justify-center mb-10 text-zinc-300 dark:text-zinc-600 shadow-highlight">
                        <Database size={48} />
                      </div>
                      <h3 className="text-3xl font-black mb-4 dark:text-white text-slate-900 uppercase tracking-tighter">Your Vault is Silent</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 mb-14 max-w-sm mx-auto text-base font-medium leading-relaxed">
                        Securely store passwords, private keys, or legal documents to be transferred when you choose.
                      </p>
                      <button onClick={() => { setEditingAsset(null); setAssetCategory(AssetCategory.SOCIAL); setIsAddingAsset(true); }} className="px-12 py-6 bg-accent text-white rounded-[24px] font-black text-xs uppercase tracking-[0.25em] shadow-accent-glow hover:scale-[1.03] active:scale-95 transition-all">
                        Initialize First Entry
                      </button>
                    </div>
                  ) : (
                    assets.map(asset => (
                      <div key={asset.id} className="glass p-8 rounded-[40px] shadow-3d group relative border border-slate-200 dark:border-white/10 hover:shadow-accent-glow transition-all overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent border border-accent/20 group-hover:shadow-accent-glow transition-all">{getCategoryIcon(asset.category)}</div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingAsset(asset); setAssetCategory(asset.category); setIsAddingAsset(true); }} className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-accent/10 rounded-xl text-zinc-400 hover:text-accent transition-all"><Edit3 size={18} /></button>
                            <button onClick={() => setAssets(assets.filter(a => a.id !== asset.id))} className="p-2.5 bg-rose-500/5 hover:bg-rose-500/20 rounded-xl text-rose-400 transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        <h4 className="text-2xl font-black dark:text-white text-slate-900 uppercase mb-3 truncate tracking-tight">{asset.name}</h4>
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-6 opacity-80">{asset.category}</p>
                        <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-[14px] font-medium mb-10 line-clamp-2 h-10">{asset.description}</p>
                        
                        <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5"><Lock size={14} className="text-emerald-500" /><span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Fully Locked</span></div>
                          <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{asset.attachments?.length ? `${asset.attachments.length} Files` : 'No Files'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'nominees' && (
              <motion.div key="nominees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Trusted Circle</h3>
                  <button onClick={() => { setEditingNominee(null); setSelectedPerms(['VIEW']); setIsAddingNominee(true); }} className="px-8 py-4 bg-accent text-white rounded-[18px] font-black text-[11px] uppercase tracking-[0.2em] shadow-accent-glow hover:shadow-button-hover flex items-center gap-3 transition-all">
                    <Plus size={22} /> Invite Guardian
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {nominees.length === 0 ? (
                    <div className="col-span-full py-40 text-center glass rounded-[48px] border-2 border-dashed border-accent/20 dark:border-white/10 flex flex-col items-center justify-center shadow-inner">
                      <div className="w-24 h-24 bg-accent/5 rounded-[36px] flex items-center justify-center mb-10 text-zinc-300 dark:text-zinc-600 shadow-highlight">
                        <Users size={48} />
                      </div>
                      <h3 className="text-3xl font-black mb-4 dark:text-white text-slate-900 uppercase tracking-tighter">The Hub is Empty</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 mb-14 max-w-sm mx-auto text-base font-medium leading-relaxed">
                        Assign trusted people to receive your assets when our active triggers detect inactivity.
                      </p>
                      <button onClick={() => { setEditingNominee(null); setSelectedPerms(['VIEW']); setIsAddingNominee(true); }} className="px-12 py-6 bg-accent text-white rounded-[24px] font-black text-xs uppercase tracking-[0.25em] shadow-accent-glow hover:scale-[1.03] active:scale-95 transition-all">
                        Invite Guardian
                      </button>
                    </div>
                  ) : (
                    nominees.map(nominee => (
                      <div key={nominee.id} className="glass p-8 rounded-[40px] shadow-3d group relative border border-slate-200 dark:border-white/10 hover:shadow-accent-glow transition-all">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent border border-accent/20 transition-all"><User size={28} /></div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingNominee(nominee); setSelectedPerms(nominee.permissions); setIsAddingNominee(true); }} className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-accent/10 rounded-xl text-zinc-400 hover:text-accent transition-all"><Edit3 size={18} /></button>
                            <button onClick={() => setNominees(nominees.filter(n => n.id !== nominee.id))} className="p-2.5 bg-rose-500/5 hover:bg-rose-500/20 rounded-xl text-rose-400 transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        <h4 className="text-2xl font-black dark:text-white text-slate-900 uppercase mb-1 tracking-tight">{nominee.name}</h4>
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-6 opacity-80">{nominee.relationship}</p>
                        <div className="p-6 bg-black/[0.03] dark:bg-white/[0.02] rounded-[24px] mb-8 space-y-3 border border-slate-200 dark:border-white/5 shadow-inner">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Key size={10} /> Heritage Access Key</p>
                          <p className="font-mono text-[11px] dark:text-zinc-300 text-slate-900 break-all leading-relaxed font-bold">{nominee.securityKey}</p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {nominee.permissions.map(p => (
                            <span key={p} className="px-4 py-1.5 bg-accent/5 border border-accent/10 rounded-full text-[9px] font-black text-accent uppercase tracking-widest">Level: {p}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <header className="flex flex-col gap-2">
                  <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">My Legacy at a Glance</h3>
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-widest opacity-60 italic">Real-time status of your digital estate.</p>
                </header>
                
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="glass p-10 rounded-[40px] shadow-3d border border-slate-200 dark:border-white/10 group hover:shadow-accent-glow transition-all relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white shadow-accent-glow"><Database size={32} /></div>
                      <div>
                        <h4 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tight">Vault Inventory</h4>
                        <p className="text-accent text-[10px] font-black uppercase tracking-widest">{assets.length} items currently secured</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      {assetCategoryCounts.length === 0 ? (
                        <div className="p-8 text-center glass bg-black/[0.02] dark:bg-white/[0.01] rounded-[24px] border-2 border-dashed border-accent/10">
                          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Vault is currently empty.</p>
                        </div>
                      ) : (
                        assetCategoryCounts.map(cat => (
                          <div key={cat.name} className="flex items-center justify-between p-5 glass bg-black/[0.02] dark:bg-white/[0.02] rounded-[24px] border border-slate-200 dark:border-white/5 shadow-3d hover:border-accent/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="text-accent">{getCategoryIcon(cat.name as AssetCategory)}</div>
                                <span className="text-xs font-black dark:text-white text-slate-900 uppercase tracking-tight">{cat.name}</span>
                             </div>
                             <span className="text-xl font-black text-accent">{cat.count}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="glass p-10 rounded-[40px] shadow-3d border border-slate-200 dark:border-white/10 group hover:shadow-accent-glow transition-all">
                      <div className="flex items-center gap-6 mb-8 relative z-10">
                          <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20"><Users size={32} /></div>
                          <div>
                            <h4 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tight">Trusted Circle</h4>
                            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{nominees.length} active guardians</p>
                          </div>
                      </div>
                      <div className="space-y-3 relative z-10">
                        {nominees.length === 0 ? (
                          <div className="p-6 text-center glass bg-black/[0.02] dark:bg-white/[0.01] rounded-[24px] border-2 border-dashed border-rose-500/10">
                             <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">No guardians assigned yet.</p>
                          </div>
                        ) : (
                          nominees.slice(0, 3).map(n => (
                            <div key={n.id} className="flex items-center gap-4 p-4 glass bg-black/[0.02] dark:bg-white/[0.02] rounded-[20px] border border-slate-200 dark:border-white/5 shadow-3d">
                               <UserCircle size={18} className="text-rose-400" />
                               <span className="text-xs font-black dark:text-white text-slate-900 uppercase tracking-tight truncate">{n.name}</span>
                               <span className="ml-auto text-[9px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">{n.relationship}</span>
                            </div>
                          ))
                        )}
                        {nominees.length > 3 && (
                          <p className="text-center text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-4">And {nominees.length - 3} more trusted individuals</p>
                        )}
                      </div>
                    </div>

                    <div className="glass p-10 rounded-[40px] shadow-3d border-2 border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/[0.03] group hover:shadow-accent-glow transition-all">
                       <h5 className="text-[11px] font-black dark:text-white text-slate-900 uppercase tracking-[0.2em] mb-8">System Readiness Check</h5>
                       <div className="space-y-4">
                          <div className={`flex items-center gap-5 p-5 rounded-[24px] border transition-all ${user?.legacyMessage ? 'bg-emerald-500/5 border-emerald-500/20 shadow-3d' : 'bg-amber-500/5 border-amber-500/20 shadow-inner'}`}>
                             {user?.legacyMessage ? <CheckCircle2 className="text-emerald-500" size={24} /> : <AlertCircle className="text-amber-500" size={24} />}
                             <div className="flex flex-col">
                                <span className={`text-[11px] font-black uppercase tracking-tight ${user?.legacyMessage ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{user?.legacyMessage ? 'Note Synchronized' : 'Final Note Missing'}</span>
                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">{user?.legacyMessage ? 'Encrypted message stored' : 'Click to add heart-note'}</span>
                             </div>
                          </div>
                          <div className={`flex items-center gap-5 p-5 rounded-[24px] border transition-all ${legacyMedia.length > 0 ? 'bg-blue-500/5 border-blue-500/20 shadow-3d' : 'bg-slate-500/5 border-slate-200 dark:border-white/5 shadow-inner'}`}>
                             {legacyMedia.length > 0 ? <ImageIcon className="text-blue-500" size={24} /> : <FileText className="text-zinc-400" size={24} />}
                             <div className="flex flex-col">
                                <span className={`text-[11px] font-black uppercase tracking-tight ${legacyMedia.length > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-600'}`}>{legacyMedia.length > 0 ? `${legacyMedia.length} Memories Archived` : 'Archive is Silent'}</span>
                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">{legacyMedia.length > 0 ? 'Media nodes confirmed' : 'No images or videos stored'}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'legacy' && (
              <motion.div key="legacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto space-y-12 pb-20">
                 <div className="glass p-12 rounded-[48px] shadow-3d space-y-10 border border-slate-200 dark:border-white/10 hover:shadow-accent-glow transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Final Message</h3>
                           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 italic">Record a heartfelt note for the next generation.</p>
                        </div>
                        <button onClick={() => alert("Legacy vault synchronized.")} className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-[18px] font-black text-[11px] uppercase tracking-widest shadow-accent-glow hover:scale-[1.03] active:scale-95 transition-all"><Save size={20} /> Secure Note</button>
                    </div>
                    <div className="space-y-6">
                        <textarea 
                          placeholder="Hey there, if you're reading this, it means..." 
                          defaultValue={user?.legacyMessage}
                          onChange={(e) => { if(user) setUser({...user, legacyMessage: e.target.value})} }
                          className="w-full h-80 bg-black/[0.03] dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[32px] outline-none focus:border-accent p-10 text-slate-900 dark:text-slate-100 font-medium text-xl md:text-2xl leading-relaxed resize-none shadow-inner focus:shadow-highlight transition-all" 
                        />
                    </div>
                 </div>

                 <div className="glass p-12 rounded-[48px] shadow-3d space-y-12 border border-slate-200 dark:border-white/10 hover:shadow-accent-glow transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Memory Archive</h3>
                           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 italic">Preserve visuals that tell your story.</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <input type="file" ref={fileInputRef} onChange={handleUploadMedia} accept="image/*,video/*" className="hidden" />
                           <button onClick={() => fileInputRef.current?.click()} className="px-8 py-5 bg-accent/5 border border-accent/20 text-accent rounded-[18px] font-black text-[11px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-highlight flex items-center gap-4">
                             <Upload size={22} /> Archive Media
                           </button>
                        </div>
                    </div>

                    {legacyMedia.length === 0 ? (
                      <div className="p-24 text-center glass bg-black/[0.01] dark:bg-white/[0.01] rounded-[40px] border-2 border-dashed border-accent/10 dark:border-white/5 shadow-inner">
                        <ImageIcon size={64} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-8 opacity-30" />
                        <p className="text-zinc-500 font-black uppercase tracking-widest text-[11px] opacity-60">The digital archive awaits your first memory.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                        <AnimatePresence>
                          {legacyMedia.map((media) => (
                            <motion.div 
                              key={media.id}
                              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 15 }}
                              className="group relative aspect-square glass rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-accent/40 shadow-3d transition-all"
                            >
                              {media.type === 'image' ? (
                                <img src={media.url} alt={media.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                                  <Video size={40} className="text-white/30 group-hover:text-accent transition-colors md:w-12 md:h-12" />
                                  <div className="absolute inset-0 bg-black/40" />
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-accent-glow">
                                    <Play size={22} className="text-white fill-white ml-1.5" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                <p className="text-[10px] font-black text-white truncate mb-4 uppercase tracking-tight">{media.name}</p>
                                <button onClick={() => handleDeleteMedia(media.id)} className="w-full py-3 bg-rose-500/90 text-white rounded-[14px] font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg">
                                  <Trash size={14} /> Remove Entry
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                 </div>
              </motion.div>
            )}

            {activeView === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto glass p-12 rounded-[40px] shadow-3d space-y-10 text-center border border-slate-200 dark:border-white/10 hover:shadow-accent-glow transition-all">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-accent/20 rounded-[32px] border border-accent/40 flex items-center justify-center text-accent mx-auto relative overflow-hidden group cursor-pointer shadow-accent-glow">
                    <User size={64} /><div className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"><Camera size={24} /></div>
                  </div>
                </div>
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Name</label><input defaultValue={user?.name} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent font-bold text-lg dark:text-white text-slate-900 shadow-inner focus:shadow-highlight transition-all" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Email</label><input defaultValue={user?.email} disabled className="w-full px-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none opacity-60 font-bold text-lg dark:text-white text-slate-900 shadow-inner" /></div>
                    <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Phone</label><input type="tel" defaultValue={user?.phone} placeholder="+91 99XXXXXXX" className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent font-bold text-lg dark:text-white text-slate-900 shadow-inner focus:shadow-highlight transition-all" /></div>
                  </div>
                  <button onClick={() => alert("Profile updated.")} className="w-full py-5 bg-accent text-white rounded-[24px] font-bold text-lg uppercase tracking-tight shadow-accent-glow hover:scale-[1.02] hover:shadow-button-hover active:scale-95 transition-all">Save My Info</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isAddingAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-void-950/80 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass p-8 md:p-12 rounded-[40px] md:rounded-[48px] w-full max-w-xl shadow-3d border border-white/10 overflow-visible relative">
              <button onClick={() => { setIsAddingAsset(false); setEditingAsset(null); }} className="absolute top-10 right-10 p-3 bg-black/5 dark:bg-white/5 rounded-full text-zinc-500 hover:text-rose-500 transition-all shadow-highlight"><X size={22} /></button>
              <h2 className="text-3xl font-black mb-10 dark:text-white text-slate-900 uppercase tracking-tighter leading-none">{editingAsset ? 'Modify Entry' : 'Secure Entry'}</h2>
              <form onSubmit={handleSaveAsset} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Vault Item Label</label><input name="assetName" required defaultValue={editingAsset?.name} placeholder="Item Name" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                  <div className="space-y-2 relative"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Classification</label>
                    <div className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg cursor-pointer flex justify-between items-center group hover:bg-black/5 dark:hover:bg-white/10 shadow-inner hover:shadow-highlight transition-all" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                        <div className="flex items-center gap-3"><span className="text-accent">{getCategoryIcon(assetCategory)}</span><span className="truncate">{assetCategory}</span></div><ChevronDown size={22} className={`text-accent transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>{isCategoryOpen && (<><div className="fixed inset-0 z-[110]" onClick={() => setIsCategoryOpen(false)} /><motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="absolute z-[120] top-full mt-4 w-full glass rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 p-3"><div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">{Object.values(AssetCategory).map(cat => (<div key={cat} className={`px-6 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-tight cursor-pointer transition-all flex items-center gap-4 ${assetCategory === cat ? 'bg-accent text-white shadow-accent-glow' : 'text-slate-900 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-highlight'}`} onClick={() => { setAssetCategory(cat); setIsCategoryOpen(false); }}><div className={assetCategory === cat ? 'text-white' : 'text-accent'}>{getCategoryIcon(cat)}</div>{cat}</div>))}</div></motion.div></>)}</AnimatePresence>
                  </div>
                </div>
                <AnimatePresence mode="popLayout">{(needsHandle(assetCategory) || needsPassword(assetCategory)) && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">{needsHandle(assetCategory) && (<div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Identifier</label><input name="dynamicField" defaultValue={editingAsset?.handle} placeholder="@user_id" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>)}{needsPassword(assetCategory) && (<div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Secret Key</label><input name="assetPassword" type="password" defaultValue={editingAsset?.password} placeholder="••••••••" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>)}</motion.div>)}</AnimatePresence>
                
                {needsAttachments(assetCategory) && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Heritage Archive</label>
                    <div onClick={() => assetAttachmentRef.current?.click()} className="w-full p-10 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-inner group shadow-highlight">
                      <Upload size={28} className="text-zinc-400 group-hover:text-accent transition-all" />
                      <span className="text-[11px] font-black text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 uppercase tracking-widest">Upload Heritage Files</span>
                      <input type="file" multiple ref={assetAttachmentRef} onChange={handleAssetAttachment} className="hidden" />
                    </div>
                    {tempAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 px-2">
                        {tempAttachments.map((fileData, idx) => (
                          <div key={idx} className="flex items-center gap-3 px-5 py-2.5 bg-accent/5 border border-accent/20 rounded-full text-[10px] font-black text-accent shadow-highlight group transition-all">
                            <FileIcon size={14} />
                            <span className="max-w-[140px] truncate">Document_{idx + 1}</span>
                            <button type="button" onClick={() => removeAttachment(idx)} className="hover:text-rose-500 transition-colors"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Heritage Instructions</label><textarea name="description" required defaultValue={editingAsset?.description} placeholder="How should this be handled later?" className="w-full px-8 py-5 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] outline-none focus:border-accent dark:text-white text-slate-900 font-medium text-lg h-28 resize-none shadow-inner focus:shadow-highlight transition-all" /></div>
                <div className="flex gap-4 pt-4"><button type="submit" className="flex-1 py-5 bg-accent text-white rounded-[20px] font-black text-lg uppercase tracking-widest shadow-accent-glow hover:scale-[1.02] hover:shadow-button-hover active:scale-95 transition-all">Secure in Vault</button><button type="button" onClick={() => { setIsAddingAsset(false); setEditingAsset(null); }} className="px-10 py-5 glass text-zinc-500 rounded-[20px] font-black text-lg uppercase hover:text-rose-500 hover:shadow-highlight transition-all">Cancel</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingNominee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-void-950/80 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass p-8 md:p-12 rounded-[40px] md:rounded-[48px] w-full max-w-xl shadow-3d border border-white/10 overflow-hidden relative">
              <button onClick={() => { setIsAddingNominee(false); setEditingNominee(null); }} className="absolute top-10 right-10 p-3 bg-black/5 dark:bg-white/5 rounded-full text-zinc-500 hover:text-rose-500 transition-all shadow-highlight"><X size={22} /></button>
              <h2 className="text-3xl font-black mb-10 dark:text-white text-slate-900 uppercase tracking-tighter leading-none">{editingNominee ? 'Update Guardian' : 'Invite Guardian'}</h2>
              <form onSubmit={handleSaveNominee} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Guardian Name</label><input name="name" required defaultValue={editingNominee?.name} placeholder="Legal Name" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Relationship</label><input name="relationship" required defaultValue={editingNominee?.relationship} placeholder="e.g. Spouse" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Secure Email (Vault Access)</label><input name="email" required type="email" defaultValue={editingNominee?.email} placeholder="guardian@email.com" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Aadhar Number</label><input name="aadhar" required defaultValue={editingNominee?.aadharNumber} placeholder="12-digit Code" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Pan Card Number</label><input name="pan" required defaultValue={editingNominee?.panNumber} placeholder="Secondary ID" className="w-full px-6 py-4 bg-black/[0.02] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[18px] outline-none focus:border-accent dark:text-white text-slate-900 font-bold text-lg shadow-inner focus:shadow-highlight transition-all" /></div>
                </div>
                <div className="flex gap-4 pt-6"><button type="submit" className="flex-1 py-5 bg-accent text-white rounded-[20px] font-black text-lg uppercase tracking-widest shadow-accent-glow hover:scale-[1.02] hover:shadow-button-hover active:scale-95 transition-all">Assign as Guardian</button><button type="button" onClick={() => { setIsAddingNominee(false); setEditingNominee(null); }} className="px-10 py-5 glass text-zinc-500 rounded-[20px] font-black text-lg uppercase hover:text-rose-500 hover:shadow-highlight transition-all">Cancel</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;