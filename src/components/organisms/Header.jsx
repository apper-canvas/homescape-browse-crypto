import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FavoritesService from "@/services/api/FavoritesService";

const Header = () => {
  const location = useLocation();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { path: '/browse', label: 'Browse', icon: 'Home' },
    { path: '/map', label: 'Map View', icon: 'Map' },
    { path: '/favorites', label: 'Favorites', icon: 'Heart' },
    { path: '/compare', label: 'Compare', icon: 'BarChart3' }
  ];

  useEffect(() => {
    const updateFavoritesCount = async () => {
      try {
        const favorites = await FavoritesService.getAll();
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error("Error loading favorites count:", error);
      }
    };

    updateFavoritesCount();
    
    // Listen for storage changes to update count
    const handleStorageChange = () => {
      updateFavoritesCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/95 backdrop-blur-lg shadow-lg' 
          : 'bg-surface'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/browse" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Homescape
              </h1>
              <p className="text-xs text-secondary -mt-1">Browse</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 relative ${
                    isActive 
                      ? 'text-accent bg-accent bg-opacity-10' 
                      : 'text-secondary hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/favorites' && favoritesCount > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-error to-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="primary" 
              className="shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Phone" size={18} className="mr-2" />
              Contact Agent
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;