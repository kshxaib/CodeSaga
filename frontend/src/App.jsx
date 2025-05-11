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

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>

          <Route path="/signup" element={!authUser? <SignupPage /> : <Navigate to="/" />}/>

          <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}/>

          <Route path="/verify-otp/:email" element={!authUser ? <VerifyCodePage /> : <Navigate to="/" />}/>

          <Route element={<AdminRoute/>}>
            <Route path="/add-problem" element={authUser ? <AddProblem /> : <Navigate to="/" />}/>
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
