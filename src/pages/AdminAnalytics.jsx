import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { FiDollarSign, FiShoppingBag, FiPackage, FiEye, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import StatCard from "../components/StatCard";

const CARD_BG     = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const AXIS_COLOR  = "#475569";
const GRID_COLOR  = "rgba(255,255,255,0.05)";
const PRIMARY     = "#d4af37";

const RANGES = [
    { key: "week",     label: "Past Week"  },
    { key: "month",    label: "Past Month" },
    { key: "year",     label: "Past Year"  },
    { key: "lifetime", label: "Lifetime"   },
];

function AdminAnalytics() {
    const [stats, setStats]   = useState(null);
    const [range, setRange]   = useState("lifetime");
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    const fetchStats = useCallback(async (r = range) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/analytics/stats?range=${r}`);
            setStats(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }, [range]);

    useEffect(() => { fetchStats(range); }, [range]);

    const handleRange = (r) => {
        setRange(r);
    };

    // Dark tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div style={{
                    background: "rgba(8,8,8,0.95)",
                    backdropFilter: "blur(16px)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#94a3b8", fontSize: "0.75rem" }}>{label}</p>
                    <p style={{ margin: "4px 0 0", color: PRIMARY, fontSize: "1rem", fontWeight: 700 }}>
                        {payload[0].name === "totalSold" ? "Sold: " : "Views: "}
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // ── Loading ──
    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: "14px" }}>
            <div style={{
                width: "36px", height: "36px",
                border: `3px solid rgba(212,175,55,0.2)`,
                borderTopColor: PRIMARY,
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite"
            }} />
            <p style={{ color: "#475569", fontSize: "0.875rem" }}>Loading analytics…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    // ── Error ──
    if (error) return (
        <div style={{ padding: "3rem", textAlign: "center" }}>
            <FiAlertTriangle size={36} color="#ef4444" style={{ marginBottom: "10px" }} />
            <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
            <button onClick={() => fetchStats(range)} style={{
                padding: "10px 24px", background: PRIMARY, color: "#000",
                border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700
            }}>Try Again</button>
        </div>
    );

    if (!stats) return null;

    const topPurchased = stats.topProducts?.selling || [];
    const topBrowsed   = stats.topProducts?.viewed  || [];

    return (
        <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}
            >
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>Business Analytics</h1>
                    <p style={{ color: "#475569", fontSize: "0.875rem", marginTop: "6px" }}>
                        Store performance overview
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    {/* Range Pills */}
                    <div style={{
                        display: "flex", gap: "4px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "12px", padding: "4px"
                    }}>
                        {RANGES.map(r => (
                            <button
                                key={r.key}
                                onClick={() => handleRange(r.key)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    transition: "all 0.2s ease",
                                    background: range === r.key
                                        ? `linear-gradient(135deg, ${PRIMARY}, #b8962c)`
                                        : "transparent",
                                    color: range === r.key ? "#000" : "#64748b",
                                    boxShadow: range === r.key ? `0 2px 12px rgba(212,175,55,0.3)` : "none",
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Refresh */}
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        onClick={() => fetchStats(range)}
                        style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "9px 16px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#94a3b8", borderRadius: "10px", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.8rem"
                        }}
                    >
                        <FiRefreshCw size={13} /> Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={range}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}
                >
                    <StatCard title="Total Revenue"   value={`₹${(stats.summary?.totalRevenue  || 0).toLocaleString()}`} icon={<FiDollarSign />}  color={PRIMARY}   delay={0} />
                    <StatCard title="Total Orders"    value={stats.summary?.totalOrders || 0}                             icon={<FiShoppingBag />} color="#6366f1"   delay={0.05} />
                    <StatCard title="Total Products"  value={stats.summary?.totalProducts || 0}                           icon={<FiPackage />}     color="#f59e0b"   delay={0.1} />
                    <StatCard title="Product Views"   value={(stats.summary?.viewsCount   || 0).toLocaleString()}         icon={<FiEye />}         color="#10b981"   delay={0.15} />
                </motion.div>
            </AnimatePresence>

            {/* ── Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginTop: "24px" }}>
                <ChartCard title="🏆 Top Purchased" delay={0.3}>
                    <BarChart data={topPurchased} margin={{ top: 5, right: 10, left: -15, bottom: 20 }}>
                        <defs>
                            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor={PRIMARY} stopOpacity={0.85} />
                                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0.15} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                        <XAxis dataKey="_id" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} dy={8} />
                        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                        <Bar dataKey="totalSold" fill="url(#goldGrad)" radius={[5,5,0,0]} barSize={34} animationDuration={1000} />
                    </BarChart>
                </ChartCard>

                <ChartCard title="👁️ Top Browsed" delay={0.4}>
                    <BarChart data={topBrowsed} margin={{ top: 5, right: 10, left: -15, bottom: 20 }}>
                        <defs>
                            <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#10b981" stopOpacity={0.85} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} dy={8} />
                        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                        <Bar dataKey="views" fill="url(#tealGrad)" radius={[5,5,0,0]} barSize={34} animationDuration={1000} />
                    </BarChart>
                </ChartCard>
            </div>

            {/* ── Low Stock ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ marginTop: "20px", background: CARD_BG, padding: "22px", borderRadius: "16px", border: `1px solid ${CARD_BORDER}` }}
            >
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FiAlertTriangle color="#f59e0b" size={16} /> Low Stock Alerts
                </h3>
                {(stats.lowStock || []).length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                        <thead>
                            <tr>
                                {["Product", "Stock Left", "Price"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#475569", fontWeight: 600, borderBottom: `1px solid ${CARD_BORDER}`, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.lowStock.map(p => (
                                <tr key={p._id} style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                    <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{p.name}</td>
                                    <td style={{ padding: "10px 12px" }}>
                                        <span style={{ color: "#ef4444", fontWeight: 700, background: "rgba(239,68,68,0.1)", padding: "2px 10px", borderRadius: "20px", fontSize: "0.8rem" }}>
                                            {p.stock} left
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px 12px", color: PRIMARY, fontWeight: 600 }}>₹{p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: "#475569", padding: "0.5rem 0", fontSize: "0.875rem" }}>✅ All products are well-stocked!</p>
                )}
            </motion.div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// Reusable chart wrapper
function ChartCard({ title, children, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            style={{ background: CARD_BG, padding: "22px", borderRadius: "16px", border: `1px solid ${CARD_BORDER}` }}
        >
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>{title}</h3>
            <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default AdminAnalytics;
