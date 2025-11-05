import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartItems] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileDropdown(false);
    navigate("/login");
    console.log("User logged out");
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

  return (
    <motion.nav
      className="fixed w-full bg-[#2C3E50] h-16 flex items-center px-6 z-50 shadow-lg"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <button
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
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

        <div className="hidden md:flex gap-24 mr-20">
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

        <div className="flex items-center gap-6">
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
                      onClick={handleLogout}
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-[#2C3E50] shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {["Marketplace", "Sell", "Community"].map((item) => (
                <motion.button
                  key={item}
                  className="text-white/80 hover:text-[#F1C40F] p-3 text-left"
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate(`/${item.toLowerCase()}`);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
