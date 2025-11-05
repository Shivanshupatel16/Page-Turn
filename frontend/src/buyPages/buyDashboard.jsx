import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ArrowRightIcon,
  BookOpenIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Link,useParams,useNavigate } from 'react-router-dom';
import Layout from '@/pages/Sidebar';

const token = localStorage.getItem("token");

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        const response = await axios.get(
          `/api/books/category/${encodeURIComponent(categoryName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooks(response.data.books);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryBooks();
  }, [categoryName]);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryName} Books
          </h1>
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};  

const BookCard = ({ book }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const getImageUrl = (path) => {
    if (path.startsWith('http')) return path;
    return path; // Use path directly as it should be relative
    // return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };


  useEffect(() => {
    if (book?.images?.[0]) {
      const baseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || '/uploads';
      const cleanPath = book.images[0].replace(/^\/uploads\//, ''); // Remove leading /uploads/
      const url = `${baseUrl}/${cleanPath}`;
      setImgSrc(url);
    } else {
      setImgSrc('/placeholder-book.jpg');
    }
  }, [book]);


  return (
    <Link to={`/books/${book._id}`}>

    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative h-64 mb-4">
        <motion.img 
          src={imgSrc}
          alt={book.title}
          className="w-full h-full object-cover rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.target.src = '/placeholder-book.jpg';
            setImgSrc('/placeholder-book.jpg');
          }}
        />
        <motion.div 
          className="absolute top-2 left-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs"
          whileHover={{ scale: 1.1 }}
        >
          {book.condition}
        </motion.div>
        {book.status === 'Rejected' && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
            Rejected
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
      <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-green-600">
        ₹{book.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">
          {book.category}
        </span>
      </div>
      {book.description && (
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
          {book.description}
        </p>
      )}
    </motion.div>
    </Link>
  );
};

const BookStoreFrontpage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books/allBooks',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBooks(response.data.allBooks);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch books');
        // toast.error(error.response?.data?.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

const groupedBooks = books.reduce((acc, book) => {
  const category = book.category || 'Other';
  acc[category] = acc[category] || [];
  acc[category].push(book);
  return acc;
}, {});

const desiredOrder = ['Fiction', 'Non-Fiction', 'Children', 'Textbook', 'Other'];

const categories = Object.keys(groupedBooks)
  .sort((a, b) => {
    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);
    return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
  })
  .map(category => ({
    name: category,
    key: category,
  }));


  return (
    <div className="min-h-screen bg-gray-50 ml-1">
      <section className="relative h-[40vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
            alt="Library background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-500/90" />
        </div>
        
        <motion.div 
          className="relative h-full flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 text-white text-center w-full">
            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Discover & Exchange Books <br />with Fellow Readers
            </motion.h1>
        <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
              >
              Join our community of book lovers to read, share, and exchange thousands of books
            </motion.p>
              </div>
        </motion.div>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Error: {error}
        </div>
      ) : (
        <AnimatePresence>
          {categories.map((category) => (
            <motion.section
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto py-16 px-4"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                <Link 
                  to={`/category/${category.name}`}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 text-lg"
                >
                  See All <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedBooks[category.key].slice(0, 4).map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      )}

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 my-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-95" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <GlobeAltIcon className="h-20 w-20 text-white mx-auto mb-6" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Reading Community
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-12 py-4 rounded-full font-bold flex items-center gap-3 text-lg mx-auto hover:shadow-xl transition-all"
            >
              <SparklesIcon className="h-6 w-6 animate-pulse" />
              Join Free Today
              <HeartIcon className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpenIcon className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-white">PageTurn</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for book exchange since 2023
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-green-400 mt-1" />
                <a href="mailto:support@bookmarket.com" className="text-gray-400 hover:text-green-400">
                  support@pageturn.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-green-400 mt-1" />
                <p className="text-gray-400">123 Book Street, Knowledge City</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Safety Guidelines'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-green-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PageTurn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export {BookStoreFrontpage,CategoryPage};