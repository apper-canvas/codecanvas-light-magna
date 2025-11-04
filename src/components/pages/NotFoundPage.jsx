import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-slate-200 mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          <Link 
            to="/" 
            className="inline-block btn-primary transition-all duration-200 hover:scale-105"
          >
            Go Back Home
          </Link>
          
          <div className="flex justify-center space-x-4 mt-6">
            <Link 
              to="/trending" 
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Trending Pens
            </Link>
            <span className="text-slate-600">•</span>
            <Link 
              to="/search" 
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Search
            </Link>
            <span className="text-slate-600">•</span>
            <Link 
              to="/editor" 
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              New Pen
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;