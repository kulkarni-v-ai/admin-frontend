import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("admin")
  );

  const login = async () => {
    try {
      const res = await fetch(
        "https://shop-backend-yvk4.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setIsAdmin(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setIsAdmin(false);
  };

  // ===== DASHBOARD VIEW =====
 if (isAdmin) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      <AdminProducts />
      <hr style={{ margin: "40px 0" }} />
      <AdminOrders />
    </div>
  );
}


  // ===== LOGIN VIEW =====
  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login</h1>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
