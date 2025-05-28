import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "sonner";

const StorePage = () => {
  const {
    unpurchasedPlaylists,
    getUnpurchasedPaidPlaylists,
    initiatePlaylistPurchase,
    verifyPlaylistPurchase,
  } = usePlaylistStore();
  const { authUser } = useAuthStore();
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsStoreLoading(true);
      await getUnpurchasedPaidPlaylists();
      setIsStoreLoading(false);
    };

    fetchData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePurchaseClick = async (playlistId) => {
    try {
      setIsProcessingPayment(true);

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Payment system failed to load. Please try again.");
        return;
      }

      const response = await initiatePlaylistPurchase(playlistId);

      if (!response.success) {
        toast.error(response.message || "Failed to initiate payment");
        return;
      }

      const { order, key } = response;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Coding Playlists",
        description: `Purchase: ${order.receipt}`,
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await verifyPlaylistPurchase({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              playlistId: playlistId,
            });

            if (verificationResponse.success) {
              toast.success(verificationResponse.message);
              await getUnpurchasedPaidPlaylists();
            } else {
              toast.error(verificationResponse.message || "Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: authUser?.name || "",
          email: authUser?.email || "",
          contact: "",
        },
        notes: {
          playlistId: playlistId,
          userId: authUser?.id,
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
      setIsProcessingPayment(false);
    }
  };

  if (isStoreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Premium Playlists Store
          </h1>
          <p className="text-gray-400 mt-2">
            Upgrade your skills with our premium problem collections
          </p>
          <p className="text-gray-400 mt-2">
            Available Playlists:{" "}
            <span className="font-semibold text-blue-400">
              {unpurchasedPlaylists.length}
            </span>
          </p>
        </div>

        {unpurchasedPlaylists.length > 0 ? (
          <>
            <div className="grid gap-6">
              {unpurchasedPlaylists.map((playlist) => {
                const totalProblems = playlist.problems?.length || 0;
                const purchaseCount = playlist.purchases?.length || 0;

                return (
                  <div
                    key={playlist.id}
                    className="bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-100">
                              {playlist.name}
                            </h2>
                            <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                              <Lock className="w-3 h-3" /> PREMIUM
                            </span>
                          </div>

                          <p className="text-gray-300 mt-2">
                            {playlist.description || "No description provided."}
                          </p>
                          <div className="text-gray-400 text-sm italic">
                            Includes years when the questions were asked in real
                            interviews
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-blue-400">
                                {totalProblems}
                              </span>
                              <span>problems included</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-purple-400">
                                {purchaseCount} purchases
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-purple-400">
                                Last updated:{" "}
                                {moment(playlist.updatedAt).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Price</p>
                            <p className="text-2xl font-bold text-yellow-400 flex items-center justify-end gap-1">
                              <DollarSign className="w-5 h-5 hidden" />
                              <span className="text-sm text-gray-300">₹</span>
                              {Number(playlist.price).toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 italic">
                              Just for you 🇮🇳
                            </p>
                          </div>

                          <button
                            onClick={() => handlePurchaseClick(playlist.id)}
                            disabled={isProcessingPayment}
                            className={`btn bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white w-full ${
                              isProcessingPayment ? "opacity-75" : ""
                            }`}
                          >
                            {isProcessingPayment ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Purchase Now"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center text-gray-400">
              <p className="text-lg">More premium playlists coming soon!</p>
              <p className="mt-2">
                We're constantly adding new content to help you master coding
                concepts.
              </p>
              <p className="mt-2">Check back regularly for updates.</p>
            </div>
          </>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-700 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">
                No premium playlists available
              </h3>
              <p className="text-gray-400 mb-6">
                {authUser
                  ? "You've purchased all available premium playlists!"
                  : "Please login to view available premium playlists"}
              </p>
              {!authUser && (
                <Link
                  to="/login"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Login to View Store
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;