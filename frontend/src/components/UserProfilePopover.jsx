import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, User, CheckCircle2, PhoneOutgoing, Video } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const roleAccessLevels = {
    'Admin': 100,
    'Director': 90,
    'Delivery Manager': 80,
    'Project Manager': 70,
    'Business Analyst': 60,
    'Tester': 50,
    'Sales Manager': 40,
    'SALES_REP': 40, // Map backend role to similar level
};

const UserProfilePopover = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { theme } = useTheme();

    // Determine edit access level based on role
    const userRole = user?.role || 'Sales Manager';
    const accessLevel = roleAccessLevels[userRole] || 0;
    const canEdit = accessLevel >= 70; // High edit access
    const canEditBasic = accessLevel >= 40; // Low edit access

    const isDark = theme === 'dark';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-[60px] right-0 w-80 rounded-[28px] overflow-hidden shadow-2xl z-[110] border ${isDark
                        ? 'bg-[#0f111a] border-[#1e2233] text-gray-200'
                        : 'bg-white border-gray-200 text-gray-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]'
                    }`}
            >
                {/* Header Profile Section */}
                <div className="flex flex-col items-center p-6 pb-4">
                    <div className="relative mb-3">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center p-1 bg-gradient-to-b ${isDark ? 'from-blue-600 to-[#0f111a]' : 'from-blue-400 to-white'}`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-300 flex items-center justify-center text-4xl font-semibold text-slate-500">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0f111a]" />
                    </div>

                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name || 'Alexander Sterling'}
                    </h2>
                    <p className={`text-xs mt-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {userRole === 'SALES_REP' ? 'Sales Representative' : userRole}
                    </p>

                    <div className="flex w-full gap-3 mt-5">
                        <button className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors duration-200">
                            <Mail size={16} /> Message
                        </button>
                        <button className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors duration-200 ${isDark ? 'bg-[#1b1f2e] hover:bg-[#252a3d] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}>
                            <Phone size={16} /> Call
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-4 space-y-3">
                    {/* Personal Info */}
                    <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#161925]' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <User size={14} className="text-blue-500" />
                            <h3 className={`text-xs font-bold tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PERSONAL INFO</h3>
                            {canEditBasic && (
                                <button className="ml-auto text-[10px] text-blue-500 font-semibold hover:underline">EDIT</button>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</span>
                                <span className="text-sm font-medium">{user?.email || 'a.sterling@example.com'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone</span>
                                <span className="text-sm font-medium">{user?.phone || '+1 (555) 892-4410'}</span>
                            </div>
                            {canEdit && (
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Region</span>
                                    <span className="text-sm font-medium">NY, North America</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Communication History */}
                    <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#161925]' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={14} className="text-blue-500" />
                            <h3 className={`text-xs font-bold tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>COMMUNICATION HISTORY</h3>
                        </div>

                        <div className="relative pl-3 space-y-4">
                            {/* Line */}
                            <div className={`absolute left-4 top-2 bottom-2 w-[1px] ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />

                            <div className="relative flex gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#1d1b32]' : 'bg-indigo-100'} text-indigo-500`}>
                                    <PhoneOutgoing size={12} />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-xs font-semibold">Outgoing Call</p>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Yesterday, 4:20 PM • 12 mins</p>
                                </div>
                            </div>

                            <div className="relative flex gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#122822]' : 'bg-emerald-100'} text-emerald-500`}>
                                    <Mail size={12} />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-xs font-semibold">Email Received</p>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Oct 24, 2023 • Attachment: "Q4 Proposal.pdf"</p>
                                </div>
                            </div>

                            <div className="relative flex gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#2b2112]' : 'bg-amber-100'} text-amber-500`}>
                                    <Video size={12} />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-xs font-semibold">Meeting Scheduled</p>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Oct 22, 2023 • Zoom Conference</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserProfilePopover;
