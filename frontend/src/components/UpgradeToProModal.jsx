import React, { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Zap, X } from "lucide-react";
import { motion } from "framer-motion";
import {axiosInstance} from "../libs/axios";

const UpgradeToProModal = ({ onClose }) => {
  const { user, getUserDetails } = useUserStore();
  const { authUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true);
      
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Payment system failed to load. Please try again.");
        return;
      }

      const response = await axiosInstance.post("/users/initiate-pro-upgrade");
      
      if (!response.data.success) {
        toast.error(response.data.message || "Failed to initiate payment");
        return;
      }

      const { order, key } = response.data;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "PRO Upgrade",
        description: "Unlock AI features and more",
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await axiosInstance.post("/users/verify-pro-upgrade", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.data.success) {
              toast.success("PRO upgrade successful!");
              await getUserDetails();
              onClose();
            } else {
              toast.error(verificationResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: authUser?.name || "",
          email: authUser?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-xl border border-purple-500/30 w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Upgrade to PRO
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-500/10 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">PRO Features</h3>
              </div>
              
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>AI Code Autocomplete</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Advanced Debugging Tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Exclusive Content</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-400">
                    ₹299 <span className="text-sm text-gray-400">/ lifetime</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isProcessing || user?.role?.includes("PRO")}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                user?.role?.includes("PRO")
                  ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
              ) : user?.role?.includes("PRO") ? (
                "Already PRO"
              ) : (
                "Upgrade Now"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeToProModal;