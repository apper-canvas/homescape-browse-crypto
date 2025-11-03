import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PropertyDetailModal from "@/components/organisms/PropertyDetailModal";

const MapView = ({ 
  properties = [], 
  favorites = [], 
  onToggleFavorite, 
  onAddToCompare 
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleMarkerHover = (property) => {
    setHoveredProperty(property);
  };

  const handleMarkerLeave = () => {
    setHoveredProperty(null);
  };

  return (
    <div className="relative h-full min-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
            <ApperIcon name="Map" size={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-display font-semibold text-primary mb-2">
            Interactive Map View
          </h3>
          <p className="text-secondary max-w-md">
            Explore properties on an interactive map to find the perfect location for your next home.
          </p>
        </div>
      </div>

      {/* Property Markers */}
      <div className="absolute inset-0 p-8">
        <div className="grid grid-cols-4 gap-8 h-full">
          {properties.slice(0, 12).map((property, index) => {
            const positions = [
              { top: '15%', left: '20%' },
              { top: '25%', left: '60%' },
              { top: '35%', left: '30%' },
              { top: '45%', left: '70%' },
              { top: '55%', left: '15%' },
              { top: '65%', left: '55%' },
              { top: '75%', left: '25%' },
              { top: '20%', left: '80%' },
              { top: '40%', left: '10%' },
              { top: '60%', left: '75%' },
              { top: '80%', left: '45%' },
              { top: '30%', left: '85%' }
            ];

            const position = positions[index] || { top: '50%', left: '50%' };

            return (
              <motion.div
                key={property.Id}
                className="absolute cursor-pointer"
                style={{ top: position.top, left: position.left }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => handleMarkerHover(property)}
                onMouseLeave={handleMarkerLeave}
                onClick={() => handleMarkerClick(property)}
              >
                {/* Map Pin */}
                <div className={`relative transform transition-all duration-200 ${
                  hoveredProperty?.Id === property.Id ? 'scale-110 -translate-y-2' : ''
                }`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                  </div>
                  
                  {/* Price Popup */}
                  <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-surface px-3 py-2 rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 ${
                    hoveredProperty?.Id === property.Id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}>
                    <div className="text-sm font-bold text-primary">
                      {formatPrice(property.price)}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-surface"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-10 h-10 p-0 rounded-lg shadow-lg"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-10 h-10 p-0 rounded-lg shadow-lg"
        >
          <ApperIcon name="Minus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-10 h-10 p-0 rounded-lg shadow-lg"
        >
          <ApperIcon name="Locate" size={16} />
        </Button>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.Id) : false}
        onToggleFavorite={onToggleFavorite}
        onAddToCompare={onAddToCompare}
      />
    </div>
  );
};

export default MapView;