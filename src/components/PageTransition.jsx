import { motion } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 15,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        y: -15,
        scale: 1.02
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%", width: "100%" }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
