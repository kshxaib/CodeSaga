import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { z } from "zod";

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

const VerifyCodePage = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { verifyOtp, changePassword } = useAuthStore();
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value.toUpperCase();
      setOtp(updatedOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6) {
      const verify = async () => {
        setLoading(true);
        setError("");
        const res = await verifyOtp({ code, email });
        setLoading(false);

        if (res?.data?.success) setOtpVerified(true);
        else setError("Invalid verification code");
      };
      verify();
    }
  }, [otp]);

  const submitNewPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      passwordSchema.parse(newPassword);

      setLoading(true);
      setError("");

      const res = await changePassword({ email, newPassword, confirmPassword });

      if (res?.data?.success) {
        navigate("/login");
      } else {
        setError(res?.data?.message || "Password reset failed");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred. Please try again.");
      }
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
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Account</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Recovery
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-3xl">
              {!otpVerified 
                ? "Enter the verification code sent to your email"
                : "Create a new secure password for your account"}
            </p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-900/50">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/50 py-8 px-6 sm:px-10 rounded-xl border border-gray-700 shadow-lg">
              {!otpVerified ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-1">Verify Your Email</h2>
                    <p className="text-gray-400 text-sm">
                      We've sent a 6-digit code to <span className="font-medium text-blue-400">{decodeURIComponent(email)}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-12 h-14 text-center border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-semibold uppercase"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  {loading && (
                    <div className="flex justify-center items-center text-blue-400 mt-4">
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      <span>Verifying code...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Set New Password</h2>
                    <p className="text-sm text-gray-400 mt-1">Create a new secure password</p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Password Requirements</h3>
                    <ul className="text-xs text-gray-400 space-y-1.5">
                      <li>• At least 8 characters</li>
                      <li>• At least one uppercase letter</li>
                      <li>• At least one number</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={submitNewPassword}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;