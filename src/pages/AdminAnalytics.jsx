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

            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.overview.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.overview.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Conversion Rate</h3>
                    <p className="stat-value">{stats.overview.conversionRate}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Views</h3>
                    <p className="stat-value">{stats.overview.viewsCount.toLocaleString()}</p>
                </div>
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
