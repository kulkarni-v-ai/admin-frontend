import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import {
    FiLayout,
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiMonitor,
    FiActivity,
    FiLogOut,
    FiChevronLeft,
    FiMenu,
    FiUser
} from "react-icons/fi";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
        },
        {
            path: "/dashboard/edit-landing",
            label: "Edit Landing Page",
            icon: <FiLayout />,
            allowedRoles: ["superadmin"],
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
                justifyContent: "space-between",
                padding: "0 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{ overflow: "hidden" }}
                        >
                            <Logo />
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

                    if (item.external) {
                        return (
                            <a
                                key={item.path}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    padding: "12px 16px",
                                    color: "var(--text-sidebar)",
                                    backgroundColor: "transparent",
                                    textDecoration: "none",
                                    borderRadius: "12px",
                                    transition: "all 0.2s"
                                }}
                            >
                                <span style={{ fontSize: "1.25rem", color: "inherit" }}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span style={{ fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                                        {item.label}
                                    </span>
                                )}
                            </a>
                        );
                    }

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

            {/* ── Footer: User Card ── */}
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {isCollapsed ? (
                    /* Collapsed — just avatar */
                    <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #d4af37, #b8962c)",
                        color: "#000", display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 800, fontSize: "0.95rem",
                        margin: "0 auto"
                    }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                ) : (
                    <div style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "14px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px"
                    }}>
                        {/* Identity row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                                background: "linear-gradient(135deg, #d4af37, #b8962c)",
                                color: "#000", display: "flex", alignItems: "center",
                                justifyContent: "center", fontWeight: 800, fontSize: "0.95rem"
                            }}>
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {user?.username}
                                </div>
                                <div style={{ fontSize: "0.68rem", color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginTop: "2px" }}>
                                    {user?.role}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <button
                                onClick={() => navigate("/dashboard/profile")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    width: "100%", padding: "8px 12px",
                                    background: "rgba(212,175,55,0.06)",
                                    border: "1px solid rgba(212,175,55,0.12)",
                                    borderRadius: "9px", color: "#94a3b8",
                                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                                    transition: "all 0.15s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.12)"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
                            >
                                <FiUser size={13} /> My Profile
                            </button>

                            <button
                                onClick={() => { logout(); navigate("/login"); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    width: "100%", padding: "8px 12px",
                                    background: "rgba(239,68,68,0.06)",
                                    border: "1px solid rgba(239,68,68,0.12)",
                                    borderRadius: "9px", color: "#f87171",
                                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                                    transition: "all 0.15s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                            >
                                <FiLogOut size={13} /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;
