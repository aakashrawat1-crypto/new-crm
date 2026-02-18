import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Building2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const LeadsList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            setLeads(response.data);
        } catch (error) {
            console.error('Failed to fetch leads', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        (lead.organizationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Leads</h2>
                    <p className="text-[var(--text-secondary)] mt-1">Manage and track your incoming prospects</p>
                </div>
                <Link
                    to="/leads/new"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                </Link>
            </div>

            {/* Content Card */}
            <div className="bg-[var(--card)] rounded-[32px] border border-[var(--input-border)] shadow-xl overflow-hidden backdrop-blur-sm">
                {/* Toolbar */}
                <div className="p-6 border-b border-[var(--input-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--background)]/50 border-b border-[var(--input-border)]">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Organization</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Contact</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Email</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--input-border)]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-4 bg-[var(--input-border)] rounded w-3/4 opacity-20"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[var(--text-secondary)] opacity-60 italic">
                                        No leads found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-[var(--background)]/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4">
                                                    <Building2 size={20} />
                                                </div>
                                                <span className="font-semibold text-[var(--text-primary)]">{lead.organizationName || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-[var(--text-primary)] font-medium">
                                                    <User size={14} className="mr-2 text-[var(--text-secondary)]" />
                                                    {lead.fullName}
                                                </div>
                                                {lead.jobTitle && <span className="text-[11px] text-[var(--text-secondary)] ml-6">{lead.jobTitle}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[var(--text-secondary)]">{lead.email}</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                                                lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    'bg-gray-500/10 text-[var(--text-primary)]'
                                                }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[var(--text-secondary)] text-sm tabular-nums">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Insights */}
            <div className="pt-10 text-center opacity-30">
                <p className="text-[10px] tracking-[0.3em] font-medium uppercase text-[var(--text-primary)]">
                    Smart CRM System
                </p>
            </div>
        </motion.div>
    );
};

export default LeadsList;
