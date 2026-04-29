import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiServer, FiDatabase, FiHardDrive,
    FiShield, FiActivity, FiRefreshCw
} from "react-icons/fi";
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CARD_BG     = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const AXIS_COLOR  = "#475569";
const GRID_COLOR  = "rgba(255,255,255,0.05)";
const PRIMARY     = "#d4af37";

const mockLoadData = [
    { time: "09:00", cpu: 45, ram: 52 },
    { time: "10:00", cpu: 48, ram: 55 },
    { time: "11:00", cpu: 62, ram: 60 },
    { time: "12:00", cpu: 58, ram: 58 },
    { time: "13:00", cpu: 75, ram: 65 },
    { time: "14:00", cpu: 68, ram: 68 },
    { time: "15:00", cpu: 60, ram: 70 },
];

const STATUS_COLORS = {
    healthy:  { text: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
    warning:  { text: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
    critical: { text: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)"   },
};

const LOG_STATUS_COLOR = {
    Blocked:   "#f87171",
    Success:   "#34d399",
    Verified:  PRIMARY,
    Throttled: "#fb923c",
};

// ── Metric Card ──────────────────────────────────────────
const MetricCard = ({ title, value, unit, icon, status, color, delay = 0 }) => {
    const s = STATUS_COLORS[status] || STATUS_COLORS.healthy;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
                background: CARD_BG,
                padding: "22px",
                borderRadius: "16px",
                border: `1px solid ${CARD_BORDER}`,
                display: "flex", flexDirection: "column", gap: "14px",
                position: "relative", overflow: "hidden"
            }}
        >
            {/* Accent glow corner */}
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: "70px", height: "70px",
                background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
                borderRadius: "0 16px 0 100%"
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{
                    color, fontSize: "1.2rem",
                    background: `${color}15`, padding: "10px",
                    borderRadius: "10px", display: "flex"
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: "0.7rem", fontWeight: 700,
                    color: s.text, background: s.bg,
                    border: `1px solid ${s.border}`,
                    padding: "3px 10px", borderRadius: "20px",
                    textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                    {status}
                </span>
            </div>

            <div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>{title}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{value}</span>
                    {unit && <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{unit}</span>}
                </div>
            </div>
        </motion.div>
    );
};

// ── Dark Tooltip ─────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: "rgba(8,8,8,0.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", padding: "10px 14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
            }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.75rem", fontWeight: 600 }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ margin: "4px 0 0", color: p.stroke, fontSize: "0.875rem", fontWeight: 700 }}>
                        {p.name}: {p.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ── Main Component ────────────────────────────────────────
const SystemMonitoring = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshMetrics = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    return (
        <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}
            >
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>Infrastructure Monitor</h1>
                    <p style={{ margin: "6px 0 0", color: "#475569", fontSize: "0.875rem" }}>
                        Superadmin restricted environment: Real-time system diagnostics.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={refreshMetrics}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 18px",
                        background: CARD_BG,
                        border: `1px solid ${CARD_BORDER}`,
                        borderRadius: "10px",
                        color: "#94a3b8", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
                    }}
                >
                    <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
                        <FiRefreshCw size={14} />
                    </motion.div>
                    Refresh Logs
                </motion.button>
            </motion.div>

            {/* ── Metric Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <MetricCard title="Main Server (API)"  value="99.9"   unit="%"  icon={<FiServer />}   status="healthy"  color="#3b82f6" delay={0.05} />
                <MetricCard title="Primary Database"   value="14"     unit="ms" icon={<FiDatabase />}  status="healthy"  color="#8b5cf6" delay={0.1}  />
                <MetricCard title="Storage Capacity"   value="64.2"   unit="GB" icon={<FiHardDrive />} status="healthy"  color="#ec4899" delay={0.15} />
                <MetricCard title="Security Shield"    value="Active" unit=""   icon={<FiShield />}    status="warning"  color="#f59e0b" delay={0.2}  />
            </div>

            {/* ── Charts + Feed ── */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

                {/* Resource Utilization Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ background: CARD_BG, padding: "24px", borderRadius: "16px", border: `1px solid ${CARD_BORDER}` }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0 }}>Resource Utilization</h3>
                        <div style={{ display: "flex", gap: "16px" }}>
                            {[{ label: "CPU", color: "#3b82f6" }, { label: "RAM", color: "#8b5cf6" }].map(l => (
                                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#64748b" }}>
                                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: l.color, display: "inline-block" }} />
                                    {l.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockLoadData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradCPU" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}   />
                                    </linearGradient>
                                    <linearGradient id="gradRAM" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}   />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 11 }} domain={[0, 100]} unit="%" />
                                <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fill="url(#gradCPU)" name="CPU" />
                                <Area type="monotone" dataKey="ram" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradRAM)" name="RAM" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Security Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{
                        background: CARD_BG, padding: "22px", borderRadius: "16px",
                        border: `1px solid ${CARD_BORDER}`,
                        display: "flex", flexDirection: "column", gap: "20px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FiActivity style={{ color: PRIMARY }} size={16} />
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0 }}>Security Feed</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                        {[
                            { event: "Login Attempt", from: "IP: 182.xx",       status: "Blocked",   time: "2m ago" },
                            { event: "Cert Renewal",  from: "Auto-renew",        status: "Success",   time: "1h ago" },
                            { event: "SSH Access",    from: "Root User",         status: "Verified",  time: "3h ago" },
                            { event: "API Surge",     from: "NodeJS/Backend",    status: "Throttled", time: "5h ago" },
                        ].map((log, i) => (
                            <div key={i} style={{
                                borderLeft: `2px solid ${LOG_STATUS_COLOR[log.status] || "#334155"}`,
                                paddingLeft: "14px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0" }}>{log.event}</span>
                                    <span style={{ fontSize: "0.7rem", color: "#475569" }}>{log.time}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{log.from}</span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: LOG_STATUS_COLOR[log.status] || "#94a3b8" }}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button style={{
                        padding: "10px",
                        background: `linear-gradient(135deg, ${PRIMARY}18, ${PRIMARY}08)`,
                        border: `1px solid ${PRIMARY}30`,
                        borderRadius: "10px",
                        color: PRIMARY,
                        fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                        letterSpacing: "0.02em"
                    }}>
                        Deep Packet Inspection
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SystemMonitoring;
