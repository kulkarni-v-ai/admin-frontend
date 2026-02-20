import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import {
    FiTrendingUp,
    FiShoppingBag,
    FiPackage,
    FiAlertCircle,
    FiArrowUpRight,
    FiArrowDownRight,
    FiMoreVertical,
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

const StatCard = ({ title, value, icon, trend, trendValue, color, loading }) => (
    <motion.div
        whileHover={{ y: -5 }}
        style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "var(--card-shadow)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            border: "1px solid var(--border-color)",
            position: "relative",
            minHeight: "160px"
        }}
    >
        {loading ? (
            <div className="skeleton-pulse" style={{ height: "100%", width: "100%", borderRadius: "8px", background: "#f1f5f9" }} />
        ) : (
            <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{
                        padding: "12px",
                        borderRadius: "12px",
                        backgroundColor: `${color}10`,
                        color: color,
                        fontSize: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {icon}
                    </div>
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <FiMoreVertical />
                    </button>
                </div>

                <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, margin: "0 0 4px 0" }}>{title}</p>
                    <h3 style={{ fontSize: "1.75rem", margin: 0, fontWeight: 700 }}>{value}</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem" }}>
                    <span style={{
                        display: "flex",
                        alignItems: "center",
                        color: trend === "up" ? "#10b981" : "#ef4444",
                        fontWeight: 600
                    }}>
                        {trend === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />}
                        {trendValue}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>live data</span>
                </div>
            </>
        )}
    </motion.div>
);

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/admin/stats");
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (error) {
        return (
            <div style={{
                padding: "40px",
                backgroundColor: "#fef2f2",
                borderRadius: "16px",
                border: "1px solid #fee2e2",
                textAlign: "center"
            }}>
                <FiAlertCircle style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "16px" }} />
                <h3 style={{ color: "#991b1b", margin: 0 }}>Connection Error</h3>
                <p style={{ color: "#b91c1c", marginBottom: "24px" }}>{error}</p>
                <button
                    onClick={fetchStats}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const stats = data?.summary || { totalRevenue: 0, totalOrders: 0, totalProducts: 0, lowStockCount: 0 };
    const chartData = data?.ordersChart || [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px"
            }}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue?.toLocaleString() || '0'}`}
                    icon={<FiTrendingUp />}
                    trend="up"
                    trendValue="Live"
                    color="#3b82f6"
                    loading={loading}
                />
                <StatCard
                    title="Orders"
                    value={stats.totalOrders?.toString() || '0'}
                    icon={<FiShoppingBag />}
                    trend="up"
                    trendValue="Live"
                    color="#8b5cf6"
                    loading={loading}
                />
                <StatCard
                    title="Inventory Items"
                    value={stats.totalProducts?.toString() || '0'}
                    icon={<FiPackage />}
                    trend="up"
                    trendValue="Live"
                    color="#ec4899"
                    loading={loading}
                />
                <StatCard
                    title="Critical Stock"
                    value={`${stats.lowStockCount || '0'} Alerts`}
                    icon={<FiAlertCircle />}
                    trend={stats.lowStockCount > 0 ? "down" : "up"}
                    trendValue={stats.lowStockCount > 0 ? "Warning" : "Secure"}
                    color="#f59e0b"
                    loading={loading}
                />
            </div>

            {/* Main Section: Chart + System Status */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "24px",
                alignItems: "stretch"
            }}>
                {/* Chart Card */}
                <div style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    boxShadow: "var(--card-shadow)",
                    border: "1px solid var(--border-color)",
                    minHeight: "450px",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "1.125rem" }}>Revenue Strategy</h3>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "var(--text-muted)" }}>Daily revenue growth (Last 7 Days)</p>
                        </div>
                        <button
                            onClick={fetchStats}
                            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}
                        >
                            <FiRefreshCw className={loading ? "spin" : ""} />
                            Refresh
                        </button>
                    </div>

                    <div style={{ flex: 1, width: "100%", position: "relative" }}>
                        {loading ? (
                            <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                                <p style={{ color: "#64748b" }}>Loading performance data...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        dy={10}
                                        tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Right Column: System Status */}
                <div style={{
                    backgroundColor: "#0f172a",
                    padding: "24px",
                    borderRadius: "16px",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                }}>
                    <h3 style={{ margin: 0, fontSize: "1.125rem", color: "white" }}>System Status</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[
                            { label: "API Gateway", status: loading ? "..." : "Operational", color: "#10b981" },
                            { label: "Database", status: loading ? "..." : "Healthy", color: "#10b981" },
                            { label: "Storage Service", status: loading ? "..." : "Operational", color: "#10b981" },
                            { label: "Auth Provider", status: loading ? "..." : "Online", color: "#10b981" },
                        ].map((s, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{s.label}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{s.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: "auto",
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        fontSize: "0.875rem"
                    }}>
                        <p style={{ margin: "0 0 8px 0", color: "#94a3b8" }}>Real-time synchronization active.</p>
                        <button
                            onClick={fetchStats}
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "white",
                                color: "#0f172a",
                                border: "none",
                                borderRadius: "#8px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
