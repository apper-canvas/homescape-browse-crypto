import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  showIcon = true 
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <div className="w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
      )}
      
      <h3 className="text-2xl font-display font-semibold text-primary mb-3">
        {title}
      </h3>
      
      <p className="text-secondary text-lg max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;