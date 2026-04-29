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

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

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

  const isFormValid = username.length >= 3 && password.length >= 5;

  const handleButtonHover = () => {
    if (!isFormValid) {
      const maxX = 150;
      const maxY = 150;
      const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
      const randomY = Math.floor(Math.random() * maxY * 2) - maxY;
      setButtonPosition({ x: randomX, y: randomY });
    } else {
      setButtonPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#050505", // Deep black theme from landing page
      backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Neon Accents */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        filter: "blur(80px)",
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(10, 10, 10, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "48px",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
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
            style={{ color: "#a1a1aa", fontSize: "14px", fontWeight: 500, letterSpacing: "0.5px" }}
          >
            Enter your credentials to access the HQ
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
              borderRadius: "12px",
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
            <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Username</label>
            <input
              type="text"
              placeholder="System ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              required
            />
          </motion.div>

          <div style={{ position: "relative", height: "60px", marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, x: buttonPosition.x, y: buttonPosition.y }}
              transition={{ 
                opacity: { delay: 0.6 },
                x: { type: "spring", stiffness: 300, damping: 20 },
                y: { type: "spring", stiffness: 300, damping: 20 }
              }}
              onMouseEnter={handleButtonHover}
              onClick={(e) => {
                if (!isFormValid) {
                  e.preventDefault();
                  handleButtonHover();
                }
              }}
              type={isFormValid ? "submit" : "button"}
              disabled={isLoading}
              whileHover={isFormValid ? { scale: 1.05 } : {}}
              whileTap={isFormValid ? { scale: 0.95 } : {}}
              style={{
                position: "absolute",
                width: "100%",
                padding: "16px",
                background: isFormValid ? "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" : "rgba(255,255,255,0.1)",
                color: isFormValid ? "white" : "#a1a1aa",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "1px",
                cursor: isLoading ? "not-allowed" : (isFormValid ? "pointer" : "default"),
                boxShadow: isFormValid ? "0 10px 20px -5px rgba(168, 85, 247, 0.4)" : "none",
                transition: "background 0.3s, color 0.3s"
              }}
            >
              {isLoading ? "Authenticating..." : "INITIALIZE"}
            </motion.button>
          </div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", marginTop: "40px", color: "#52525b", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}
        >
          Secure Connection • {new Date().toLocaleDateString()}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;
