import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiServer,
    FiDatabase,
    FiCpu,
    FiActivity,
    FiShield,
    FiHardDrive,
    FiRefreshCw
} from "react-icons/fi";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Mock data for system load over time
const mockLoadData = [
    { time: "09:00", cpu: 45, ram: 52 },
    { time: "10:00", cpu: 48, ram: 55 },
    { time: "11:00", cpu: 62, ram: 60 },
    { time: "12:00", cpu: 58, ram: 58 },
    { time: "13:00", cpu: 75, ram: 65 },
    { time: "14:00", cpu: 68, ram: 68 },
    { time: "15:00", cpu: 60, ram: 70 },
];

const MetricCard = ({ title, value, unit, icon, status, color }) => (
    <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: color, fontSize: "1.25rem" }}>{icon}</div>
            <div style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: status === "healthy" ? "#10b981" : "#f59e0b",
                backgroundColor: status === "healthy" ? "#10b98115" : "#f59e0b15",
                padding: "4px 8px",
                borderRadius: "6px",
                textTransform: "uppercase"
            }}>
                {status}
            </div>
        </div>
        <div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>{title}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{unit}</span>
            </div>
        </div>
    </div>
);

const SystemMonitoring = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshMetrics = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h2 style={{ fontSize: "1.75rem", margin: "0 0 8px 0" }}>Infrastructure Monitor</h2>
                    <p style={{ margin: 0, color: "var(--text-muted)" }}>Superadmin restricted environment: Real-time system diagnostics.</p>
                </div>
                <button
                    onClick={refreshMetrics}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        backgroundColor: "white",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.875rem"
                    }}
                >
                    <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }}>
                        <FiRefreshCw />
                    </motion.div>
                    Refresh Logs
                </button>
            </div>

            {/* Metrics Overview */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px"
            }}>
                <MetricCard
                    title="Main Server (API)"
                    value="99.9"
                    unit="%"
                    icon={<FiServer />}
                    status="healthy"
                    color="#3b82f6"
                />
                <MetricCard
                    title="Primary Database"
                    value="14"
                    unit="ms"
                    icon={<FiDatabase />}
                    status="healthy"
                    color="#8b5cf6"
                />
                <MetricCard
                    title="Storage Capacity"
                    value="64.2"
                    unit="GB"
                    icon={<FiHardDrive />}
                    status="healthy"
                    color="#ec4899"
                />
                <MetricCard
                    title="Security Shield"
                    value="Active"
                    unit=""
                    icon={<FiShield />}
                    status="warning"
                    color="#f59e0b"
                />
            </div>

            {/* Performance Graphs */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "24px"
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--card-shadow)"
                }}>
                    <h3 style={{ fontSize: "1.125rem", margin: "0 0 24px 0" }}>Resource Utilization</h3>
                    <div style={{ height: "340px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockLoadData}>
                                <defs>
                                    <linearGradient id="colorCPU" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRAM" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f slate-100" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCPU)" strokeWidth={2} name="CPU Usage" />
                                <Area type="monotone" dataKey="ram" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRAM)" strokeWidth={2} name="RAM Usage" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{
                    backgroundColor: "#1e293b",
                    padding: "24px",
                    borderRadius: "16px",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FiActivity style={{ color: "#3b82f6" }} />
                        <h3 style={{ fontSize: "1.125rem", margin: 0, color: "white" }}>Security Feed</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {[
                            { event: "Login Attempt", from: "IP: 182.xx", status: "Blocked", time: "2m ago" },
                            { event: "Cert Renewal", from: "Auto-renew", status: "Success", time: "1h ago" },
                            { event: "SSH Access", from: "Root User", status: "Verified", time: "3h ago" },
                            { event: "API Surge", from: "NodeJS/Hov", status: "Throttled", time: "5h ago" },
                        ].map((log, i) => (
                            <div key={i} style={{ borderLeft: "2px solid #334155", paddingLeft: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "4px" }}>
                                    <span style={{ fontWeight: 600 }}>{log.event}</span>
                                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{log.time}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8" }}>
                                    <span>{log.from}</span>
                                    <span style={{ color: log.status === "Blocked" ? "#ef4444" : "#10b981" }}>{log.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button style={{
                        marginTop: "auto",
                        padding: "12px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 600
                    }}>
                        Deep Packet Inspection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemMonitoring;
