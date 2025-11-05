import { motion } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Navbar from "./Navbar";
import MyListingsBooks from "@/sellPages/ListBooks";

const ComingSoon = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden px-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute -top-10 -right-10 lg:top-10 lg:left-10 opacity-100"
        >
          <BookOpenIcon className="h-[300px] w-[300px] text-emerald-400/50" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center z-10"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🚧 Coming Soon!
          </h1>
          <p className="text-slate-600 text-lg">
            This feature is currently under development. <br />
            We're working hard to bring it to you very soon!
          </p>
          <div className="mt-6" onClick={MyListingsBooks}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 transition"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ComingSoon;
