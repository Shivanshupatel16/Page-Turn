import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpenIcon,
  ArrowPathIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Toaster, toast } from "sonner";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cartItems] = useState(3);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileDropdown(false);
    navigate("/login");
    console.log("User logged out");
    toast.success("User logged out");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  

  const sidebarVariants = {
    open: {
      rotateY: 0,
      transformOrigin: "left center",
      opacity: 1,
      width: "16rem",
    },
    closed: {
      rotateY: -120,
      transformOrigin: "left center",
      opacity: 0.7,
      width: "4rem",
    },
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1] flex">
      <motion.nav
        className="fixed w-full bg-[#2C3E50] h-16 flex items-center px-6 z-50 shadow-lg"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center flex-1 gap-4">
          <div className="flex items-center gap-4">
            <button
              className="text-white md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <BookOpenIcon className="h-8 w-8 text-[#F1C40F]" />
              </motion.div>
              <span className="text-2xl font-bold text-[#F1C40F] font-poppins">
                Page<span className="text-[#27AE60]">Turn</span>
              </span>
            </motion.div>
          </div>
          <div className="hidden md:flex gap-24 ml-96">
            {[
              { label: "Marketplace", path: "/buyDashboard" },
              { label: "Sell", path: "/sell" },
              { label: "About", path: "/about" },
            ].map(({ label, path }) => (
              <motion.button
                key={label}
                onClick={() => navigate(path)}
                className="text-white/80 hover:text-[#F1C40F] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-6 justify-end w-full">
            <div className="relative">
              <motion.button
                className="flex items-center gap-2 group"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <UserCircleIcon className="h-8 w-8 text-[#F1C40F] transition-colors group-hover:text-[#27AE60]" />
                  <div className="absolute -bottom-1 -right-1">
                    <div className="h-3 w-3 rounded-full bg-green-400 border-2 border-[#2C3E50]" />
                  </div>
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-64 origin-top-right transform overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
                  >
                    <div className="p-4 bg-gradient-to-r from-[#F1C40F] to-[#27AE60]">
                      <div className="flex items-center gap-3">
                        <UserCircleIcon className="h-12 w-12 text-white" />
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-white/80">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#2C3E50]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">My Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.aside
        className="fixed top-16 h-[calc(100vh-4rem)] bg-[#2C3E50] z-40 shadow-xl"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="h-full flex flex-col p-4">
          <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-r from-[#27AE60]/30 to-transparent" />
          <div className="flex-1 overflow-hidden">
            {[
              { icon: ChartBarIcon, label: "Dashboard", path: "/buyDashboard" },
              { icon: BookOpenIcon, label: "My Books", path: "/mybooks" },
              { icon: EnvelopeIcon, label: "Messages", path: "/message" },
              { icon: UserCircleIcon, label: "Profile", path: "/profile" },
            ].map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path;

              return (
                <motion.button
                  key={label}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full ${
                    isActive
                      ? "bg-[#F1C40F] text-[#2C3E50]"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                  whileHover={{ x: 10 }}
                  onClick={() => {
                    navigate(path);
                  }}
                >
                  <Icon className="h-6 w-6 min-w-[1.5rem]" />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
          <motion.button
            className="mt-auto self-start relative"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            whileHover={{ scale: 1.1 }}
          >
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#F1C40F] rounded-r-lg shadow-lg" />
            <motion.div
              animate={{ rotate: isSidebarOpen ? 0 : 180 }}
              transition={{ type: "spring" }}
            >
              <BookOpenIcon className="h-6 w-6 text-[#2C3E50] relative z-10" />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>

      <main
        className={`pt-20 transition-all duration-300 ${
          isSidebarOpen
            ? "ml-64 w-[calc(100%-16rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
