import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { FiBell, FiSearch, FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getPageTitle = () => {
        const path = location.pathname.split("/").pop();
        if (!path || path === "dashboard") return "Overview";
        return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
    };

    return (
        <header className="glass" style={{
            height: "var(--navbar-height)",
            position: "sticky",
            top: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            borderBottom: "1px solid var(--border-color)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <h1 style={{ fontSize: "1.25rem", margin: 0 }}>{getPageTitle()}</h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Search - Mock */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.875rem" }}
                    />
                </div>

                {/* Notifications - Mock */}
                <button style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.25rem" }}>
                    <FiBell />
                </button>

                <div style={{ width: "1px", height: "24px", backgroundColor: "var(--border-color)" }} />

                {/* User Info */}
                <div style={{ position: "relative" }} ref={dropdownRef}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            background: "var(--glass)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary)",
                            color: "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: "bold"
                        }}>
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-main)" }}>{user?.username}</span>
                        <FiChevronDown size={14} color="var(--text-muted)" style={{ transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </motion.div>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 10px)",
                                    right: 0,
                                    width: "220px",
                                    background: "rgba(10,10,10,0.92)",
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    borderRadius: "14px",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    overflow: "hidden",
                                    zIndex: 50
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    padding: "14px 16px",
                                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}>
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--primary), #b8962c)",
                                        color: "#000", display: "flex", alignItems: "center",
                                        justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem",
                                        flexShrink: 0
                                    }}>
                                        {user?.username?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>{user?.username}</p>
                                        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--primary)", textTransform: "capitalize", fontWeight: 500 }}>{user?.role}</p>
                                    </div>
                                </div>

                                {/* Menu items */}
                                <div style={{ padding: "8px" }}>
                                    <DropdownItem
                                        icon={<FiUser size={14} />}
                                        label="My Profile"
                                        onClick={() => { setShowDropdown(false); navigate("/dashboard/profile"); }}
                                        hoverBg="rgba(212,175,55,0.08)"
                                        color="var(--text-main)"
                                    />
                                    <div style={{ margin: "6px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                                    <DropdownItem
                                        icon={<FiLogOut size={14} />}
                                        label="Logout"
                                        onClick={() => { setShowDropdown(false); logout(); navigate("/login"); }}
                                        hoverBg="rgba(220,38,38,0.12)"
                                        color="#f87171"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

function DropdownItem({ icon, label, onClick, hoverBg, color }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                border: "none",
                background: hovered ? hoverBg : "transparent",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: color,
                textAlign: "left",
                transition: "background 0.15s ease",
                fontWeight: 500,
            }}
        >
            {icon} {label}
        </button>
    );
}

export default Navbar;

