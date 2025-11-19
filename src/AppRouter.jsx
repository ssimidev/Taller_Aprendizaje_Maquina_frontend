import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

// --- Protección de rutas (solo si hay JWT) ---
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/" element={<Login />} />

      {/* PRIVATE ROUTES */}
      <Route
        path="/form"
        element={
          <PrivateRoute>
            <Form />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />

      {/* ANY UNKNOWN ROUTE */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
