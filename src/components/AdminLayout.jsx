import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginLeft: isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
                width: isCollapsed ? "calc(100% - var(--sidebar-collapsed-width))" : "calc(100% - var(--sidebar-width))",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
                <Navbar />

                <section style={{
                    flex: 1,
                    padding: "32px",
                    maxWidth: "1400px",
                    width: "100%",
                    margin: "0 auto",
                    boxSizing: "border-box"
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;
