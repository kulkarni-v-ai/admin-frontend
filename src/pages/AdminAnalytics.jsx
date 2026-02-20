import { useState, useEffect } from "react";
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
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiEye } from "react-icons/fi";
import StatCard from "../components/StatCard";

function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/analytics/stats");
            setStats(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

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
    if (error) return <div className="error-message" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>{error}</div>;
    if (!stats) return null;

    return (
        <div className="admin-page" style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="admin-header"
            >
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Business Analytics</h1>
                <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Detailed overview of store performance and customer behavior</p>
            </motion.div>

            <div className="dashboard-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginTop: "40px"
            }}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.overview.totalRevenue.toLocaleString()}`}
                    icon={<FiDollarSign />}
                    color="#10b981"
                    delay={0.1}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.overview.totalOrders}
                    icon={<FiShoppingBag />}
                    color="#4f46e5"
                    delay={0.2}
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${stats.overview.conversionRate}%`}
                    icon={<FiTrendingUp />}
                    color="#f59e0b"
                    delay={0.3}
                />
                <StatCard
                    title="Total Views"
                    value={stats.overview.viewsCount.toLocaleString()}
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
                    style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" }}
                >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "24px" }}>Top 5 Purchased Products</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topPurchased} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                    style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" }}
                >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "24px" }}>Top 5 Browsed Products</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topBrowsed} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                <div className="card">
                    <h3>Low Stock Alerts</h3>
                    {stats.lowStock.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Stock Remaining</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.lowStock.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td style={{ color: "red", fontWeight: "bold" }}>{p.stock}</td>
                                        <td>₹{p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ padding: "1rem", color: "#6b7280" }}>No low stock products right now!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAnalytics;
