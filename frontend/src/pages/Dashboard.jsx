import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Users, Briefcase, DollarSign, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, motionValue, useSpring } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';

const Sparkline = ({ data, color }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 24;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]"
            />
        </svg>
    );
};

const ProgressRing = ({ percentage, color }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="44" height="44" className="rotate-[-90deg]">
                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="opacity-10"
                />
                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <span className="absolute text-[9px] font-bold tabular-nums">{Math.round(percentage)}%</span>
        </div>
    );
};

const RevenueTrends = ({ trends }) => {
    const [period, setPeriod] = useState('WEEK');

    const weekData = trends?.weekData || [];
    const monthData = trends?.monthData || [];

    const data = period === 'WEEK' ? weekData : monthData;
    const maxVal = Math.max(...data.map(d => d.value), 10) * 1.2;

    return (
        <div className="bg-[var(--card)] p-8 rounded-[40px] border border-[var(--input-border)] shadow-2xl h-[450px] flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10 z-10">
                <div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">Revenue<br />Trends</h3>
                </div>
                <div className="bg-[var(--input-bg)] p-1 rounded-2xl flex gap-1 border border-[var(--input-border)] shadow-sm">
                    {['WEEK', 'MONTH'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${period === p
                                ? 'bg-indigo-500 text-white shadow-lg'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative flex items-end justify-between px-2 mb-8">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-t border-[var(--text-secondary)]/20 w-full h-0"></div>
                    ))}
                </div>
                <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                    {[...Array(period === 'WEEK' ? 7 : 5)].map((_, i) => (
                        <div key={i} className="border-l border-[var(--text-secondary)]/20 h-full w-0"></div>
                    ))}
                </div>

                {data.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 z-10 group/bar">
                        <div className="relative h-48 w-10 sm:w-12">
                            <div className="absolute inset-0 bg-[var(--text-secondary)]/10 rounded-full"></div>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxVal) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                className={`absolute bottom-0 w-full rounded-full bg-gradient-to-t from-[#f59e0b] via-[#10b981] to-[#06b6d4] transition-all duration-500 ${item.current ? 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'group-hover/bar:brightness-125'
                                    }`}
                            >
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-white/20 rounded-full blur-[2px]"></div>
                            </motion.div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--background)] text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                ${item.value.toLocaleString()}
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold tracking-widest transition-colors ${item.current ? 'text-cyan-500' : 'text-[var(--text-secondary)]'}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center px-2 z-10 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_10px_#06b6d4] animate-pulse"></span>
                    Live Activity
                </div>
                <div className="text-[var(--text-secondary)] opacity-50 tabular-nums lowercase italic">
                    Updated 2m ago
                </div>
            </div>

            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-1000"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-1000"></div>
        </div>
    );
};

