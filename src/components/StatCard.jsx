import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color = "#4f46e5", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 }
            }}
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                position: "relative",
                overflow: "hidden",
                cursor: "default"
            }}
        >
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                    backgroundColor: `${color}10`,
                    color: color,
                    padding: "14px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem",
                    zIndex: 2,
                    transition: "background-color 0.3s ease"
                }}
            >
                {icon}
            </motion.div>
            <div style={{ zIndex: 2 }}>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500 }}>{title}</p>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.3 }}
                    style={{ margin: "4px 0 0 0", fontSize: "1.625rem", fontWeight: 700, color: "#0f172a" }}
                >
                    {value}
                </motion.h3>
            </div>

            {/* Premium background transition on hover effect */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at top right, ${color}08, transparent 70%)`,
                    pointerEvents: "none",
                    zIndex: 1
                }}
            />

            {/* Decorative gradient corner */}
            <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: `linear-gradient(225deg, ${color}15 0%, transparent 70%)`,
                borderRadius: "0 16px 0 100%",
                zIndex: 1
            }} />
        </motion.div>
    );
};

export default StatCard;
