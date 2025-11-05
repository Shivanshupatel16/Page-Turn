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
    case "TOGGLE_TEST_MODE":
      return { ...state, isTestMode: !state.isTestMode };
    default:
      return state;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
console.log("Loaded Razorpay Key:", RAZORPAY_KEY);
if (!RAZORPAY_KEY) {
  toast.error("Razorpay key is missing. Check environment setup.");
}
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

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
    qrData: "",
    paymentStatus: "idle",
    isTestMode: true,
  });

  const [isBuyDisabled, setIsBuyDisabled] = useState(false);
  const rzpInstance = useRef(null);
  const paymentPollInterval = useRef(null);

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return "/placeholder-book.jpg";
    return `${API_BASE}${images[0]}`;
  };

  const validateBookData = (book) => {
    if (!book) return false;
    return (
      typeof book === "object" &&
      typeof book.title === "string" &&
      typeof book.author === "string" &&
      typeof book.price === "number" &&
      !isNaN(book.price)
    );
  };

  useEffect(() => {
    const fetchBook = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        if (!id || id === "undefined") {
          dispatch({ type: "FETCH_ERROR", payload: "Invalid book ID" });
          return;
        }

        const response = await axios.get(`/api/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!validateBookData(response.data?.book)) {
          throw new Error("Invalid book data structure from API");
        }

        dispatch({ type: "FETCH_SUCCESS", payload: response.data.book });
      } catch (err) {
        const errorMessage =
          err.response?.status === 404
            ? "Book not found"
            : err.response?.data?.error || "Failed to load book data";
        dispatch({ type: "FETCH_ERROR", payload: errorMessage });
      }
    };

    if (id && typeof id === "string" && id.length === 24) {
      fetchBook();
    } else {
      dispatch({ type: "FETCH_ERROR", payload: "Invalid book ID format" });
    }
  }, [id]);

  const getUserIdFromLocalStorage = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      return user ? user._id : null;
    } catch (error) {
      console.error("Invalid user data in localStorage");
      return null;
    }
  };

  const initializeRazorpay = async (orderData) => {
    try {
      if (!window.Razorpay) {
        await loadRazorpaySDK();
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "PageTurn Book Store",
        description: `Purchase of "${state.book?.title}"`,
        order_id: orderData.id,
        handler: function (response) {
          verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        theme: { color: "#10B981" },
        modal: {
          ondismiss: () => dispatch({ type: "PAYMENT_CANCEL" }),
        },
      };

      rzpInstance.current = new window.Razorpay(options);
      rzpInstance.current.on("payment.failed", handlePaymentError);
      rzpInstance.current.open();
    } catch (error) {
      dispatch({ type: "PAYMENT_FAIL", payload: error.message });
      toast.error(error.message || "Something went wrong");
    }
  };

  const startPaymentPolling = (orderId) => {
    let retries = 20;
    paymentPollInterval.current = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/payments/status/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.status === "paid") {
          clearInterval(paymentPollInterval.current);
          await verifyPayment({
            razorpay_order_id: orderId,
            razorpay_payment_id: data.payment_id,
          });
        } else if (retries-- <= 0) {
          throw new Error("Payment timeout");
        }
      } catch (error) {
        clearInterval(paymentPollInterval.current);
        dispatch({ type: "PAYMENT_FAIL", payload: error.message });
        toast.error(error.message || "Something went wrong");
      }
    }, 3000);
  };

  const loadRazorpaySDK = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = (err) =>
        reject(new Error("Razorpay SDK failed to load"));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async (method) => {
    const userId = getUserIdFromLocalStorage();
    const sellerId = state.book?.user;

    if (userId === sellerId) {
      toast.error("A seller cannot buy their own book");
      setIsBuyDisabled(true);
      return;
    }

    try {
      dispatch({ type: "PAYMENT_START" });
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to complete payment");
        navigate("/login");
        return;
      }

      const amount = Math.round(Number(state.book.price) * 100);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid book price format");
      }

      const { data } = await axios.post(
        `${API_BASE}/api/payments/create-order`,
        {
          bookId: state.book._id,
          method: "upi",
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (method === "upi") {
        const responseData = data;
        console.log("Full API Response:", responseData);

        if (!responseData.data?.upi_link) {
          throw new Error(
            `UPI link missing in: ${JSON.stringify(responseData)}`
          );
        }
        initializeRazorpay({
          id: responseData.data.id,
          amount: responseData.data.amount,
          currency: responseData.data.currency,
        });

        // window.location.href = responseData.data.upi_link;
        // startPaymentPolling(responseData.data.id);
      }
    } catch (error) {
      console.error("Payment Error:", {
        message: error.message,
        response: error.response?.data,
        code: error.code,
      });

      let errorMessage = "Payment failed. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid request data";
            break;
          case 401:
            localStorage.removeItem("token");
            navigate("/login");
            return;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
        }
      }

      dispatch({
        type: "PAYMENT_FAIL",
        payload: errorMessage,
      });
    }
  };

  const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_BASE_URL || "/uploads";
  const verifyPayment = async (response) => {
    try {
      const paymentData = {
        razorpay_payment_id:
          response.razorpay_payment_id || response?.paymentId,
        razorpay_order_id: response.razorpay_order_id || response?.orderId,
        razorpay_signature: response.razorpay_signature || response?.signature,
        bookId: state.book?._id,
      };

      // Validate required fields
      if (
        !paymentData.razorpay_payment_id ||
        !paymentData.razorpay_order_id ||
        !paymentData.razorpay_signature ||
        !paymentData.bookId
      ) {
        throw new Error(
          `Missing payment verification parameters: ${JSON.stringify(
            paymentData
          )}`
        );
      }

      const verificationResponse = await axios.post(
        `${API_BASE}/api/payments/verify`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (!verificationResponse.data?.success) {
        throw new Error(
          verificationResponse.data?.message ||
            "Verification failed with unknown error"
        );
      }

      dispatch({ type: "PAYMENT_SUCCESS" });
      toast.success("Payment successfull");
      navigate("/paymentSuccess", {
        state: {
          book: {
            title: state.book?.title,
            author: state.book?.author,
            price: (state.book?.price * 83).toFixed(2),
            image: `${UPLOADS_BASE}${state.book?.images?.[0]?.replace(
              /^\/uploads/,
              ""
            )}`,
            condition: state.book?.condition,
          },
          payment: {
            id: verificationResponse.data.book.paymentId,
            date: new Date().toLocaleString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            method: "UPI/Card",
          },
        },
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Verification Failed:", {
        error: error.response?.data || error.message,
        config: error.config,
        request: error.request,
      });

      dispatch({
        type: "PAYMENT_FAIL",
        payload: error.response?.data?.error || error.message,
      });
    }
  };
  const handlePaymentError = (error) => {
    clearInterval(paymentPollInterval.current);
    dispatch({
      type: "PAYMENT_FAIL",
      payload: error.error.reason || "Payment failed",
    });
    toast.error("Payment failed");
    navigate("/buyDashboard");
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-800 rounded w-64"></div>
          <div className="h-4 bg-gray-800 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-red-400 p-8">
        <p className="text-xl mb-4">{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
        >
          Try Again
        </button>
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
                      src={`${UPLOADS_BASE}${img.replace(/^\/uploads/, "")}`}
                      className="h-24 w-full object-cover rounded-lg "
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
                    src={`${UPLOADS_BASE}${state.book?.images?.[
                      selectedImage
                    ]?.replace(/^\/uploads/, "")}`}
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
