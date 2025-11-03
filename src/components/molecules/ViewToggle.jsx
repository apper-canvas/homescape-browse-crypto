import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid' },
    { id: 'map', icon: 'Map', label: 'Map' }
  ];

  return (
    <div className="bg-surface rounded-xl shadow-md p-2 flex items-center space-x-1">
      {views.map((view) => (
        <motion.button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentView === view.id
              ? 'bg-gradient-to-r from-accent to-yellow-500 text-white shadow-md'
              : 'text-secondary hover:text-primary hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name={view.icon} size={16} />
          <span>{view.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ViewToggle;