import React from "react";
import { motion } from "framer-motion";

const Loading = ({ variant = "cards" }) => {
  const renderCardSkeleton = () => (
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded-xl mb-8" />
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  if (variant === "detail") {
    return (
      <div className="container mx-auto px-4 py-8">
        {renderDetailSkeleton()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderCardSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;