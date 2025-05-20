import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { loginSchema } from "../../schema/LoginSchema";
import GoogleAuthButton from "./GoogleAuthButton";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuthStore();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await login(data);
    reset();
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
              <Code className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Welcome Back to</span>
              <span className="pb-2 block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                CodeSaga
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-3xl">
              Continue your coding journey with access to premium resources, community support, and expert guidance.
            </p>
            
            <div className="mt-10 hidden lg:block">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center mb-3">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-medium">Code Execution</h3>
                  <p className="mt-1 text-sm text-gray-400">Run code in multiple languages with real-time results</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center mb-3">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-medium">Secure Access</h3>
                  <p className="mt-1 text-sm text-gray-400">Your data is always protected</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="h-10 w-10 rounded-md bg-indigo-500/10 flex items-center justify-center mb-3">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="font-medium">Stay Updated</h3>
                  <p className="mt-1 text-sm text-gray-400">Get notified about new features</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-900/50">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/50 py-8 px-6 sm:px-10 rounded-xl border border-gray-700 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">
                  Sign In to Your Account
                </h2>
                <p className="mt-2 text-gray-400">
                  Continue your developer journey
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
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

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`block w-full pl-10 pr-10 py-2.5 bg-gray-700 border ${
                        errors.password ? "border-red-500" : "border-gray-600"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="text-right mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Google Auth */}
                <div className="mt-6">
                  <GoogleAuthButton isRegister={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CodeSaga. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;