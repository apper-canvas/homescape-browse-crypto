import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No properties found", 
  message = "Try adjusting your search criteria or browse all available properties.",
  actionLabel = "Clear Filters",
  onAction,
  icon = "Home",
  showAction = true 
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mb-8 shadow-xl">
        <ApperIcon name={icon} size={36} className="text-white" />
      </div>
      
      <h3 className="text-3xl font-display font-semibold text-primary mb-4">
        {title}
      </h3>
      
      <p className="text-secondary text-lg max-w-lg mb-10 leading-relaxed">
        {message}
      </p>
      
      {showAction && onAction && (
        <Button 
          onClick={onAction} 
          variant="primary"
          className="px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <ApperIcon name="RotateCcw" size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;