import { useState, useEffect, useRef } from "react";
import { FaCheck, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { AcademicCapIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "sonner";

const OtpVerification = ({ setStep, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/password/verify-password", {
        email,
        verificationotp: otpValue,
      });
    
      // Axios automatically parses the response
      const data = response.data;
    
      setStep("reset");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Verification failed";
      setError(errorMessage);
    }finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimeLeft(60);
    setError("");

    try {
      const response = await axios.post("/api/password/forgot-password", { email });   
      const data = response.data;
      toast.success("OTP send successfully")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to resend code";
      setError(errorMessage);
      setCanResend(true);
    }
    
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-emerald-50 overflow-auto">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
          style={{ minHeight: "80vh", maxHeight: "90vh" }}
        >
          <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-400/20"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-300/20"
            />

            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <AcademicCapIcon className="h-10 w-10 text-white" />
                <h1 className="text-3xl font-bold text-white font-poppins">
                  PageTurn
                </h1>
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 15,
                  ease: "linear",
                }}
                className="mx-auto mb-6"
              >
                <ArrowPathIcon className="h-20 w-20 text-white/30" />
              </motion.div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                Secure Verification
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">
                We've sent a 6-digit code to your email
              </p>
              <p className="text-white font-medium mt-2">{email}</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <FaShieldAlt className="text-emerald-600 text-2xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Verify Your Identity
              </h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">
                Enter the code we sent to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Verification Code
                </label>
                <div className="flex space-x-3 justify-center">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      pattern="[0-9]"
                      inputMode="numeric"
                      whileHover={{ scale: 1.05 }}
                      whileFocus={{ scale: 1.05 }}
                    />
                  ))}
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-200 flex items-center disabled:opacity-70 shadow hover:shadow-md"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <FaCheck className="ml-2" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-sm font-medium ${
                    canResend
                      ? "text-emerald-600 hover:text-emerald-800 hover:underline"
                      : "text-slate-400"
                  }`}
                >
                  {canResend
                    ? "Resend Code"
                    : `Resend (0:${timeLeft < 10 ? "0" : ""}${timeLeft})`}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpVerification;
