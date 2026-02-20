import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAdmin = !!localStorage.getItem("admin");

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={isAdmin ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={isAdmin ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;