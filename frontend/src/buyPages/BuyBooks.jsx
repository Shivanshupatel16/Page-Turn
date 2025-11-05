import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Navbar from "@/pages/Navbar";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { FaBuilding, FaTruck, FaCreditCard } from "react-icons/fa";
import { toast, Toaster } from "sonner";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary:", error, info);
  }

  render() {
    return this.state.hasError ? (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500 p-8">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Payment Failed</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    ) : (
      this.props.children
    );
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, book: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "PAYMENT_START":
      return {
        ...state,
        processingPayment: true,
        paymentStatus: "pending",
        error: null,
      };
    case "PAYMENT_SUCCESS":
      return { ...state, processingPayment: false, paymentStatus: "success" };
    case "PAYMENT_FAIL":
      return {
        ...state,
        processingPayment: false,
        paymentStatus: "error",
        error: action.payload,
      };
    case "PAYMENT_CANCEL":
      return { ...state, processingPayment: false, paymentStatus: "cancelled" };
    default:
      return state;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const UPLOADS_BASE =
  import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000";

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const BookDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(stateReducer, {
    book: null,
    loading: true,
    error: null,
    processingPayment: false,
    paymentStatus: "idle",
  });

  const [isBuyDisabled, setIsBuyDisabled] = useState(false);
  const rzpInstance = useRef(null);

  useEffect(() => {
    const fetchBook = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await axios.get(`${API_BASE}/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.book });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err.response?.data?.error || "Failed to load book data",
        });
      }
    };
    if (id) fetchBook();
  }, [id]);

  const loadRazorpaySDK = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const initializeRazorpay = async (orderData) => {
    try {
      if (!window.Razorpay) await loadRazorpaySDK();

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "PageTurn Book Store",
        description: `Purchase of "${state.book?.title}"`,
        order_id: orderData.id,
        handler: verifyPayment,
        theme: { color: "#10B981" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (err) => {
        dispatch({ type: "PAYMENT_FAIL", payload: err.error.reason });
        toast.error("Payment failed");
      });
      razorpay.open();
    } catch (err) {
      toast.error("Error initializing Razorpay");
    }
  };

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    const sellerId = state.book?.user;

    if (userId === sellerId) {
      toast.error("A seller cannot buy their own book");
      setIsBuyDisabled(true);
      return;
    }

    try {
      dispatch({ type: "PAYMENT_START" });
      const token = localStorage.getItem("token");
      const amount = Math.round(Number(state.book.price) * 100);

      const { data } = await axios.post(
        `${API_BASE}/payments/create-order`,
        { bookId: state.book._id, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      initializeRazorpay(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
      dispatch({ type: "PAYMENT_FAIL", payload: err.message });
    }
  };

  const verifyPayment = async (response) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        response;
      const token = localStorage.getItem("token");

      const verification = await axios.post(
        `${API_BASE}/payments/verify`,
        {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          bookId: state.book._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verification.data.success) {
        toast.success("Payment Successful!");
        dispatch({ type: "PAYMENT_SUCCESS" });

        navigate("/paymentSuccess", {
          state: {
            book: {
              title: state.book?.title,
              author: state.book?.author,
              price: state.book?.price,
              image: `${UPLOADS_BASE}/uploads${state.book?.images?.[0]?.replace(
                /^\/uploads/,
                ""
              )}`, //add here
              condition: state.book?.condition,
            },
            payment: {
              id: verification.data.paymentId,
              date: new Date().toLocaleString(),
              method: "UPI/Card",
            },
          },
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err) {
      toast.error("Verification failed");
      dispatch({ type: "PAYMENT_FAIL", payload: err.message });
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100">
        <p>Loading book details...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        <p>{state.error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center text-gray-600 hover:text-emerald-600 mt-10"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Results
          </button>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col-reverse lg:block">
              <div className="grid grid-cols-4 gap-4 mt-4 lg:mt-0 ml-20">
                {state.book?.images?.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`border-2 rounded-lg cursor-pointer ${
                      selectedImage === index
                        ? "border-emerald-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_UPLOADS_BASE_URL
                      }/uploads/${img.replace(/^\/uploads\//, "")}`}
                      className="h-24 w-full object-cover rounded-lg"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div
                key={selectedImage}
                initial="hidden"
                animate="visible"
                variants={imageVariants}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-xl shadow-lg mt-6 lg:mt-0 mx-auto max-w-md"
              >
                <div className="w-[400px] h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={`${
                      import.meta.env.VITE_UPLOADS_BASE_URL
                    }/uploads${state.book?.images?.[selectedImage]?.replace(
                      /^\/uploads/,
                      ""
                    )}`}
                    className="w-full h-full object-contain rounded-lg"
                    alt={state.book?.title}
                  />
                </div>
              </motion.div>
            </div>
            <div className="w-full ">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {state.book?.title}
                </h1>
                <div className="flex items-center mb-3">
                  <p className="text-3xl font-bold text-emerald-600 ">
                    ₹{(state.book?.price).toLocaleString("en-IN")}
                  </p>
                  <span className="ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    20% off
                  </span>
                </div>
                <div className="mt-2 mb-2 flex items-center space-x-2 text-gray-500">
                  <FaTruck className="h-5 w-5" />
                  <span>Free delivery on orders over ₹500</span>
                </div>
              </div>

              <div className="mt-8 border-t border-b border-gray-200 py-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaBuilding className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Sold by PageTurn Books
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        98% Positive Seller Ratings
                      </span>
                      <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-500">Author</h3>
                  <p className="text-lg">{state.book?.author}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm  text-gray-500 font-bold">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-md">
                    {state.book?.description || "No description available"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-500">Condition</h3>
                  <p className="text-gray-600 leading-relaxed text-md">
                    {state.book?.condition || "No description available"}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="space-y-4">
                  <button
                    onClick={() => handlePayment("upi")}
                    disabled={isBuyDisabled}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Pay with UPI Apps
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2">
                    Add to Wishlist
                  </button>
                </div>

                {state.paymentStatus === "error" && (
                  <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
                    {state.error}
                  </div>
                )}
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-80 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaCreditCard className="h-5 w-5 text-gray-400" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BookDetails;
