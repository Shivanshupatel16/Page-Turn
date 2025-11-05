import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  PencilSquareIcon,
  BookOpenIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Navbar from "./Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    password: "",
  });

  const navigate = useNavigate();

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`/api/updateProfile/${user._id}`,formData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUser = response.data.data;
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      toast.success("Profile updated successfully")

      setEditMode(false);
      setError(null);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
    
      const response = await axios.put(`/api/updateProfile/${user._id}`,
        {
          oldPassword: passwordData.oldPassword,
          password: passwordData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Password updated:", response.data);
      setPasswordData({ oldPassword: "", password: "" });
      setError(null);
      toast.success("Password updated successfully!");
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="text-emerald-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
          {/* Left Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 relative overflow-hidden mt-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-8 sticky top-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="flex justify-center"
              >
                <ArrowPathIcon className="h-24 w-24 text-slate-600/30" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-700/30 p-6 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <UserCircleIcon className="h-16 w-16 text-emerald-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.name}
                    </h2>
                    <p className="text-emerald-400 text-sm mt-1">
                      {user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "Unknown"}{" "}
                      Member
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                  {user.email}
                </p>
              </motion.div>

              <div className="relative h-48">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute"
                    style={{
                      left: `${i * 25}%`,
                      rotate: i % 2 ? -15 : 15,
                    }}
                  >
                    <BookOpenIcon
                      className={`h-12 w-12 ${
                        i % 2 ? "text-emerald-400/30" : "text-slate-600/30"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 mt-12">
            <div className="max-w-2xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <h1 className="text-3xl font-bold text-slate-800">
                  Account Settings
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit Profile
                </motion.button>
              </motion.div>

              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                {["profile", "security"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab === "profile" ? "Profile" : "Security"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "profile" ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <label className="text-sm text-slate-600">
                          Email Address
                        </label>
                        <p className="text-slate-800 font-medium">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <label className="text-sm text-slate-600">
                          Member Since
                        </label>
                        <p className="text-slate-800 font-medium">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <label className="text-sm text-slate-600">
                          Account Role
                        </label>
                        <p className="text-slate-800 font-medium capitalize">
                          {user.role}
                        </p>
                      </div>
                      <div className="text-center space-y-4">
                        <button
                          onClick={() => navigate("/buyDashboard")}
                          className="text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2"
                        >
                          <ArrowLeftIcon className="w-5 h-5" />
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                      <div>
                        <label className="block text-sm text-slate-600 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 rounded-lg border border-slate-300"
                          value={passwordData.oldPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              oldPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 rounded-lg border border-slate-300"
                          value={passwordData.password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <button className="w-full bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors">
                        Update Password
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                <form className="space-y-4" onSubmit={handleUpdateProfile}>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Full Name
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setError(null);
                      }}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProfilePage;
