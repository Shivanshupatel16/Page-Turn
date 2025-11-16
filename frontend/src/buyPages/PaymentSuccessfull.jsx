import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useState } from "react";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedImage] = useState(0);

  const imgPath =
    state?.book?.images?.[selectedImage] ||
    state?.book?.image ||
    null;

  if (!state?.book || !state?.payment) {
    toast.error("Unable to verify the order. Redirecting to your dashboard.");

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <CheckCircleIcon className="h-20 w-20 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">
            Order Verification Needed
          </h2>
          <p className="text-gray-600 mb-6">
            Please check your email or visit Purchase History.
          </p>
          <button
            onClick={() => navigate("/buyDashboard")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-14 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl p-10"
      >
        <div className="text-center mb-12">
          <CheckCircleIcon className="h-20 w-20 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Processed Successfully
          </h1>
          <p className="text-gray-600 mt-2">
            Your order confirmation has been sent to your registered email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl border">
            <div className="flex gap-5">
              <img
                src={
                  imgPath
                    ? /^https?:\/\//.test(imgPath)
                      ? imgPath
                      : `${import.meta.env.VITE_UPLOADS_BASE_URL}/uploads${imgPath.replace(/^\/uploads/, "")}`
                    : "/placeholder-book.jpg"
                }
                className="w-40 h-38 object-cover rounded-lg border bg-white"
                alt={state.book?.title}
              />

              <div className="flex-1 mx-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {state.book.title}
                </h3>
                <p className="text-gray-600 mt-1">{state.book.author}</p>

                <div className="flex items-center mt-3 text-gray-500 text-sm">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  <span>{state.book.condition} Condition</span>
                </div>

                <p className="text-emerald-600 font-semibold text-lg mt-3">
                  ₹{state.book.price}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Transaction Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-emerald-600">
                  {(state.payment?.id || "").slice(0, 6)}...
                  {(state.payment?.id || "").slice(-4)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{state.payment.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span>{state.payment.method}</span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-semibold">Total Paid:</span>
                <span className="text-emerald-600 font-semibold">
                  ₹{state.book.price}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <button
            onClick={() => navigate("/buyDashboard")}
            className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
