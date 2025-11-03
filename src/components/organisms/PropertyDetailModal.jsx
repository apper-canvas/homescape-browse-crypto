import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/molecules/ContactForm";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const PropertyDetailModal = ({ property, isOpen, onClose, isFavorite, onToggleFavorite, onAddToCompare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (!property) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden rounded-t-2xl">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-lg"
                  >
                    <ApperIcon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-lg"
                  >
                    <ApperIcon name="ChevronRight" size={20} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Status Badge */}
              <Badge 
                variant={property.status === 'For Sale' ? 'success' : 'primary'}
                className="absolute top-4 left-4 shadow-lg"
              >
                {property.status}
              </Badge>

              {/* Price */}
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-accent to-yellow-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title and Address */}
              <div className="mb-6">
                <h1 className="text-3xl font-display font-bold text-primary mb-3">
                  {property.title}
                </h1>
                <p className="text-secondary text-lg flex items-center">
                  <ApperIcon name="MapPin" size={20} className="mr-2 text-accent" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-background rounded-xl">
                  <ApperIcon name="Bed" size={24} className="mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                  <div className="text-sm text-secondary">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <ApperIcon name="Bath" size={24} className="mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
                  <div className="text-sm text-secondary">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <ApperIcon name="Square" size={24} className="mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-primary">{formatSquareFeet(property.squareFeet)}</div>
                  <div className="text-sm text-secondary">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-primary">{property.yearBuilt}</div>
                  <div className="text-sm text-secondary">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-display font-semibold text-primary mb-4">Description</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-display font-semibold text-primary mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-secondary">
                        <ApperIcon name="Check" size={16} className="text-accent flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <Button
                  onClick={() => onToggleFavorite(property.Id)}
                  variant={isFavorite ? "primary" : "outline"}
                  className="flex-1"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={18} 
                    className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} 
                  />
                  {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                </Button>
                
                <Button
                  onClick={() => onAddToCompare(property.Id)}
                  variant="secondary"
                  className="flex-1"
                >
                  <ApperIcon name="BarChart3" size={18} className="mr-2" />
                  Add to Compare
                </Button>
                
<Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => setShowContactForm(true)}
                >
                  <ApperIcon name="Phone" size={18} className="mr-2" />
                  Contact Agent
</Button>
              </div>
            </div>
          </motion.div>
          {/* Contact Form Modal */}
          <ContactForm 
            isOpen={showContactForm}
            onClose={() => setShowContactForm(false)}
            property={property}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
export default PropertyDetailModal;