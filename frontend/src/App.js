import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctores from "./pages/Doctores";
import Pacientes from "./pages/Pacientes";
import Citas from "./pages/Citas";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Layout from "./components/Layout";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/doctores"
            element={
              <PrivateRoute>
                <Layout><Doctores /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes"
            element={
              <PrivateRoute>
                <Layout><Pacientes /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/citas"
            element={
              <PrivateRoute>
                <Layout><Citas /></Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