const Widget = ({ title, value, icon: Icon, colorClass, trendData, progress }) => {
    const getColorHex = (cls) => {
        if (cls.includes('blue')) return '#3B82F6';
        if (cls.includes('amber')) return '#F59E0B';
        if (cls.includes('emerald')) return '#10B981';
        if (cls.includes('indigo')) return '#6366F1';
        return '#6366F1';
    };

    const colorHex = getColorHex(colorClass);

    return (
        <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-sm flex flex-col transition-all hover:shadow-xl hover:translate-y-[-2px] group overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trendData && <Sparkline data={trendData} color={colorHex} />}
                {progress !== undefined && <ProgressRing percentage={progress} color={colorHex} />}
            </div>
            <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-1 opacity-60">{title}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight tabular-nums">{value}</h3>
                    {trendData && (
                        <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mb-1">
                            <TrendingUp size={12} />
                            +12%
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};

const IntelligenceBubbles = ({ leads = [], opportunities = [] }) => {
    // Process leads and opportunities into actionable suggestions
    const actions = React.useMemo(() => {
        // 1. Get the latest lead (Newest first)
        const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestLead = sortedLeads[0];

        // 2. Get the oldest active deal (Oldest first, excluding closed)
        const activeDeals = opportunities.filter(o => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost');
        const sortedDeals = [...activeDeals].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const oldestDeal = sortedDeals[0];

        const results = [];

        // Latest Lead at the top (i=0)
        if (latestLead) {
            results.push({
                id: `lead-${latestLead.id}`,
                text: `${latestLead.contactName || 'New Prospect'}: Incoming signal detected. Primary follow-up required.`,
                name: latestLead.contactName,
                type: 'high',
                subtext: 'Latest Lead'
            });
        }

        // Middle item (next latest lead or another deal if needed)
        if (sortedLeads.length > 1) {
            const nextLead = sortedLeads[1];
            results.push({
                id: `lead-${nextLead.id}`,
                text: `${nextLead.companyName}: Analyze engagement pattern.`,
                name: nextLead.contactName,
                type: 'med',
                subtext: 'High Interest'
            });
        }

        // Oldest Deal at the bottom
        if (oldestDeal) {
            results.push({
                id: `deal-${oldestDeal.id}`,
                text: `${oldestDeal.name}: Stagnant deal detected. Urgent intervention recommended.`,
                type: 'low',
                subtext: 'Oldest Active Deal'
            });
        }

        return results;
    }, [leads, opportunities]);

    const finalActions = actions.length > 0 ? actions : [{ id: 'f1', text: "Scan for new opportunities...", type: "low" }];

    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const containerRef = React.useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const Bubble = ({ text, type, index, subtext, name }) => {
        const navigate = useNavigate();
        const initialX = (index % 2 === 0 ? -90 : 90);
        const initialY = (index * 70 - 70);

        const posX = motionValue(initialX);
        const posY = motionValue(initialY);

        const springX = useSpring(posX, { damping: 50, stiffness: 200 });
        const springY = useSpring(posY, { damping: 50, stiffness: 200 });

        useEffect(() => {
            let lastUpdate = Date.now();
            let frameId;

            const update = () => {
                const now = Date.now();
                if (now - lastUpdate < 16) {
                    frameId = requestAnimationFrame(update);
                    return;
                }
                lastUpdate = now;

                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                const bubbleActualX = posX.get() + rect.width / 2;
                const bubbleActualY = posY.get() + rect.height / 2;

                const dx = bubbleActualX - mousePos.x;
                const dy = bubbleActualY - mousePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    const angle = Math.atan2(dy, dx);
                    const push = (140 - dist) * 0.4;
                    posX.set(posX.get() + Math.cos(angle) * push);
                    posY.set(posY.get() + Math.sin(angle) * push);
                }

                posX.set(posX.get() + (initialX - posX.get()) * 0.08);
                posY.set(posY.get() + (initialY - posY.get()) * 0.08);

                frameId = requestAnimationFrame(update);
            };

            frameId = requestAnimationFrame(update);
            return () => cancelAnimationFrame(frameId);
        }, [mousePos, posX, posY, initialX, initialY]);

        return (
            <motion.div
                style={{ x: springX, y: springY }}
                onClick={() => name && navigate(`/contacts?highlight=${encodeURIComponent(name)}`)}
                className="absolute p-4 rounded-2xl bg-[var(--card)] backdrop-blur-xl border border-[var(--input-border)] shadow-2xl cursor-pointer select-none z-10 w-52 overflow-hidden group/bubble"
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${type === 'high' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                                type === 'med' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                                    'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                                }`}></span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-40">AI Analysis</span>
                        </div>
                        {subtext && <span className="text-[7px] font-bold text-[var(--text-secondary)] opacity-20 uppercase tracking-tighter">{subtext}</span>}
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">{text}</p>
                </div>
            </motion.div>
        );
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
            className="w-full h-full relative flex items-center justify-center overflow-hidden min-h-[400px]"
        >
            <div className="flex flex-col items-center z-0 opacity-10 pointer-events-none text-center px-6">
                <TrendingUp className="w-12 h-12 text-[var(--text-primary)] mb-4" />
                <p className="font-bold uppercase tracking-[0.3em] text-[10px] text-[var(--text-primary)]">Neural Hub</p>
                <p className="text-[7px] text-[var(--text-secondary)] font-medium leading-relaxed uppercase tracking-widest mt-32 absolute bottom-6 w-full px-8">
                    This response was generated by artificial intelligence and may contain inaccuracies.
                </p>
            </div>

            {finalActions.map((action, i) => (
                <Bubble key={action.id} text={action.text} type={action.type} index={i} subtext={action.subtext} name={action.name} />
            ))}
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        convertedLeads: 0,
        activeDeals: 0,
        closedDeals: 0,
        revenue: 0
    });
    const [leads, setLeads] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, leadsRes, oppsRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/leads'),
                    api.get('/opportunities')
                ]);
                setStats(statsRes.data);
                setLeads(leadsRes.data);
                setOpportunities(oppsRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] animate-pulse">Initializing Antigravity Systems</div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Penguin CRM</h2>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium opacity-60 uppercase text-[10px] tracking-widest">Customer Management, Done Right.</p>
                </div>
                <div className="hidden md:block py-2 px-4 bg-[var(--card)] border border-[var(--input-border)] rounded-full">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Operational
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Widget
                    title="Total Leads"
                    value={stats?.totalLeads ?? 0}
                    icon={Users}
                    colorClass="bg-blue-500/10 text-blue-500"
                    trendData={[12, 19, 15, 22, 18, 24, 28]}
                />
                <Widget
                    title="Active Deals"
                    value={stats?.activeDeals ?? 0}
                    icon={Briefcase}
                    colorClass="bg-amber-500/10 text-amber-500"
                    progress={65}
                />
                <Widget
                    title="Closed Won"
                    value={stats?.closedDeals ?? 0}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-500/10 text-emerald-500"
                />
                <Widget
                    title="Revenue"
                    value={`$${((stats?.revenue ?? 0) / 1000).toFixed(1)}k`}
                    icon={DollarSign}
                    colorClass="bg-indigo-500/10 text-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <RevenueTrends trends={stats.revenueTrends} />
                </div>
                <div className="lg:col-span-2 bg-[var(--card)] rounded-[40px] border border-[var(--input-border)] shadow-2xl h-auto min-h-[450px] relative overflow-hidden group">
                    <IntelligenceBubbles leads={leads} opportunities={opportunities} />
                    {/* Bottom gradient indicator */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                </div>
            </div>

            <footer className="mt-16 text-center">
                <p className="text-[30px] text-[var(--text-secondary)] tracking-[0.2em] font-medium uppercase opacity-30">
                    🐧
                </p>
            </footer>
        </div>
    );

};

export default Dashboard;
