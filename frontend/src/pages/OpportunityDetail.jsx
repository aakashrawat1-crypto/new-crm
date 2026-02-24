import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    ArrowLeft,
    Briefcase,
    DollarSign,
    Target,
    Building2,
    Calendar,
    GitBranch,
    ClipboardList,
    BarChart3,
    Package,
    Save,
    CheckCircle2 // Missing icon added
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGE_CONFIG = {
    Prospect: { color: 'bg-sky-500/20 text-sky-600 border-sky-300', dot: 'bg-sky-500' },
    Qualification: { color: 'bg-violet-500/20 text-violet-600 border-violet-300', dot: 'bg-violet-500' },
    Proposal: { color: 'bg-amber-500/20 text-amber-600 border-amber-300', dot: 'bg-amber-500' },
    Negotiation: { color: 'bg-orange-500/20 text-orange-600 border-orange-300', dot: 'bg-orange-500' },
    'Closed Won': { color: 'bg-emerald-500/20 text-emerald-600 border-emerald-300', dot: 'bg-emerald-500' },
    'Closed Lost': { color: 'bg-rose-500/20 text-rose-600 border-rose-300', dot: 'bg-rose-500' },
    Review: { color: 'bg-indigo-500/20 text-indigo-600 border-indigo-300', dot: 'bg-indigo-500' },
};

const formatCurrency = (val) =>
    val || val === 0
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(val)
        : '—';

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US') : '—';

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [opportunity, setOpportunity] = useState(null);
    const [account, setAccount] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for UI
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const [formData, setFormData] = useState({
        git: '',
        pmChecklist: '',
        qbrNotes: '',
        internalNotes: '',
        productIds: [],
        stage: 'Prospect',
    });

    useEffect(() => {
        if (!id) {
            setError('Invalid opportunity ID');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [oppRes, prodRes] = await Promise.all([
                    api.get(`/opportunities/${id}`),
                    api.get('/products'),
                ]);

                if (!oppRes.data) throw new Error('Opportunity not found');

                const opp = oppRes.data;
                setOpportunity(opp);
                setProducts(prodRes.data || []);

                setFormData({
                    git: opp.git || '',
                    pmChecklist: opp.pmChecklist || '',
                    qbrNotes: opp.qbrNotes || '',
                    internalNotes: opp.internalNotes || '',
                    productIds: opp.productIds || [],
                    stage: opp.stage || 'Prospect',
                });

                if (opp.accountId) {
                    const accRes = await api.get(`/accounts/${opp.accountId}`);
                    setAccount(accRes.data);
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message || 'Failed to load opportunity');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/opportunities/${id}`, formData);
            alert('Saved successfully');
        } catch (err) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const toggleProduct = (productId) => {
        setFormData(prev => ({
            ...prev,
            productIds: prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId]
        }));
    };

    // -------------------------
    // Loading & Error States
    // -------------------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0a0f1a] transition-colors">
                <p>Loading opportunity...</p>
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0a0f1a] transition-colors">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500">{error || 'Opportunity not found'}</h2>
                    <Link to="/opportunities" className="text-indigo-500 mt-4 inline-block">← Back to pipeline</Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-6xl mx-auto pb-32 pt-8 px-6"
        >
            {/* Top Bar Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {opportunity.dealDetail || 'Untitled Opportunity'}
                            </h1>
                            <span className={`px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${opportunity.stage === 'Closed Won' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' :
                                opportunity.stage === 'Closed Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' :
                                    'bg-indigo-500/10 text-indigo-500 border-indigo-500/10'
                                }`}>
                                {formData.stage} Status
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-xs mt-1 uppercase tracking-[0.2em]">Managed Strategic Pipeline Entity</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all font-bold shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} />
                    {saving ? 'UPDATING...' : 'PERSIST PROGRESS'}
                </button>
            </div>

            {/* Main Application Interface */}
            <div className="bg-white dark:bg-[#111827] rounded-[40px] border border-gray-200 dark:border-gray-800 shadow-xl p-8 min-h-[500px] relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    {['overview', 'git', 'pm', 'qbr', 'notes', 'products'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">Lifecycle Stage</label>
                                        <div className="relative">
                                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 opacity-60" size={18} />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-semibold appearance-none"
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
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">Client Node</label>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="text-indigo-500 opacity-40" size={18} />
                                                <div className="font-bold">{account?.name || 'Loading Client...'}</div>
                                            </div>
                                            {account && (
                                                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-md text-[9px] font-bold uppercase border border-indigo-500/10">
                                                    {account.industry || 'Enterprise'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">Engagement Description</label>
                                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl leading-relaxed italic opacity-80 shadow-inner">
                                        {opportunity.description || 'System generated: Initial outreach and service identification in progress.'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEXT AREA TABS (Git, PM, QBR, Notes) */}
                        {['git', 'pm', 'qbr', 'notes'].includes(activeTab) && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">
                                        {activeTab === 'git' ? 'Real-time Stakeholder Communication Log' :
                                            activeTab === 'pm' ? 'Operational Project Management Checklist' :
                                                activeTab === 'qbr' ? 'Quarterly Performance Analytics & Review' :
                                                    'Strategic Internal Intelligence Notes'}
                                    </h3>
                                </div>
                                <textarea
                                    className="w-full h-[350px] p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[32px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:opacity-30 resize-none font-medium leading-relaxed"
                                    placeholder="Initiating log sequence. Please enter detailed technical notes or business observations..."
                                    value={
                                        activeTab === 'git' ? formData.git :
                                            activeTab === 'pm' ? formData.pmChecklist :
                                                activeTab === 'qbr' ? formData.qbrNotes :
                                                    formData.internalNotes
                                    }
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        [activeTab === 'git' ? 'git' :
                                            activeTab === 'pm' ? 'pmChecklist' :
                                                activeTab === 'qbr' ? 'qbrNotes' :
                                                    'internalNotes']: e.target.value
                                    })}
                                />
                                <div className="flex items-center gap-3 mt-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <CheckCircle2 size={16} className="text-indigo-500 opacity-60" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Autosave disabled. Please persist changes manually via the primary action node.</p>
                                </div>
                            </div>
                        )}

                        {/* PRODUCTS TAB */}
                        {activeTab === 'products' && (
                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Service Inventory Mapping</h3>
                                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
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
                                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500/30 bg-gray-50 dark:bg-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.productIds.includes(prod.id) ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                                    }`}>
                                                    <Package size={22} className={formData.productIds.includes(prod.id) ? 'scale-110' : 'opacity-40 group-hover:scale-110 transition-transform'} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg leading-tight">{prod.name}</div>
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

                {/* System Intelligence Tag */}
                <div className="pt-10 flex flex-col items-center opacity-20 select-none pointer-events-none">
                    <span className="text-[8px] uppercase font-bold tracking-[1em]">
                        Antigravity Business Information Layer
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default OpportunityDetail;