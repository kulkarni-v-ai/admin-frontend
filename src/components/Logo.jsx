import { motion } from "framer-motion";
import { Package } from "lucide-react";

const Logo = () => {
    return (
        <motion.div
            className="logo-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", overflow: "hidden" }}
        >
            <img
                src="/logo.png"
                alt="HOV Logo"
                style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    boxShadow: "0 2px 10px rgba(212,175,55,0.35)",
                    border: "2px solid #d4af37"
                }}
            />
            <div style={{ lineHeight: 1.1, overflow: "hidden" }}>
                <div style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    background: "linear-gradient(to right, #ffffff, #d1d5db)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap"
                }}>
                    HOUSE OF VISUALS
                </div>
                <div style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#d4af37",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: "2px"
                }}>
                    Admin Panel
                </div>
            </div>
        </motion.div>
    );
};

export default Logo;
