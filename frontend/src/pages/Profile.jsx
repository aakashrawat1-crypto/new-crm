import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, User, PhoneOutgoing, Video } from 'lucide-react';
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

const Profile = () => {
    const { user } = useAuth();
    const { theme } = useTheme();

    const userRole = user?.role || 'Sales Manager';
    const accessLevel = roleAccessLevels[userRole] || 0;
    const canEdit = accessLevel >= 70; // High edit access
    const canEditBasic = accessLevel >= 40; // Low edit access

    const isDark = theme === 'dark';

    const pageVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center pt-10 pb-20"
        >
            <div className={`w-full max-w-sm md:max-w-xl rounded-[32px] overflow-hidden shadow-2xl border ${isDark
                    ? 'bg-[#0f111a] border-[#1e2233] text-gray-200'
                    : 'bg-white border-gray-100 text-gray-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]'
                }`}>
                {/* Header Profile Section */}
                <div className="flex flex-col items-center p-8 pb-6">
                    <div className="relative mb-4">
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center p-1.5 bg-gradient-to-b ${isDark ? 'from-blue-600 to-[#0f111a]' : 'from-blue-500 to-white'}`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-300 flex items-center justify-center text-5xl font-semibold text-slate-500">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-4 border-[#0f111a]" />
                    </div>

                    <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name || 'Alexander Sterling'}
                    </h2>
                    <p className={`text-base mt-1.5 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {userRole === 'SALES_REP' ? 'Sales Representative' : userRole}
                    </p>

                    <div className="flex w-full gap-4 mt-8">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 md:py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
                            <Mail size={18} /> Message
                        </button>
                        <button className={`flex-1 py-3 md:py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold transition-all active:scale-[0.98] ${isDark ? 'bg-[#1b1f2e] hover:bg-[#252a3d] text-white shadow-lg shadow-black/20' : 'bg-gray-100/80 hover:bg-gray-200 text-gray-900 border border-gray-200/60 shadow-sm'
                            }`}>
                            <Phone size={18} /> Call
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6 space-y-4 md:px-8 md:pb-8">
                    {/* Personal Info */}
                    <div className={`rounded-3xl p-5 md:p-6 ${isDark ? 'bg-[#161925]' : 'bg-gray-50/80 border border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <User size={16} className="text-blue-500" />
                            <h3 className={`text-xs md:text-sm font-bold tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PERSONAL INFO</h3>
                            {canEditBasic && (
                                <button className="ml-auto text-xs text-blue-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-wider">EDIT</button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</span>
                                <span className="text-sm md:text-base font-medium group-hover:text-blue-500 transition-colors">{user?.email || 'a.sterling@example.com'}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone</span>
                                <span className="text-sm md:text-base font-medium group-hover:text-blue-500 transition-colors">{user?.phone || '+1 (555) 892-4410'}</span>
                            </div>
                            {canEdit && (
                                <div className="flex justify-between items-center group">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Region</span>
                                    <span className="text-sm md:text-base font-medium">NY, North America</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Communication History */}
                    <div className={`rounded-3xl p-5 md:p-6 ${isDark ? 'bg-[#161925]' : 'bg-gray-50/80 border border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={16} className="text-blue-500" />
                            <h3 className={`text-xs md:text-sm font-bold tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>COMMUNICATION HISTORY</h3>
                        </div>

                        <div className="relative pl-4 space-y-6">
                            {/* Connection Line */}
                            <div className={`absolute left-5 md:left-5 top-3 bottom-4 w-[1px] md:w-[2px] ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />

                            <div className="relative flex gap-4 md:gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#1d1b32]' : 'bg-indigo-100'} text-indigo-500 shadow-sm shadow-indigo-500/20`}>
                                    <PhoneOutgoing size={14} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm font-bold">Outgoing Call</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400 font-medium'}`}>Yesterday, 4:20 PM • 12 mins</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 md:gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#122822]' : 'bg-emerald-100'} text-emerald-500 shadow-sm shadow-emerald-500/20`}>
                                    <Mail size={14} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm font-bold">Email Received</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400 font-medium'}`}>Oct 24, 2023 • Attachment: "Q4 Proposal.pdf"</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 md:gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isDark ? 'bg-[#2b2112]' : 'bg-amber-100'} text-amber-500 shadow-sm shadow-amber-500/20`}>
                                    <Video size={14} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm font-bold">Meeting Scheduled</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400 font-medium'}`}>Oct 22, 2023 • Zoom Conference</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;