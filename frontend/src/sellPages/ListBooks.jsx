import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
  BanknotesIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const EditBookForm = ({ book, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    price: book.price,
    isbn: book.isbn || "",
    condition: book.condition,
    description: book.description || "",
    category: book.category,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `/api/books/updateBook/${book.id}`,
        formData
      );
      onUpdate(response.data.update);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Book Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author*</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price ($)*
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Condition*</label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Textbook">Textbook</option>
              <option value="Children">Children</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows="3"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full relative"
      >
        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this book? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MyListingsBooks = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const getStatus = (filter, book) => {
    if (filter === "Sold") return "Sold";
    if (filter === "Bought") return "Bought";
    if (book.approved) return "Available";
    if (book.rejected) return "Rejected";
    return "Pending";
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        let response;
        let data = [];

        switch (selectedFilter) {
          case "Available":
            response = await axios.get(
              "/api/books/approvedBooks",
              config
            );
            data = response.data.books || [];
            break;
          case "Pending":
            response = await axios.get(
              "/api/books/pendingBook",
              config
            );
            data = response.data.books || [];
            break;
          case "Rejected":
            response = await axios.get(
              "/api/books/rejectedBooks",
              config
            );
            data = response.data.books || [];  
            break;
          case "Sold":
            response = await axios.get(
              "/api/books/sold/user",
              config
            );
            data = response.data.soldBooks || [];
            break;
          case "Bought":
            response = await axios.get(
              "/api/books/buy/user",
              config
            );
            data = response.data.boughtBooks || [];
            break;
          default: // All
            response = await axios.get(
              "/api/books/userBooks",
              config
            );
            data = response.data.allBooks || []; 
        }

        console.log("Clean API Data:", data);

        const booksData = data.map((book) => ({
          id: book._id || book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          isbn: book.isbn,
          condition: book.condition,
          description: book.description,
          category: book.category,
          status: book.rejected ? "Rejected" : 
                 book.approved ? "Available" : 
                 book.status || "Pending",
          image: book.images?.[0] || null,
          createdAt: book.createdAt,
        }));

        setListings(booksData);
        calculateEarnings(booksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message || "Failed to load listings.");
        setListings([]);
        setTotalEarnings(0);
      } finally {
        setIsLoading(false);
      }
    };

    const calculateEarnings = (books) => {
      const earnings = books
        .filter((book) => book.status === "Sold")
        .reduce((sum, book) => sum + (book.price || 0), 0);
      setTotalEarnings(earnings);
    };

    fetchListings();
  }, [selectedFilter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/books/deleteBook/${id}`);
      setListings((prev) => prev.filter((book) => book.id !== id));
      calculateEarnings(listings.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleUpdateBook = (updatedBook) => {
    setListings((prev) =>
      prev.map((book) =>
        book.id === updatedBook._id ? { ...book, ...updatedBook } : book
      )
    );
    calculateEarnings(
      listings.map((book) =>
        book.id === updatedBook._id ? { ...book, ...updatedBook } : book
      )
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-rose-100 text-rose-600 p-4 rounded-lg inline-block mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-800 font-medium mb-2">Error Loading Data</p>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const FILTER_OPTIONS = [
    { value: "All", label: "All", icon: BookOpenIcon }, 
    { value: "Available", label: "Approved", icon: CheckBadgeIcon },
    { value: "Pending", label: "Pending", icon: ClockIcon },
    { value: "Rejected", label: "Rejected", icon: XMarkIcon },
    { value: "Sold", label: "Sold", icon: BanknotesIcon },
    { value: "Bought", label: "Bought", icon: ShoppingCartIcon },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">My Listings</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200"
        >
          <div className="flex gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Earnings</p>
                <p className="text-2xl font-semibold text-slate-800">
                ₹{totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckBadgeIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-600">Active Listings</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {listings.length} {listings.length === 1 ? "Book" : "Books"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-4 mb-6">
          {FILTER_OPTIONS.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <motion.button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filter.value === selectedFilter
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                {filter.label}
              </motion.button>
            );
          })}
        </div>
        {console.log("Filtered listings:", listings)}
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <BookOpenIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No {selectedFilter === "All" ? "" : selectedFilter} Books Found
            </h3>
            <p className="text-slate-600 mb-4">
              {selectedFilter === "All"
                ? "You haven't listed any books yet."
                : `You don't have any ${selectedFilter.toLowerCase()} books.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              console.log("Rendering listing:", listing);
              return (
                <motion.div
                  key={listing._id || listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="relative">
                    <div className="h-48 bg-slate-100 flex items-center justify-center">
                      {listing.image ? (
                        <img
                          src={`http://localhost:5000${listing.image}`}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image load error:", e.target.src); 
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <BookOpenIcon className="h-16 w-16 text-slate-300" />
                      )}
                    </div>

                    <span
                      className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm ${
                        listing.status === "Approved"
                          ? "bg-emerald-100 text-emerald-600"
                          : listing.status === "Pending"
                          ? "bg-amber-100 text-amber-600"
                          : listing.status === "Rejected"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">
                      by {listing.author}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
                        <span className="text-xl font-medium text-slate-800">
                        ₹{listing.price}
                        </span>
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm">
                        {listing.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{listing.category}</span>
                      <div className="flex gap-2">
                        <button className="text-slate-400">·</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showEditForm && (
          <EditBookForm
            book={selectedBook}
            onClose={() => setShowEditForm(false)}
            onUpdate={handleUpdateBook}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={() => handleDelete(selectedBookId)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyListingsBooks;
