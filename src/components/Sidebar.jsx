import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiLayout,
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiMonitor,
    FiActivity,
    FiLogOut,
    FiChevronLeft,
    FiMenu
} from "react-icons/fi";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();

    const navItems = [
        {
            path: "/dashboard/analytics",
            label: "Dashboard",
            icon: <FiLayout />,
            allowedRoles: ["superadmin", "admin", "manager"]
        },
        {
            path: "/dashboard/products",
            label: "Inventory",
            icon: <FiBox />,
            allowedRoles: ["superadmin", "admin", "manager"]
        },
        {
            path: "/dashboard/orders",
            label: "Orders",
            icon: <FiShoppingBag />,
            allowedRoles: ["superadmin", "admin", "manager"]
        },
        {
            path: "/dashboard/users",
            label: "User Management",
            icon: <FiUsers />,
            allowedRoles: ["superadmin"]
        },
        {
            path: "/dashboard/system-overview",
            label: "Health Check",
            icon: <FiMonitor />,
            allowedRoles: ["superadmin"]
        },
        {
            path: "/dashboard/system-logs",
            label: "Security Logs",
            icon: <FiActivity />,
            allowedRoles: ["superadmin"]
        }
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)" }}
            style={{
                backgroundColor: "var(--bg-sidebar)",
                color: "white",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 50,
                overflow: "hidden",
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
        >
            {/* Logo Section */}
            <div style={{
                height: "var(--navbar-height)",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "space-between",
                padding: "0 20px",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ fontWeight: "bold", fontSize: "1.25rem", color: "var(--primary)", whiteSpace: "nowrap" }}
                        >
                            HOV <span style={{ color: "white" }}>ADMIN</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "none",
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
                </button>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "24px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {navItems.map((item) => {
                    if (!hasRole(item.allowedRoles)) return null;
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "12px 16px",
                                color: isActive ? "white" : "var(--text-sidebar)",
                                backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                                textDecoration: "none",
                                borderRadius: "12px",
                                position: "relative",
                                overflow: "hidden",
                                transition: "all 0.2s"
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        width: "4px",
                                        height: "20px",
                                        backgroundColor: "var(--primary)",
                                        borderRadius: "0 4px 4px 0"
                                    }}
                                />
                            )}
                            <span style={{ fontSize: "1.25rem", color: isActive ? "var(--primary)" : "inherit" }}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span style={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap" }}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {!isCollapsed && (
                    <div style={{
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        borderRadius: "12px",
                        marginBottom: "12px"
                    }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "4px" }}>{user?.username}</div>
                        <div style={{
                            fontSize: "0.75rem",
                            color: "var(--primary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: 700
                        }}>
                            {user?.role}
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "none",
                        color: "#ef4444",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.875rem"
                    }}
                >
                    <FiLogOut />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
