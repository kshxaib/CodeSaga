import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { loginSchema } from "../../schema/LoginSchema";
import GoogleAuthButton from "./GoogleAuthButton";
import AuthImagePattern from "./AuthImagePattern";

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
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-base-content">
                Welcome Back
              </h1>
              <p className="text-base-content/70">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-base-100 p-8 rounded-xl shadow-sm border border-base-300"
          >
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/50" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-md input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-md input-bordered w-full pl-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-base-content/80"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/50" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/50" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">
                  {errors.password.message}
                </p>
              )}
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
            <div className="text-center mt-4">
            <p className="text-base-content/70">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary font-medium">
                Create account
              </Link>
            </p>
          </div>
          </form>

          {/* Or divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-base-300"></div>
            <p className="text-sm text-base-content/70">OR</p>
            <div className="flex-1 h-px bg-base-300"></div>
          </div>

          <div className="w-full flex justify-center">
            <GoogleAuthButton isRegister={false} />
          </div>

          {/* Footer */}
          
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your journey with us. Don't have an account? Create one now."
        }
      />
    </div>
  );
};

export default LoginPage;