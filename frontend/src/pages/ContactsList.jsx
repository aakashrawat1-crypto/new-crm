import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Phone, Shield, Search, Star, X, DollarSign, TrendingUp, TrendingDown, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MoreVertical = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
);

const ContactDetailModal = ({ contact, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...contact });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdate(contact.id, formData);
            onClose();
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[var(--card)] w-full max-w-2xl rounded-[32px] border border-[var(--input-border)] shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-6 right-6">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-[var(--text-secondary)]" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                            <User size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Contact Intelligence</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold opacity-60">Deep Profile Analysis</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block ml-1 opacity-50">Identity Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none text-[var(--text-primary)] transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block ml-1 opacity-50">Communication node</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none text-[var(--text-primary)] transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block ml-1 opacity-50">Operational Title</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none text-[var(--text-primary)] transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block ml-1 opacity-50">Direct Frequency</label>
                                <input
                                    type="text"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none text-[var(--text-primary)] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--background)]/50 border border-[var(--input-border)] rounded-[24px] p-6 mb-8">
                        <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <TrendingUp size={14} className="text-indigo-500" />
                            Financial Projections
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 block opacity-50">Total Rev</label>
                                <div className="relative">
                                    <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                                    <input
                                        type="number"
                                        value={formData.revenue || ''}
                                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                                        className="w-full pl-8 pr-3 py-2 bg-[var(--card)] border border-[var(--input-border)] rounded-xl text-xs outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 block opacity-50 text-emerald-500/70">Closed Won</label>
                                <div className="relative">
                                    <TrendingUp size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    <input
                                        type="number"
                                        value={formData.closedWonRevenue || ''}
                                        onChange={(e) => setFormData({ ...formData, closedWonRevenue: e.target.value })}
                                        className="w-full pl-8 pr-3 py-2 bg-[var(--card)] border border-[var(--input-border)] rounded-xl text-xs outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 block opacity-50 text-rose-500/70">Closed Lost</label>
                                <div className="relative">
                                    <TrendingDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
                                    <input
                                        type="number"
                                        value={formData.closedLostRevenue || ''}
                                        onChange={(e) => setFormData({ ...formData, closedLostRevenue: e.target.value })}
                                        className="w-full pl-8 pr-3 py-2 bg-[var(--card)] border border-[var(--input-border)] rounded-xl text-xs outline-none focus:border-rose-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                            ) : <Save size={18} className="mr-2" />}
                            Change Details
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ContactsList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchParams] = useSearchParams();
    const highlight = searchParams.get('highlight');
    const highlightedRef = useRef(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await api.get('/contacts');
            console.log('Contacts API Response:', response.data);
            setContacts(response.data);
        } catch (error) {
            console.error('Failed to fetch contacts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && highlight && highlightedRef.current) {
            highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [loading, highlight]);

    const handleUpdate = async (id, data) => {
        try {
            await api.put(`/contacts/${id}`, data);
            await fetchContacts();
        } catch (error) {
            console.error('Update failed', error);
            throw error;
        }
    };

    const filteredContacts = contacts.filter(contact =>
    (contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <AnimatePresence>
                {selectedContact && (
                    <ContactDetailModal
                        contact={selectedContact}
                        onClose={() => setSelectedContact(null)}
                        onUpdate={handleUpdate}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Active Contacts</h2>
                <p className="text-[var(--text-secondary)] mt-1 italic opacity-80">Directory of verified stakeholders</p>
            </div>

            {/* Contact Card */}
            <div className="bg-[var(--card)] rounded-[32px] border border-[var(--input-border)] shadow-xl overflow-hidden backdrop-blur-xl">
                {/* Search / Filter Toolbar */}
                <div className="p-6 border-b border-[var(--input-border)]">
                    <div className="relative max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a contact..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--background)]/40 border-b border-[var(--input-border)]">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)]">Identity</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)]">Communication</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)]">Position</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)] text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--input-border)]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-8"><div className="h-4 bg-[var(--input-border)] rounded w-1/2 opacity-10"></div></td>
                                    </tr>
                                ))
                            ) : filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[var(--text-secondary)]">No contacts registered.</td>
                                </tr>
                            ) : (
                                filteredContacts.map(contact => {
                                    const isHighlighted = highlight === contact.name;
                                    return (
                                        <motion.tr
                                            key={contact.id}
                                            ref={isHighlighted ? highlightedRef : null}
                                            className={`transition-all group relative ${isHighlighted ? 'bg-indigo-500/5' : 'hover:bg-white/5'}`}
                                            animate={isHighlighted ? {
                                                backgroundColor: ["rgba(99, 102, 241, 0)", "rgba(99, 102, 241, 0.15)", "rgba(99, 102, 241, 0)"],
                                            } : {}}
                                            transition={isHighlighted ? {
                                                duration: 2,
                                                repeat: 2,
                                                ease: "easeInOut"
                                            } : {}}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${isHighlighted ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] opacity-40 group-hover:border-indigo-500 group-hover:opacity-100 group-hover:bg-indigo-500/10 group-hover:text-indigo-500'} mr-4 shadow-sm`}>
                                                        <User size={22} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[var(--text-primary)] text-lg leading-tight">{contact.name}</div>
                                                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1 flex items-center">
                                                            {contact.leadId ? (
                                                                <><Star size={10} className="mr-1 text-amber-500" /> Lead Prospect</>
                                                            ) : (
                                                                <><Shield size={10} className="mr-1 text-indigo-500" /> Stakeholder</>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isHighlighted && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: 4 }}
                                                        className="absolute left-0 top-0 bottom-0 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-sm text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors cursor-pointer">
                                                        <Mail size={14} className="mr-2 opacity-40" /> {contact.email}
                                                    </div>
                                                    <div className="flex items-center text-xs text-[var(--text-secondary)] tabular-nums">
                                                        <Phone size={14} className="mr-2 opacity-40" /> {contact.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center px-4 py-1 bg-zinc-500/10 text-zinc-400 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-zinc-500/10 shadow-inner">
                                                    {contact.title}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${contact.status === 'Active' || contact.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        contact.status === 'Converted' || contact.status === 'Closed Won' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                                            contact.status === 'New' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                                                                contact.status === 'Closed Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    {contact.status || 'Active'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 items-center">
                                                    <Star size={16} className="text-[var(--text-secondary)] hover:text-amber-400 transition-colors cursor-pointer opacity-40 hover:opacity-100" />
                                                    <button
                                                        onClick={() => setSelectedContact(contact)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95 group/btn"
                                                    >
                                                        <MoreVertical size={18} className="text-[var(--text-secondary)] group-hover/btn:text-indigo-400 transition-colors" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center opacity-30 select-none">
                <span className="text-[9px] tracking-[0.5em] font-bold uppercase text-[var(--text-primary)]">
                    Smart CRM
                </span>
            </footer>
        </motion.div>
    );
};

export default ContactsList;
