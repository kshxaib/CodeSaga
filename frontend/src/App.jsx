import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/auth/SignupPage";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AddProblem from "./components/admin/AddProblem";
import AdminRoute from "./components/admin/AdminRoute";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import VerifyCodePage from "./components/auth/VerifyCodePage";
import ProblemPage from "./components/ProblemPage";
import CodeSagaLanding from "./components/CodeSagaLanding ";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <Routes>
          <Route path="/" element={authUser ? <Navigate to="/home" /> : <CodeSagaLanding />} />

          {/* Authenticated routes */}
          <Route path="/home" element={<Layout />}>
            <Route index element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/home" />} />
          <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/home" />} />
          <Route path="/verify-otp/:email" element={!authUser ? <VerifyCodePage /> : <Navigate to="/home" />} />

          {/* Problem routes */}
          <Route path="/problem/:id" element={authUser ? <ProblemPage /> : <Navigate to="/login" />} />

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route 
              path="/add-problem" 
              element={authUser ? <AddProblem /> : <Navigate to="/login" />} 
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;