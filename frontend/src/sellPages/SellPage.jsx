import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import {
  BookOpenIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { toast, Toaster } from "sonner";

const SellPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    price: "",
    condition: "Like New",
    category: "Textbook",
    description: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fields = [
    { label: "Book Title", name: "title", icon: BookOpenIcon },
    { label: "Author", name: "author", icon: ShieldCheckIcon },
    { label: "ISBN", name: "isbn", icon: AcademicCapIcon },
    {
      label: "Category",
      name: "category",
      icon: AcademicCapIcon,
      options: ["Fiction", "Non-Fiction", "Textbook", "Children", "Other"],
    },
    {
      label: "Condition",
      name: "condition",
      icon: ShieldCheckIcon,
      options: ["New", "Like New", "Very Good", "Good", "Acceptable"],
    },
    {
      label: "Price (₹)",
      name: "price",
      icon: CurrencyDollarIcon,
      type: "number",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files).slice(0, 5),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") formDataToSend.append(key, value);
      });
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/books/sellBooks",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          title: "",
          author: "",
          isbn: "",
          price: "",
          condition: "",
          category: "",
          description: "",
          images: [],
        });
        toast.success("Book listed successfully! Waiting for admin approval.")
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to list book";
        toast.error("Failed to list book")

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#f0fdf4] to-[#fefce8] min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8 flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <BookOpenIcon className="h-12 w-12 text-green-600" />
            <div className="absolute inset-0 bg-yellow-400/10 blur-md" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-400 bg-clip-text text-transparent">
            List Your Textbook
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-green-50 text-green-600 rounded-xl"
            >
              ✅ Book listed successfully! Waiting for admin approval.
            </motion.div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label className="block text-green-800 font-medium mb-2">
                  {field.label}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <field.icon className="h-5 w-5 text-green-600 absolute left-3 top-3.5" />
                  {field.options ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 rounded-xl border-2 border-green-100 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                      required
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 rounded-xl border-2 border-green-100 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                      required
                      min={field.type === "number" ? 0 : undefined}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-green-800 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-xl border-2 border-green-100 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.005 }} className="space-y-4">
            <label className="block text-green-800 font-medium">
              Upload Photos <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-green-200 bg-white rounded-xl p-8 text-center transition-colors hover:border-yellow-400">
              <PhotoIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-green-600 mb-2 font-medium">
                Drag & drop book photos here
              </p>
              <motion.label
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-400 text-green-900 px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer hover:bg-yellow-500 transition-colors"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span className="font-semibold">
                  {formData.images.length > 0
                    ? `${formData.images.length} files selected`
                    : "Select Files"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                />
              </motion.label>
              <p className="text-green-500 text-sm mt-4">
                Max 5 photos (PNG, JPG, WEBP)
              </p>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-green-400" : "bg-green-600"
            } text-white p-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-70`}
          >
            {isSubmitting ? "Listing..." : "List Textbook for Sale"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SellPage;
