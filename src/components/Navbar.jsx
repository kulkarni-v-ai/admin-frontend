import { useLocation } from "react-router-dom";
import { FiBell, FiSearch } from "react-icons/fi";

const Navbar = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split("/").pop();
        if (!path || path === "dashboard") return "Overview";
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
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
            {/* Page title */}
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                {getPageTitle()}
            </h1>

            {/* Search + Bell */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "8px", padding: "7px 12px",
                    color: "#475569"
                }}>
                    <FiSearch size={13} />
                    <input
                        type="text"
                        placeholder="Search…"
                        style={{
                            border: "none", background: "transparent",
                            outline: "none", fontSize: "0.8rem",
                            color: "#94a3b8", width: "160px"
                        }}
                    />
                </div>

                <button style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#64748b", fontSize: "1.1rem",
                    padding: "7px", borderRadius: "8px",
                    display: "flex", alignItems: "center", cursor: "pointer"
                }}>
                    <FiBell size={16} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
