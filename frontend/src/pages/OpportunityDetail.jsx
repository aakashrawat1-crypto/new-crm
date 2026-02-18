import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
    Briefcase,
    ArrowLeft,
    CheckSquare,
    FileText,
    Package,
    MessageSquare,
    Save,
    CheckCircle2,
    DollarSign,
    Target,
    XCircle,
    Eye,
    StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OpportunityDetail = () => {
    const { id } = useParams();
    const [opportunity, setOpportunity] = useState(null);
    const [account, setAccount] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const [formData, setFormData] = useState({
        git: '',
        pmChecklist: '',
        qbrNotes: '',
        internalNotes: '',
        productIds: [],
        stage: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [oppRes, prodRes] = await Promise.all([
                    api.get(`/opportunities/${id}`),
                    api.get('/products')
                ]);

                setOpportunity(oppRes.data);
                setProducts(prodRes.data);
                setFormData({
                    git: oppRes.data.git || '',
                    pmChecklist: oppRes.data.pmChecklist || '',
                    qbrNotes: oppRes.data.qbrNotes || '',
                    internalNotes: oppRes.data.internalNotes || '',
                    productIds: oppRes.data.productIds || [],
                    stage: oppRes.data.stage || ''
                });

                // Fetch parent account details
                if (oppRes.data.accountId) {
                    const accRes = await api.get(`/accounts/${oppRes.data.accountId}`);
                    setAccount(accRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSave = async (updates = {}) => {
        setSaving(true);
        const finalData = { ...formData, ...updates };
        try {
            const res = await api.patch(`/opportunities/${id}`, finalData);
            setOpportunity(res.data);
            setFormData(prev => ({ ...prev, ...updates }));
            if (Object.keys(updates).length > 0) {
                alert(`Status updated to: ${updates.stage}`);
            } else {
                alert('Progress saved successfully!');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = (newStage) => {
        handleSave({ stage: newStage });
    };

    const toggleProduct = (prodId) => {
        setFormData(prev => ({
            ...prev,
            productIds: prev.productIds.includes(prodId)
                ? prev.productIds.filter(pid => pid !== prodId)
                : [...prev.productIds, prodId]
        }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!opportunity) return (
        <div className="text-center py-20 bg-[var(--card)] rounded-[32px] border border-[var(--input-border)]">
            <h3 className="text-[var(--text-primary)] font-bold text-xl">Opportunity Not Found</h3>
            <Link to="/opportunities" className="text-indigo-500 mt-4 inline-block hover:underline">Return to Pipeline</Link>
        </div>
    );

    const tabs = [
        { id: 'overview', name: 'Overview', icon: Briefcase },
        { id: 'git', name: 'GIT Notes', icon: MessageSquare },
        { id: 'pm', name: 'Checklist', icon: CheckSquare },
        { id: 'qbr', name: 'QBR Record', icon: FileText },
        { id: 'notes', name: 'Internal Notes', icon: StickyNote },
        { id: 'products', name: 'Inventory', icon: Package },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-6xl mx-auto pb-32"
        >
            {/* Top Bar Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Link to="/opportunities" className="w-10 h-10 flex items-center justify-center bg-[var(--card)] border border-[var(--input-border)] rounded-full text-[var(--text-primary)] hover:bg-white/5 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{opportunity.dealDetail || 'Untitled Opportunity'}</h1>
                            <span className={`px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${opportunity.stage === 'Closed Won' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' :
                                opportunity.stage === 'Closed Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' :
                                    'bg-indigo-500/10 text-indigo-500 border-indigo-500/10'
                                }`}>
                                {opportunity.stage} Status Active
                            </span>
                        </div>
                        <p className="text-[var(--text-secondary)] font-medium text-xs mt-1 uppercase tracking-[0.2em] opacity-40">Managed Strategic Pipeline Entity</p>
                    </div>
                </div>
                <button
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all font-bold shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} />
                    {saving ? 'UPDATING...' : 'PERSIST PROGRESS'}
                </button>
            </div>

            {/* Content Control Tabs */}
            <div className="flex overflow-x-auto p-1.5 bg-[var(--background)]/40 border border-[var(--input-border)] rounded-[24px] scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-[var(--card)] text-indigo-500 shadow-xl border border-[var(--input-border)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-500' : 'opacity-40'} />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Main Application Interface */}
            <div className="bg-[var(--card)] rounded-[40px] border border-[var(--input-border)] shadow-[0_32px_80px_rgba(0,0,0,0.4)] p-8 min-h-[500px] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-1">Lifecycle Stage</label>
                                        <div className="relative">
                                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 opacity-60" size={18} />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-[var(--text-primary)] font-semibold appearance-none"
                                                value={formData.stage}
                                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                            >
                                                {['Prospect', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost', 'Review'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-1">Client Node</label>
                                        <div className="p-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="text-indigo-500 opacity-40" size={18} />
                                                <div className="text-[var(--text-primary)] font-bold">{account?.name || 'Loading Client...'}</div>
                                            </div>
                                            {account && (
                                                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[9px] font-bold uppercase border border-indigo-500/10">
                                                    {account.industry || 'Enterprise'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-1">Engagement Description</label>
                                    <div className="p-6 bg-[var(--background)]/30 border border-[var(--input-border)] rounded-3xl text-[var(--text-primary)] leading-relaxed italic opacity-80 shadow-inner">
                                        {opportunity.dealDetail || 'System generated: Initial outreach and service identification in progress.'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {['git', 'pm', 'qbr', 'notes'].includes(activeTab) && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">
                                        {activeTab === 'git' ? 'Real-time Stakeholder Communication Log' :
                                            activeTab === 'pm' ? 'Operational Project Management Checklist' :
                                                activeTab === 'qbr' ? 'Quarterly Performance Analytics & Review' :
                                                    'Strategic Internal Intelligence Notes'}
                                    </h3>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 transition-all animate-pulse"></div>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full h-[350px] p-8 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-[32px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-[var(--text-primary)] placeholder:opacity-30 resize-none font-medium leading-relaxed"
                                    placeholder="Initiating log sequence. Please enter detailed technical notes or business observations..."
                                    value={activeTab === 'git' ? formData.git : activeTab === 'pm' ? formData.pmChecklist : activeTab === 'qbr' ? formData.qbrNotes : formData.internalNotes}
                                    onChange={(e) => setFormData({ ...formData, [activeTab === 'git' ? 'git' : activeTab === 'pm' ? 'pmChecklist' : activeTab === 'qbr' ? 'qbrNotes' : 'internalNotes']: e.target.value })}
                                />
                                <div className="flex items-center gap-3 mt-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <CheckCircle2 size={16} className="text-indigo-500 opacity-60" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Autosave disabled. Please persist changes manually via the primary action node.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Service Inventory Mapping</h3>
                                    <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">
                                        {formData.productIds.length} Selections Active
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {products.map(prod => (
                                        <button
                                            key={prod.id}
                                            onClick={() => toggleProduct(prod.id)}
                                            className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all text-left group ${formData.productIds.includes(prod.id)
                                                ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg'
                                                : 'border-[var(--input-border)] hover:border-indigo-500/30 bg-[var(--input-bg)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.productIds.includes(prod.id) ? 'bg-indigo-500 text-white' : 'bg-[var(--background)]/50 text-[var(--text-secondary)]'
                                                    }`}>
                                                    <Package size={22} className={formData.productIds.includes(prod.id) ? 'scale-110' : 'opacity-40 group-hover:scale-110 transition-transform'} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[var(--text-primary)] text-lg leading-tight">{prod.name}</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 mt-0.5">{prod.category}</div>
                                                </div>
                                            </div>
                                            {formData.productIds.includes(prod.id) && (
                                                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Workflow Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => updateStatus('Closed Won')}
                    className="group bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 p-6 rounded-[32px] transition-all duration-300 flex items-center justify-between active:scale-95"
                >
                    <div className="text-left">
                        <div className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Finalize Sequence</div>
                        <div className="text-xl font-bold mt-1">Closed Won</div>
                    </div>
                    <CheckCircle2 size={32} className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>

                <button
                    onClick={() => updateStatus('Closed Lost')}
                    className="group bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 p-6 rounded-[32px] transition-all duration-300 flex items-center justify-between active:scale-95"
                >
                    <div className="text-left">
                        <div className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Terminate Deal</div>
                        <div className="text-xl font-bold mt-1">Closed Lost</div>
                    </div>
                    <XCircle size={32} className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>

                <button
                    onClick={() => updateStatus('Review')}
                    className="group bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white border border-indigo-500/20 p-6 rounded-[32px] transition-all duration-300 flex items-center justify-between active:scale-95"
                >
                    <div className="text-left">
                        <div className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Strategic Audit</div>
                        <div className="text-xl font-bold mt-1">Review</div>
                    </div>
                    <Eye size={32} className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>
            </div>

            {/* System Intelligence Tag */}
            <div className="pt-10 flex flex-col items-center opacity-10 select-none pointer-events-none">
                <span className="text-[8px] uppercase font-bold tracking-[1em] text-[var(--text-primary)]">
                    Smart CRM Business Information Layer
                </span>
            </div>
        </motion.div>
    );
};

export default OpportunityDetail;
