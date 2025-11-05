import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon, BookOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner"; 

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.book || !state?.payment) {
    toast.error("Unable to verify the order. Redirecting to your dashboard.");

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <CheckCircleIcon className="h-20 w-20 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Order Verification Needed</h2>
          <p className="text-gray-600 mb-6">
            Please check your email for order confirmation or visit your purchase history.
          </p>
          <button
            onClick={() => navigate('/buyDashboard')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            View Purchase History
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >

          <div className="text-center mb-8">
            <CheckCircleIcon className="h-20 w-20 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Processed Successfully
            </h1>
            <p className="text-gray-600">
              Your order confirmation has been sent to your registered email
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-4">
                <img
                  src={state.book.image}
                  alt={state.book.title}
                  className="w-24 h-32 object-cover rounded-md shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{state.book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{state.book.author}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    <span>{state.book.condition} Condition</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-emerald-600 font-semibold">
                      ₹{state.book.price/83}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Transaction Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Transaction ID:</dt>
                  <dd className="font-mono text-sm text-emerald-600">
                  {(state.payment?.id || '').slice(0, 8)}...{(state.payment?.id || '').slice(-4)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date:</dt>
                  <dd className="text-gray-700">{state.payment.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Payment Method:</dt>
                  <dd className="text-gray-700">{state.payment.method}</dd>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <dt className="text-gray-600 font-semibold">Total Paid:</dt>
                  <dd className="text-emerald-600 font-semibold">
                    ₹{state.book.price/83}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Section */}
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate('/buyDashboard')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;