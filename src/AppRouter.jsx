import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Admin from "./pages/Admin";
import AdminUser from "./pages/AdminUser";

// Protección de rutas (requiere JWT)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
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
      <Route
        path="/Admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="/AdminUser"
        element={
          <PrivateRoute>
            <AdminUser />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
