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
            <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4af37, #b8962c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: "900",
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
            }}>
                HOV
            </div>
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
