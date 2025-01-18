import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import ProtectedRoute from "./ProtectedRoute";
import FriendsProfile from "./components/FriendsProfile";

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/messages"
          element={<ProtectedRoute element={<Messages />} />}
        />
        <Route
          path="/user/:id"
          element={<ProtectedRoute element={<FriendsProfile />} />}
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
