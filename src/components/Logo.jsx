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
                alt="HOV Logo" 
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)",
                    border: "2px solid #d4af37"
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
