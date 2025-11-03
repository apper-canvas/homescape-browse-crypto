import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const PropertyCard = ({ property, isFavorite, onToggleFavorite, onAddToCompare }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer">
        <Link to={`/property/${property.Id}`}>
          <div className="relative">
            <div className="h-48 bg-gray-300 overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 property-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Status Badge */}
            {property.status && (
              <Badge 
                variant={property.status === 'For Sale' ? 'success' : 'primary'}
                className="absolute top-3 left-3 shadow-lg"
              >
                {property.status}
              </Badge>
            )}
            
            {/* Price Tag */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-accent to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              {formatPrice(property.price)}
            </div>
          </div>
        </Link>

        <div className="p-6">
          <Link to={`/property/${property.Id}`}>
            <h3 className="text-xl font-display font-semibold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {property.title}
            </h3>
            
            <p className="text-secondary mb-4 flex items-center">
              <ApperIcon name="MapPin" size={16} className="mr-2 text-accent" />
              {property.address}, {property.city}, {property.state}
            </p>
          </Link>

          <div className="flex items-center justify-between mb-4 text-sm text-secondary">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ApperIcon name="Bed" size={16} className="mr-1 text-accent" />
                {property.bedrooms} bed
              </span>
              <span className="flex items-center">
                <ApperIcon name="Bath" size={16} className="mr-1 text-accent" />
                {property.bathrooms} bath
              </span>
              <span className="flex items-center">
                <ApperIcon name="Square" size={16} className="mr-1 text-accent" />
                {formatSquareFeet(property.squareFeet)} sqft
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(property.Id);
              }}
              variant="ghost"
              size="sm"
              className={`${isFavorite ? 'text-accent' : 'text-gray-400'} hover:text-accent transition-colors`}
            >
              <ApperIcon 
                name="Heart" 
                size={18} 
                className={`mr-2 transition-all duration-300 ${isFavorite ? 'fill-current animate-heart-pop' : ''}`} 
              />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>

            <Button
              onClick={(e) => {
                e.preventDefault();
                onAddToCompare(property.Id);
              }}
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Compare
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;