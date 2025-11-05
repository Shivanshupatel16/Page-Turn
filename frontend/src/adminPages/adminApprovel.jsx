import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { 
  BookOpenIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  CheckBadgeIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import Navbar from "@/pages/Navbar";

const RejectionModal = ({ book, onClose, onReject }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(reason);
      onClose();
    } catch (error) {
      toast.error("Failed to submit rejection");
    } finally {
      setIsSubmitting(false);
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
        className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-800"
          disabled={isSubmitting}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="space-y-4">
          <div className="text-center">
            <NoSymbolIcon className="h-12 w-12 text-rose-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-slate-800">Reject Submission</h3>
            <p className="text-slate-600 mt-1">
              {book.title} by {book.author}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason for rejection*
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows="4"
              placeholder="Provide detailed feedback..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              )}
              Submit Rejection
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminApprovalPage = () => {
  const [loading, setLoading] = useState(true);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]);

  const token = localStorage.getItem("token");

  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "/api/books/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.books)) {
        setPendingBooks(response.data.books);
      } else {
        throw new Error("Invalid data format from server");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to fetch pending books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const handleApprove = async (bookId) => {
    try {
      setProcessingIds((prev) => [...prev, bookId]);
      await axios.put(
        `/api/books/approveBook/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingBooks((prev) => prev.filter((book) => book._id !== bookId));
      toast.success("Book approved successfully");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error.response?.data?.message || "Failed to approve book");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  const handleReject = async (reason) => {
    try {
      setProcessingIds((prev) => [...prev, selectedBook._id]);
      await axios.put(
        `/api/books/rejectBook/${selectedBook._id}`,
        { rejectionReason: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingBooks((prev) => prev.filter((book) => book._id !== selectedBook._id));
      toast.success("Book rejected successfully");
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error(error.response?.data?.message || "Failed to reject book");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== selectedBook._id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <BookOpenIcon className="h-16 w-16 text-emerald-600 opacity-75" />
          </motion.div>
          <p className="text-lg font-semibold text-slate-700">
            Gathering Submissions
          </p>
          <p className="text-slate-500">Curating the latest book entries</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50">
        <div className="text-center space-y-4 max-w-md p-8">
          <NoSymbolIcon className="h-12 w-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-bold text-rose-800">Loading Error</h2>
          <p className="text-rose-600 mb-6">{error}</p>
          <button
            onClick={fetchPendingBooks}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-serif mb-1 mt-10">
              Submission Review
            </h1>
            <p className="text-slate-600">
              {pendingBooks.length} books awaiting approval
            </p>
          </div>
          <button
            onClick={fetchPendingBooks}
            className="flex items-center gap-2 mt-16 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 shadow-sm"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {pendingBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-8 text-center border border-slate-200"
          >
            <div className="max-w-md mx-auto">
              <div className="h-40 w-40 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckBadgeIcon className="h-16 w-16 text-emerald-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                All Caught Up!
              </h3>
              <p className="text-slate-600">
                No pending submissions need review
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBooks.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-slate-100"
              >
                <div className="h-60 bg-slate-50 relative overflow-hidden rounded-t-xl">
                  {book.images?.[0] ? (
                    <img
                      src={`http://localhost:5000${book.images[0]}`}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-emerald-50">
                            <BookOpenIcon class="h-16 w-16 text-emerald-200" />
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                      <BookOpenIcon className="h-16 w-16 text-emerald-200" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    Pending
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    by <span className="font-medium">{book.author}</span>
                  </p>
                  
                  {book.description && (
                    <p className="text-sm text-slate-500 line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs text-slate-500">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(book._id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={processingIds.includes(book._id)}
                      >
                        {processingIds.includes(book._id) ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckBadgeIcon className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        disabled={processingIds.includes(book._id)}
                      >
                        <NoSymbolIcon className="h-4 w-4" />
                        
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showRejectModal && (
            <RejectionModal
              book={selectedBook}
              onClose={() => setShowRejectModal(false)}
              onReject={handleReject}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminApprovalPage;