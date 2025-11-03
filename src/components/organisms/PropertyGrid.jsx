import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry, 
  favorites = [], 
  onToggleFavorite, 
  onAddToCompare 
}) => {
  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return (
      <Error 
        title="Unable to Load Properties"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty 
        title="No Properties Found"
        message="Try adjusting your search criteria or browse all available properties."
        actionLabel="Clear Filters"
        onAction={onRetry}
        icon="Home"
      />
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PropertyCard
            property={property}
            isFavorite={favorites.includes(property.Id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCompare={onAddToCompare}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;