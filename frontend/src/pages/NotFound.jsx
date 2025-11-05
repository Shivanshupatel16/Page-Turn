import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-lg mt-4 text-gray-400">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;