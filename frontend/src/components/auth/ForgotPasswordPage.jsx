import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "./AuthImagePattern";
import { forgotPasswordSchema } from "../../schema/forgotPasswordSchema";
import { useAuthStore } from "../../store/useAuthStore";

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
    setLoading(true);
    await forgotPassword(data);
    setLoading(false);
    navigate(`/verify-otp/${encodeURIComponent(data.email)}`);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Forgot Password</h1>
            <p className="text-base-content/70 mt-2">
              Enter your email address to receive a verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="link link-primary text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Image/Pattern */}
      <AuthImagePattern
        title="Forgot your password?"
        subtitle="No worries, enter your email and we’ll send you a code."
      />
    </div>
  );
};

export default ForgotPasswordPage;
