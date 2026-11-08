import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.js";
import ContentDetails from "./pages/ContentDetails.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/content/:id" element={<ContentDetails />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}