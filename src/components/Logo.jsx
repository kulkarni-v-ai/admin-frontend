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
                gap: "10px",
                cursor: "pointer"
            }}
        >
            <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    padding: "8px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Package color="white" size={24} />
            </motion.div>
            <h2 style={{
                margin: 0,
                background: "linear-gradient(to right, #ffffff, #d1d5db)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "24px",
                fontWeight: "800",
                letterSpacing: "-0.5px"
            }}>
                HOV <span style={{ fontWeight: "400", opacity: 0.8 }}>Admin</span>
            </h2>
        </motion.div>
    );
};

export default Logo;
