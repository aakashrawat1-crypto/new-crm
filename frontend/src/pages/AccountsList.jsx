import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Building2, Plus, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '../utils/dateUtils';

const AccountsList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await api.get('/accounts');
                setAccounts(response.data);
            } catch (error) {
                console.error('Failed to fetch accounts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight text-glow">Accounts</h2>
                    <p className="text-[var(--text-secondary)] mt-1">Directory of enterprise partners and organizations</p>
                </div>
                <button className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 opacity-50 cursor-not-allowed">
                    <Plus className="w-4 h-4 mr-2" />
                    New Account
                </button>
            </div>

            {/* List Container */}
            <div className="bg-[var(--card)] rounded-[32px] border border-[var(--input-border)] shadow-xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-[var(--input-border)]">
                    <div className="relative max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find an account..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--background)]/50 border-b border-[var(--input-border)]">
                                <th className="px-8  py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">Organization Name</th>
                                <th className="px-8  py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="px-8  py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">Registered</th>
                                <th className="px-8  py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--input-border)]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-8 py-8"><div className="h-4 bg-[var(--input-border)] rounded w-1/2 opacity-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-[var(--text-secondary)]">No accounts found.</td>
                                </tr>
                            ) : (
                                filteredAccounts.map(account => (
                                    <tr key={account.id} className="hover:bg-[var(--background)]/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-5 border border-indigo-500/10 shadow-inner group-hover:scale-110 transition-transform">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[var(--text-primary)] text-lg leading-tight">{account.name}</div>
                                                    <div className="text-xs text-[var(--text-secondary)] flex items-center mt-1">
                                                        <ShieldCheck size={12} className="mr-1 text-emerald-500" /> Verified Partner
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                                                {account.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[var(--text-secondary)] font-medium tabular-nums">
                                            {formatRelativeTime(account.createdAt)}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                to={`/accounts/${account.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-[var(--input-bg)] text-[var(--text-primary)] rounded-[14px] border border-[var(--input-border)] text-sm font-medium hover:bg-[var(--card)] hover:shadow-md transition-all active:scale-95"
                                            >
                                                View Account
                                                <ExternalLink size={14} className="ml-2 opacity-50" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination/Meta */}
            <div className="flex items-center justify-center gap-2 opacity-20 mt-4">
                <div className="w-8 h-[1px] bg-[var(--text-primary)]"></div>
                <div className="text-[30px] uppercase font-bold tracking-[0.4em] text-[var(--text-primary)]">🐧</div>
                <div className="w-8 h-[1px] bg-[var(--text-primary)]"></div>
            </div>
        </motion.div>
    );
};

export default AccountsList;
