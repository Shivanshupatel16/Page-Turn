import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser, setError } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LockClosedIcon,
  UserPlusIcon,
  AcademicCapIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Toaster,toast } from "sonner";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 md:grid-cols-2">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-6 z-10"
        >
          <div className="flex items-center justify-center gap-3">
            <AcademicCapIcon className="h-12 w-12 text-emerald-400" />
            <h1 className="text-4xl font-bold text-emerald-400 font-poppins">
              PageTurn
            </h1>
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="mx-auto"
          >
            <ArrowPathIcon className="h-24 w-24 text-slate-600/30" />
          </motion.div>

          <p className="text-slate-400 text-lg max-w-xs mx-auto">
            Sustainable Academic Exchange Platform
          </p>
        </motion.div>
      </div>

      <div className="bg-white flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-6">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/50"
                }`}
              >
                {tab === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <LoginForm setActiveTab={setActiveTab} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SignupForm setActiveTab={setActiveTab} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token !== null) {
        try {
          const response = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            navigate("/buyDashboard");
            
          }
        } catch (error) {
          console.error("Auth check failed:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Authentication failed");
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(setError("Please fill in all fields"));
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (result.user?.role == "admin") {
        navigate("/approvalPage");
        toast.success("Admin logged in successfully")
      } else {
        navigate("/buyDashboard");
        toast.success("User logged in successfully")
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-emerald-100 rounded-full">
          <LockClosedIcon className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Welcome Back</h2>
        <p className="text-slate-600">Sign in to continue</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white p-3 rounded-lg flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
        <div className="space-y-2 pt-4">
          <div className="text-center">
            <button
              onClick={() => setActiveTab("signup")}
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              New to this website? Create Account
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/forgot-password")} // Add your forgot password route here
              className="text-sm text-slate-600 hover:text-slate-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

const SignupForm = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      dispatch(setError("Please fill in all fields"));
      return;
    }
    try {
      await dispatch(signupUser({ name, email, password })).unwrap();
      setActiveTab("login");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-emerald-100 rounded-full">
          <UserPlusIcon className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Join PageTurn</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSignup}>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300"
          required
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white p-3 rounded-lg flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
        <div className="pt-4 text-center">
          <button
            onClick={() => setActiveTab("login")}
            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Already a user? Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
