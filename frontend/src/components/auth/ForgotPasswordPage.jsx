import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../../schema/forgotPasswordSchema";
import { useAuthStore } from "../../store/useAuthStore";
import React from "react";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await forgotPassword(data);
      navigate(`/verify-otp/${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="lg:w-1/2 relative overflow-hidden p-8 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute top-0 -right-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <div className="mx-auto lg:mx-0 h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Reset Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Password
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-3xl">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-900/50">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/50 py-8 px-6 sm:px-10 rounded-xl border border-gray-700 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">
                  Reset Your Password
                </h2>
                <p className="mt-2 text-gray-400">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-gray-700 border ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;