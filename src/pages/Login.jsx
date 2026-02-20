import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%)",
      padding: "20px"
    }}>
      {/* Decorative Blur Blobs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "300px",
        height: "300px",
        background: "rgba(59, 130, 246, 0.15)",
        filter: "blur(100px)",
        borderRadius: "50%",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "15%",
        width: "400px",
        height: "400px",
        background: "rgba(168, 85, 247, 0.1)",
        filter: "blur(120px)",
        borderRadius: "50%",
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "48px",
          borderRadius: "32px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "480px",
          zIndex: 1
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Logo />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: "var(--text-sidebar)", fontSize: "14px", fontWeight: 500 }}
          >
            Enter your credentials to manage HOV Shop
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#f87171",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "32px",
              fontSize: "14px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              textAlign: "center",
              fontWeight: 600
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>Username</label>
            <input
              type="text"
              placeholder="e.g. superadmin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(0, 0, 0, 0.2)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(0, 0, 0, 0.2)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
              marginTop: "16px"
            }}
          >
            {isLoading ? "Authenticating..." : "Sign In to Portal"}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", marginTop: "40px", color: "var(--text-sidebar)", fontSize: "14px" }}
        >
          Secure Session Initialized: {new Date().toLocaleDateString()}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;
