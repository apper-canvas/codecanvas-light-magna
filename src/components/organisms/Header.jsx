import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
const { logout } = useAuth();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-slate-700/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="Code2" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              CodeCanvas
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white transition-colors duration-200 relative group"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/trending" 
              className="text-slate-300 hover:text-white transition-colors duration-200 relative group"
            >
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Create Button */}
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/editor')}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              New Pen
            </Button>
            
            {/* User Section */}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">
                  Welcome, {user.firstName || user.emailAddress}
                </span>
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-400 hover:text-white">
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;