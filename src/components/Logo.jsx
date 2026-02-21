import { motion } from "framer-motion";
import { Package } from "lucide-react";

const Logo = () => {
    return (
        <motion.div
            className="logo-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer"
            }}
        >
            <img
                src="/logo.png"
                alt="Logo"
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                }}
            />
            <h2 style={{
                margin: 0,
                background: "linear-gradient(to right, #ffffff, #d1d5db)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "24px",
                fontWeight: "800",
                letterSpacing: "-0.5px"
            }}>
                HOUSE OF VISUALS <span style={{ fontWeight: "400", opacity: 0.8 }}>Admin</span>
            </h2>
        </motion.div>
    );
};

export default Logo;
