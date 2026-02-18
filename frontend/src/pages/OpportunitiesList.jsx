import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, TrendingUp, DollarSign, ArrowUpRight, Search, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const OpportunitiesList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOpps = async () => {
            try {
                const res = await api.get('/opportunities');
                setOpportunities(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOpps();
    }, []);

    const getStageColor = (stage) => {
        switch (stage) {
            case 'Closed Won': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Closed Lost': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Negotiation': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Prospect': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const filteredOpps = opportunities.filter(opp =>
        (opp.dealDetail || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-600 shadow-inner group">
                        <Briefcase className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Opportunities</h1>
                        <p className="text-[var(--text-secondary)] mt-1 flex items-center">
                            <Activity size={14} className="mr-1 text-emerald-500" /> Pipeline Revenue Management
                        </p>
                    </div>
                </div>
            </div>

            {/* List Table Card */}
            <div className="bg-[var(--card)] rounded-[40px] border border-[var(--input-border)] shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Local Toolbar */}
                <div className="p-6 border-b border-[var(--input-border)]">
                    <div className="relative max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a deal..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--background)]/40 text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-[0.25em]">
                            <tr>
                                <th className="px-8 py-6">Deal Parameters</th>
                                <th className="px-8 py-6 text-center">Lifecycle Stage</th>
                                <th className="px-8 py-6">Expected Value</th>
                                <th className="px-8 py-6 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--input-border)]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-8 py-8"><div className="h-4 bg-[var(--input-border)] rounded w-1/2 opacity-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredOpps.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-[var(--text-secondary)] opacity-50 select-none">
                                        No active opportunities found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOpps.map(opp => (
                                    <tr key={opp.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-7">
                                            <div className="font-bold text-[var(--text-primary)] text-lg tracking-tight mb-1">{opp.dealDetail || 'Untitled Deal'}</div>
                                            <div className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest flex items-center">
                                                ID: {opp.id.slice(-6).toUpperCase()} • SALES_UNIT_2024
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${getStageColor(opp.stage)}`}>
                                                {opp.stage}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center text-indigo-500 font-bold text-xl tabular-nums tracking-tighter">
                                                <DollarSign size={18} className="opacity-50 mr-0.5" />
                                                {(opp.value || 0).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-50 uppercase tracking-widest">
                                                Net Calculated Value
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <Link
                                                to={`/opportunities/${opp.id}`}
                                                className="inline-flex items-center justify-center w-12 h-12 bg-[var(--input-bg)] text-indigo-500 rounded-2xl border border-[var(--input-border)] hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            >
                                                <ArrowUpRight size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State / Footer */}
            {opportunities.length === 0 && !loading && (
                <div className="p-16 text-center border-2 border-dashed border-[var(--input-border)] rounded-[40px] opacity-40">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                        Opportunity pipeline is empty. Leads are automatically converted to deals by the Smart CRM system.
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default OpportunitiesList;
