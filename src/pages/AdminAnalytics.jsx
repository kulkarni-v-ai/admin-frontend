import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { FiDollarSign, FiShoppingBag, FiPackage, FiEye, FiRefreshCw } from "react-icons/fi";
import StatCard from "../components/StatCard";

function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/analytics/stats");
            setStats(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e2e8f0",
                    backdropFilter: "blur(4px)"
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.875rem" }}>{label}</p>
                    <p style={{ margin: "4px 0 0 0", color: payload[0].fill, fontSize: "1rem", fontWeight: 700 }}>
                        {payload[0].name === "totalSold" ? "Items Sold: " : "Product Views: "}
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="loading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", fontSize: "1.25rem", color: "var(--text-muted)" }}>Loading Analytics...</div>;
    if (error) return (
        <div className="error-message" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
            <p>{error}</p>
            <button onClick={fetchStats} style={{ marginTop: "1rem", padding: "8px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Retry</button>
        </div>
    );
    if (!stats) return null;

    // Map backend shape → chart-friendly arrays
    const topPurchased = stats.topProducts?.selling || [];
    const topBrowsed   = stats.topProducts?.viewed  || [];

    return (
        <div className="admin-page" style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="admin-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}
            >
                <div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Business Analytics</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Detailed overview of store performance and customer behavior</p>
                </div>
                <button
                    onClick={fetchStats}
                    title="Refresh analytics"
                    style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "10px 18px", background: "#4f46e5", color: "#fff",
                        border: "none", borderRadius: "10px", cursor: "pointer",
                        fontWeight: 600, fontSize: "0.9rem"
                    }}
                >
                    <FiRefreshCw size={15} /> Refresh
                </button>
            </motion.div>

            <div className="dashboard-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginTop: "40px"
            }}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${(stats.summary?.totalRevenue || 0).toLocaleString()}`}
                    icon={<FiDollarSign />}
                    color="#10b981"
                    delay={0.1}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.summary?.totalOrders || 0}
                    icon={<FiShoppingBag />}
                    color="#4f46e5"
                    delay={0.2}
                />
                <StatCard
                    title="Total Products"
                    value={stats.summary?.totalProducts || 0}
                    icon={<FiPackage />}
                    color="#f59e0b"
                    delay={0.3}
                />
                <StatCard
                    title="Total Views"
                    value={(stats.summary?.viewsCount || 0).toLocaleString()}
                    icon={<FiEye />}
                    color="#6366f1"
                    delay={0.4}
                />
            </div>

            <div className="charts-container" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                gap: "32px",
                marginTop: "40px"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="chart-card card"
                    style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-color)" }}
                >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "24px", color: "var(--text-primary)" }}>Top 5 Purchased Products</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPurchased} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="_id"
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="totalSold"
                                    fill="url(#colorPurchased)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="chart-card card"
                    style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-color)" }}
                >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "24px", color: "var(--text-primary)" }}>Top 5 Browsed Products</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topBrowsed} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorBrowsed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="views"
                                    fill="url(#colorBrowsed)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="admin-lists-container" style={{ marginTop: "2rem" }}>
                <div className="card" style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ color: "var(--text-primary)" }}>Low Stock Alerts</h3>
                    {(stats.lowStock || []).length > 0 ? (
                        <table className="admin-table" style={{ color: "var(--text-primary)" }}>
                            <thead>
                                <tr>
                                    <th style={{ color: "var(--text-muted)" }}>Product Name</th>
                                    <th style={{ color: "var(--text-muted)" }}>Stock Remaining</th>
                                    <th style={{ color: "var(--text-muted)" }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.lowStock.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td style={{ color: "#ef4444", fontWeight: "bold" }}>{p.stock}</td>
                                        <td>₹{p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ padding: "1rem", color: "var(--text-muted)" }}>No low stock products right now!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAnalytics;
