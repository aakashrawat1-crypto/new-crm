import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Building2, Users, Briefcase, FileText, ArrowLeft, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AccountDetail = () => {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/accounts/${id}`);
                setAccount(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!account) return (
        <div className="text-center py-20 bg-[var(--card)] rounded-[32px] border border-[var(--input-border)]">
            <h3 className="text-[var(--text-primary)] font-bold text-xl">Account Not Found</h3>
            <Link to="/accounts" className="text-indigo-500 mt-4 inline-block hover:underline">Return to Accounts</Link>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Nav Header */}
            <div className="flex items-center gap-4">
                <Link to="/accounts" className="w-10 h-10 flex items-center justify-center bg-[var(--card)] border border-[var(--input-border)] rounded-full text-[var(--text-primary)] hover:bg-white/5 transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <Building2 size={24} className="text-indigo-500" />
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{account.name}</h1>
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-secondary)] mt-1 flex items-center">
                        <ShieldCheck size={12} className="mr-1 text-emerald-500" /> Enterprise Account Record
                    </div>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={40} className="text-indigo-500" />
                    </div>
                    <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mb-2">Account Lifecycle</div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {account.status || 'Verified Active'}
                    </div>
                </div>
                <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={40} className="text-blue-500" />
                    </div>
                    <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mb-2">Acquisition Pipeline</div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{account.leads?.length || 0} Leads</div>
                </div>
                <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={40} className="text-emerald-500" />
                    </div>
                    <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mb-2">Revenue Potential</div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{account.opportunities?.length || 0} Deals</div>
                </div>
            </div>

            {/* Subsidiary Components */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Leads List Component */}
                <div className="bg-[var(--card)] rounded-[32px] border border-[var(--input-border)] shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[var(--input-border)] bg-[var(--background)]/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <FileText size={18} />
                        </div>
                        <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wide text-sm">Associated Prospects</h3>
                    </div>
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--background)]/50 text-[var(--text-secondary)] text-[9px] uppercase font-bold tracking-[0.2em] border-b border-[var(--input-border)]">
                                <tr>
                                    <th className="px-6 py-4">Stakeholder</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--input-border)]">
                                {account.leads?.map(lead => (
                                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5 focus-within:ring-0">
                                            <Link
                                                to={`/contacts?highlight=${encodeURIComponent(lead.contactName)}`}
                                                className="block hover:translate-x-1 transition-transform"
                                            >
                                                <div className="font-bold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">{lead.contactName}</div>
                                                <div className="text-[10px] text-[var(--text-secondary)] opacity-60 font-medium tracking-tight truncate max-w-[150px]">{lead.email}</div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide border ${lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right text-[var(--text-secondary)] text-[11px] font-medium tabular-nums">
                                            {new Date(lead.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!account.leads || account.leads.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-[var(--text-secondary)] opacity-40 italic">Zero lead entries found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Opportunities Section */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[var(--card)] p-6 rounded-[32px] border border-[var(--input-border)] shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Briefcase size={18} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wide text-sm">Active Opportunities</h3>
                        </div>
                        <div className="space-y-4">
                            {account.opportunities?.map(opp => (
                                <Link
                                    to={`/opportunities/${opp.id}`}
                                    key={opp.id}
                                    className="block p-5 bg-[var(--background)]/30 border border-[var(--input-border)] rounded-2xl hover:border-indigo-500/50 hover:bg-[var(--card)] transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-bold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors text-lg tracking-tight mb-1">{opp.name}</div>
                                            <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase flex items-center">
                                                Stage: <span className="ml-2 text-indigo-500">{opp.stage}</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                            <TrendingUp size={18} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {(!account.opportunities || account.opportunities.length === 0) && (
                                <div className="text-center py-10 text-[var(--text-secondary)] opacity-40 border-2 border-dashed border-[var(--input-border)] rounded-2xl">
                                    No active deal records found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Tag */}
            <div className="pt-20 pb-10 flex flex-col items-center opacity-20 select-none">
                <div className="w-12 h-[1px] bg-[var(--text-primary)] mb-4"></div>
                <div className="text-[9px] uppercase font-bold tracking-[0.6em] text-[var(--text-primary)]">
                    Validated Internal Record
                </div>
            </div>
        </motion.div>
    );
};

export default AccountDetail;
