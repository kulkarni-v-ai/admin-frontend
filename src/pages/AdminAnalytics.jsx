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

    if (loading) return <div className="loading">Loading Analytics...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!stats) return null;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Business Analytics</h1>
                <p>Overview of store performance and shopping behaviors</p>
            </div>

            <div className="dashboard-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
                marginTop: "32px"
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
                    value={stats.overview.conversionRate}
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

            <div className="charts-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
                <div className="chart-card card">
                    <h3>Top 5 Purchased Products</h3>
                    <div style={{ height: 300, marginTop: "1rem" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topPurchased}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="totalSold" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card card">
                    <h3>Top 5 Browsed Products</h3>
                    <div style={{ height: 300, marginTop: "1rem" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topBrowsed}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
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
