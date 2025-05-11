import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
        {!otpVerified ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Verify Your Email</h2>
              <p className="text-gray-600 text-sm">
                We’ve sent a 6-digit code to <span className="font-medium">{decodeURIComponent(email)}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="text"
                  maxLength="1"
                  aria-label={`Digit ${index + 1}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg sm:text-xl font-semibold uppercase"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {loading && (
              <div className="flex justify-center items-center text-blue-600 mt-4">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                <span>Verifying code...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
              <p className="text-sm text-gray-500 mt-1">Enter a new password for your account</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• At least 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one number</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              onClick={submitNewPassword}
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white transition-colors ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
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
  );
};

export default VerifyCodePage;
