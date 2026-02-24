import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, User, ChevronRight, Target, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Date format helper (Agar aapke dateUtils mein na ho toh comment out kar dijiyega)
import { formatRelativeTime } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import LeadDetailsDrawer from '../components/LeadDetailsDrawer';

// Tooltip Component for reusable hover actions
const Tooltip = ({ children, text, isDark }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute -top-10 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg z-50 pointer-events-none ${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                            }`}
                    >
                        {text}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-gray-900'
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LeadsList = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Drawer State
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            if (response.data.length === 0) {
                setLeads(getDummyData());
            } else {
                setLeads(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch leads', error);
            setLeads(getDummyData());
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (lead) => {
        setSelectedLead(lead);
        setIsDrawerOpen(true);
    };

    const handleMoveToOpportunity = (leadId) => {
        console.log("Moving to opportunity:", leadId);
        alert(`Initiating move to Opportunity for Lead ID: ${leadId}`);
    };

    const filteredLeads = leads.filter(lead =>
        (lead.companyName || lead.account || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.contactName || lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // FIXED BUG 1: Adding sortedLeads definition
    const sortedLeads = filteredLeads;

    // Helper to safely display date
    const displayDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            return formatRelativeTime ? formatRelativeTime(dateString) : new Date(dateString).toLocaleDateString();
        } catch (e) {
            return new Date(dateString).toLocaleDateString();
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`space-y-8 ${isDark ? 'text-gray-100' : 'text-gray-900'} relative pb-20`}
        >
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Leads Dashboard</h2>
                    <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage and track your incoming prospects</p>
                </div>
                <Link
                    to="/leads/new"
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all shadow-lg active:scale-95 ${isDark
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                        }`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create a Lead
                </Link>
            </div>

            {/* Main Leads List Card */}
            <div className={`rounded-[32px] border shadow-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'bg-[#0b0e14]/90 border-gray-800' : 'bg-white border-gray-100'
                }`}>
                {/* Search Toolbar */}
                <div className={`p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="relative w-full sm:max-w-md group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-500 group-focus-within:text-indigo-400' : 'text-gray-400 group-focus-within:text-indigo-600'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Search accounts or names..."
                            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-medium ${isDark
                                ? 'bg-[#121620] text-gray-200 border border-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-gray-600'
                                : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400'
                                }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[var(--background)]/50 border-b border-[var(--input-border)]">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Company</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Contact</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Email</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]">Created At</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-800/60' : 'divide-gray-100'}`}>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6">
                                            <div className={`h-4 rounded w-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={`px-8 py-24 text-center text-sm font-medium italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        No leads found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                sortedLeads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-[var(--background)]/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4">
                                                    <Building2 size={20} />
                                                </div>
                                                <span className="font-semibold text-[var(--text-primary)]">{lead.companyName || lead.account}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-[var(--text-primary)]">
                                                <User size={16} className="mr-2 text-[var(--text-secondary)]" />
                                                {lead.contactName || lead.customerName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[var(--text-primary)]">
                                            {lead.email || lead.customerEmail}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                (lead.status === 'Converted' || lead.status === 'Closed Won') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    lead.status === 'Closed Lost' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                        'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-current mr-2 ${lead.status === 'New' ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></span>
                                                {lead.status || 'New'}
                                            </span>
                                        </td>

                                        {/* FIXED BUG 3: Created At cell was missing in the rendering */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                                <Clock size={14} className="mr-1.5 opacity-70" />
                                                {displayDate(lead.createdAt)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <Tooltip text="Move to Opportunity" isDark={isDark}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleMoveToOpportunity(lead.id); }}
                                                        className={`p-2 rounded-xl transition-all shadow-sm ${isDark
                                                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 border border-blue-500/20'
                                                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 hover:scale-105'
                                                            }`}
                                                    >
                                                        <Target size={18} />
                                                    </button>
                                                </Tooltip>

                                                <Tooltip text="View Details" isDark={isDark}>
                                                    <button
                                                        onClick={() => handleOpenDetails(lead)}
                                                        className={`p-2 rounded-xl transition-all shadow-sm ${isDark
                                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:scale-105'
                                                            }`}
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </Tooltip>
                                            </div>
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
                    Antigravity Data Intelligence System
                </p>
            </div>

            {/* FIXED BUG 2: Adding Drawer Component back */}
            {isDrawerOpen && (
                <LeadDetailsDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    lead={selectedLead}
                />
            )}
        </motion.div>
    );
};

export default LeadsList;

// Helper to generate dummy data matching the new schema requirements
function getDummyData() {
    return [
        {
            id: 1,
            account_ID: 101,
            department: 'Enterprise Sales',
            createdAt: '2023-10-20T10:00:00Z',
            account: 'TechNova Solutions',
            companyName: 'TechNova Solutions',
            customerName: 'Sarah Jenkins',
            contactName: 'Sarah Jenkins',
            customerEmail: 'sarah.j@technova.example.com',
            email: 'sarah.j@technova.example.com',
            salesManager: 'Alexander Sterling',
            deliveryManager: 'Rachel Maas',
            leadType: 'Inbound',
            lastConversation: 'Client requested a demo of the new predictive analytics module. Follow up needed next week.',
            lastConversationDate: '2023-10-24T14:30:00Z',
            comments: 'High priority target. Budget seems flexible.',
            fteCount: 4.5,
            nonFte: 1.0,
            expectedHours: 720,
            contractType: 'Time & Materials',
            status: 'New',
            proposalLink: 'https://docs.google.com/proposal-draft-1',
            estimatesLink: 'https://docs.google.com/estimates-v2'
        },
        {
            id: 2,
            account_ID: 102,
            department: 'SMB Segment',
            createdAt: '2023-10-15T09:15:00Z',
            account: 'GreenLeaf Retail',
            companyName: 'GreenLeaf Retail',
            customerName: 'David Cho',
            contactName: 'David Cho',
            customerEmail: 'd.cho@greenleaf.example.com',
            email: 'd.cho@greenleaf.example.com',
            salesManager: 'Alexander Sterling',
            deliveryManager: 'Pending',
            leadType: 'Referral',
            lastConversation: 'Discussed basic rollout plan. Awaiting budget approval from their board.',
            lastConversationDate: '2023-10-18T11:00:00Z',
            comments: 'Very likely to convert if we can hit the Q4 deadline.',
            fteCount: 2.0,
            nonFte: 0.5,
            expectedHours: 320,
            contractType: 'Fixed Bid',
            status: 'Converted',
        },
        {
            id: 3,
            account_ID: 103,
            department: 'Public Sector',
            createdAt: '2023-09-01T14:00:00Z',
            account: 'City Metro Transit',
            companyName: 'City Metro Transit',
            customerName: 'Robert Lang',
            contactName: 'Robert Lang',
            customerEmail: 'rlang@metro.gov.test',
            email: 'rlang@metro.gov.test',
            salesManager: 'Jessica Wong',
            deliveryManager: 'Tom Hardy',
            leadType: 'Outbound',
            lastConversation: 'Final RFP submitted. They went with a competitor who underbid.',
            lastConversationDate: '2023-09-30T16:45:00Z',
            comments: 'Lost on price. Consider revisiting in 12 months.',
            fteCount: 12.0,
            nonFte: 3.0,
            expectedHours: 1920,
            contractType: 'Retainer',
            status: 'Closed Lost',
            lostReason: 'Competitor offered a 30% lower bid on the initial year.',
        }
    ];
}