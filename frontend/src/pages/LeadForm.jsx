import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    User,
    Building2,
    Mail,
    Phone,
    Briefcase,
    Globe,
    FileText,
    Star,
    CheckCircle2
} from 'lucide-react';

const LeadForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        organizationName: '',
        jobTitle: '',
        email: '',
        mobile: '',
        officePhone: '',
        leadSource: 'Web',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/leads', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/leads');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create lead. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const leadSources = ['Web', 'Referral', 'Trade Show', 'Cold Call', 'Social Media', 'Email Campaign', 'Other'];

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Lead Created!</h2>
                    <p className="text-gray-500">Redirecting to leads list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/leads')}
                className="group flex items-center text-gray-500 hover:text-primary mb-8 transition-all duration-300"
            >
                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors mr-2">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Back to Leads</span>
            </button>

            <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-indigo-600 p-8 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                            <Star className="w-8 h-8 fill-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">New Lead</h2>
                            <p className="text-white/80">Capture new business opportunity details</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 flex items-center">
                            <div className="mr-3 p-2 bg-red-100 rounded-lg text-red-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 text-gray-700">
                        {/* Personal Info Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 text-primary">
                                <User className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Primary Contact</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Job Title</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            placeholder="Senior Manager"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organization Section */}
                        <div className="space-y-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center space-x-2 text-primary">
                                <Building2 className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Account / Organization</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Organization Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="organizationName"
                                            placeholder="Acme Corporation"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.organizationName}
                                            onChange={handleChange}
                                        />
                                        <div className="mt-2 text-[10px] text-indigo-500 font-bold opacity-60 uppercase tracking-widest pl-1">
                                            Grouping: Leads under same organization share one Account
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Communication Section */}
                        <div className="space-y-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center space-x-2 text-primary">
                                <Globe className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Communication</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="john@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Mobile Phone</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Source & Description Section */}
                        <div className="space-y-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center space-x-2 text-primary">
                                <FileText className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Additional Info</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Lead Source</label>
                                    <div className="relative group">
                                        <select
                                            name="leadSource"
                                            className="w-full px-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm appearance-none"
                                            value={formData.leadSource}
                                            onChange={handleChange}
                                        >
                                            {leadSources.map(source => (
                                                <option key={source} value={source}>{source}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                            <ArrowLeft className="w-4 h-4 rotate-[-90deg]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Office Phone</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="officePhone"
                                            placeholder="+1 (555) 000-0001"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm"
                                            value={formData.officePhone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Description / Internal Notes</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter any additional context or requirements here..."
                                    className="w-full p-6 bg-gray-50 border-transparent border-2 rounded-3xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-sm h-40 resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end pt-10">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    flex items-center px-12 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-2xl
                                    hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 
                                    active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                        Creating Lead...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save New Lead
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeadForm;
