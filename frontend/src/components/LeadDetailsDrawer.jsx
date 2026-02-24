import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Briefcase, Calendar, Clock, FileText, CheckCircle2, TrendingUp, XCircle, Link as LinkIcon, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const LeadDetailsDrawer = ({ isOpen, onClose, lead }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!lead) return null;

    // Helper to format dates safely
    const safeFormatDate = (dateString, formatStr = 'PPP') => {
        if (!dateString) return 'Not available';
        try {
            return format(new Date(dateString), formatStr);
        } catch (e) {
            return dateString;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed top-0 right-0 h-full w-full max-w-lg md:max-w-xl lg:max-w-2xl shadow-2xl z-[200] flex flex-col overflow-hidden border-l ${isDark ? 'bg-[#0b0e14] border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-900'
                            }`}
                    >
                        {/* Drawer Header */}
                        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-gray-800 bg-[#121620]' : 'border-gray-100 bg-gray-50/80'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">{lead.companyName || lead.account || 'Unknown Company'}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                                                (lead.status === 'Converted' || lead.status === 'Closed Won') ? 'bg-emerald-500/10 text-emerald-500' :
                                                    lead.status === 'Closed Lost' ? 'bg-rose-500/10 text-rose-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {lead.status || 'New'}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ID: {lead.id || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Drawer Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                            <div className="space-y-8">

                                {/* Section: Basic Information */}
                                <section>
                                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <User size={14} /> Basic Information
                                    </h3>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-3xl border ${isDark ? 'bg-[#121620] border-gray-800/60' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <DetailItem label="Account / Company" value={lead.companyName || lead.account} isDark={isDark} />
                                        <DetailItem label="Department" value={lead.department} isDark={isDark} />
                                        <DetailItem label="Customer Name" value={lead.contactName || lead.customerName} isDark={isDark} />
                                        <DetailItem label="Customer Email" value={lead.email || lead.customerEmail} isDark={isDark} isEmail />
                                        <DetailItem label="Lead Type" value={lead.leadType} isDark={isDark} />
                                    </div>
                                </section>

                                {/* Section: Ownership & Management */}
                                <section>
                                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <Briefcase size={14} /> Ownership & Management
                                    </h3>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-3xl border ${isDark ? 'bg-[#121620] border-gray-800/60' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <DetailItem label="Sales Manager" value={lead.salesManager} isDark={isDark} />
                                        <DetailItem label="Delivery Manager" value={lead.deliveryManager} isDark={isDark} />
                                    </div>
                                </section>

                                {/* Section: Estimates & Contract */}
                                <section>
                                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <FileText size={14} /> Estimates & Contract
                                    </h3>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-3xl border ${isDark ? 'bg-[#121620] border-gray-800/60' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <DetailItem label="FTE Count" value={lead.fteCount} isDark={isDark} />
                                        <DetailItem label="Non-FTE" value={lead.nonFte} isDark={isDark} />
                                        <DetailItem label="Expected Hours" value={lead.expectedHours} isDark={isDark} />
                                        <DetailItem label="Contract Type" value={lead.contractType} isDark={isDark} />
                                    </div>
                                </section>

                                {/* Section: Engagement History */}
                                <section>
                                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <Clock size={14} /> Engagement History
                                    </h3>
                                    <div className={`grid grid-cols-1 gap-4 p-5 rounded-3xl border ${isDark ? 'bg-[#121620] border-gray-800/60' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <DetailItem label="Last Conversation Date" value={safeFormatDate(lead.lastConversationDate)} isDark={isDark} />
                                        <div className="md:col-span-2">
                                            <span className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Last Conversation Notes</span>
                                            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {lead.lastConversation || lead.description || 'No conversation history available.'}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 mt-2">
                                            <span className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Comments</span>
                                            <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-[#0f111a] text-gray-400' : 'bg-white border border-gray-200 text-gray-600'}`}>
                                                {lead.comments || 'No additional comments.'}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section: Proposal & Links */}
                                <section>
                                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <LinkIcon size={14} /> Documents & Links
                                    </h3>
                                    <div className={`grid grid-cols-1 gap-4 p-5 rounded-3xl border ${isDark ? 'bg-[#121620] border-gray-800/60' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <LinkItem label="Proposal Link" url={lead.proposalLink} isDark={isDark} />
                                        <LinkItem label="Estimates Link" url={lead.estimatesLink} isDark={isDark} />
                                    </div>
                                </section>

                                {/* Section: System Information */}
                                <section>
                                    <div className={`p-5 rounded-3xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${isDark ? 'bg-[#121620]/50 border-gray-800/30' : 'bg-gray-50/30 border-gray-100/50'}`}>
                                        <div>
                                            <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Created On</span>
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{safeFormatDate(lead.createdAt || lead.createdDate)}</span>
                                        </div>
                                        <div>
                                            <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Last Modified</span>
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{safeFormatDate(lead.lastModifiedDate)} by {lead.lastModifiedBy || 'System'}</span>
                                        </div>
                                        {lead.status === 'Closed Lost' && (
                                            <div>
                                                <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 text-rose-500`}>Closed Date</span>
                                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{safeFormatDate(lead.closedDate)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {lead.status === 'Closed Lost' && lead.lostReason && (
                                        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                            <span className="block text-xs font-bold text-rose-500 mb-1">Reason for Loss:</span>
                                            <p className="text-sm text-rose-400/90">{lead.lostReason}</p>
                                        </div>
                                    )}
                                </section>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Sub-component for clean detail rendering
const DetailItem = ({ label, value, isDark, isEmail }) => (
    <div className="flex flex-col">
        <span className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
        {value ? (
            <span className={`text-sm font-medium ${isEmail ? 'text-blue-500 hover:underline cursor-pointer' : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>
                {value}
            </span>
        ) : (
            <span className={`text-sm italic ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Not specified</span>
        )}
    </div>
);

// Sub-component for rendering links
const LinkItem = ({ label, url, isDark }) => (
    <div className="flex flex-col">
        <span className={`text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {label}
        </span>
        {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline break-all flex items-center gap-1.5">
                {url} <LinkIcon size={12} />
            </a>
        ) : (
            <span className={`text-sm italic ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>No link provided</span>
        )}
    </div>
);

export default LeadDetailsDrawer;
