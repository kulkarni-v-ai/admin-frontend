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
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            backgroundColor: "white",
                            border: "1px solid var(--border-color)",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: "bold"
                        }}>
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111" }}>{user?.username}</span>
                        <FiChevronDown size={14} color="var(--text-muted)" style={{ transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </motion.div>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    width: "200px",
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    border: "1px solid var(--border-color)",
                                    overflow: "hidden",
                                    zIndex: 50
                                }}
                            >
                                <div style={{ padding: "12px", borderBottom: "1px solid var(--border-color)" }}>
                                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>{user?.username}</p>
                                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{user?.role}</p>
                                </div>
                                <div style={{ padding: "8px" }}>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate("/dashboard/profile");
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "8px 12px",
                                            border: "none",
                                            background: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            color: "var(--text-color)",
                                            textAlign: "left"
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "var(--bg-color)"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    >
                                        <FiUser /> My Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            logout();
                                            navigate("/login");
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "8px 12px",
                                            border: "none",
                                            background: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            color: "#dc2626",
                                            textAlign: "left",
                                            marginTop: "4px"
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#fef2f2"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
