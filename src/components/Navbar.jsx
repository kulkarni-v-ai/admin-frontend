import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { FiBell, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

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
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right", display: "none" }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>{user?.username}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{user?.role}</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
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
                        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{user?.username}</span>
                        <FiChevronDown size={14} color="var(--text-muted)" />
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
