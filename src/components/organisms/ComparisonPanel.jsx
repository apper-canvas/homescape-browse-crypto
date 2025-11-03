import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";

const ComparisonPanel = ({ 
  properties = [], 
  isOpen, 
  onClose, 
  onRemoveProperty, 
  favorites = [], 
  onToggleFavorite 
}) => {
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

  const comparisonAttributes = [
    { key: 'price', label: 'Price', format: formatPrice },
    { key: 'bedrooms', label: 'Bedrooms', suffix: ' beds' },
    { key: 'bathrooms', label: 'Bathrooms', suffix: ' baths' },
    { key: 'squareFeet', label: 'Square Feet', format: formatSquareFeet, suffix: ' sqft' },
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'propertyType', label: 'Property Type' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 comparison-backdrop z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-surface shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="BarChart3" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">
                      Compare Properties
                    </h2>
                    <p className="text-secondary">
                      {properties.length} {properties.length === 1 ? 'property' : 'properties'} selected
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:text-primary"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Content */}
              {properties.length === 0 ? (
                <Empty
                  title="No Properties to Compare"
                  message="Add properties to your comparison list to see them side by side."
                  actionLabel="Browse Properties"
                  onAction={onClose}
                  icon="BarChart3"
                />
              ) : (
                <div className="space-y-6">
                  {/* Property Cards */}
                  <div className={`grid gap-6 ${properties.length === 1 ? 'grid-cols-1' : properties.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {properties.map((property) => (
                      <Card key={property.Id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            onClick={() => onRemoveProperty(property.Id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
                          >
                            <ApperIcon name="X" size={14} />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-primary text-sm line-clamp-2 mb-2">
                            {property.title}
                          </h3>
                          <p className="text-xs text-secondary flex items-center">
                            <ApperIcon name="MapPin" size={12} className="mr-1" />
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Comparison Table */}
                  <div className="bg-background rounded-xl p-6">
                    <h3 className="text-lg font-display font-semibold text-primary mb-6">
                      Detailed Comparison
                    </h3>
                    
                    <div className="space-y-4">
                      {comparisonAttributes.map((attr) => (
                        <div key={attr.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-200 last:border-b-0">
                          <div className="font-medium text-secondary">
                            {attr.label}
                          </div>
                          {properties.map((property) => {
                            let value = property[attr.key];
                            if (attr.format) {
                              value = attr.format(value);
                            } else if (attr.suffix) {
                              value = `${value}${attr.suffix}`;
                            }
                            
                            return (
                              <div key={property.Id} className="text-primary font-medium">
                                {value}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {properties.map((property) => (
                      <div key={property.Id} className="flex-1 space-y-2">
                        <Button
                          onClick={() => onToggleFavorite(property.Id)}
                          variant={favorites.includes(property.Id) ? "primary" : "outline"}
                          className="w-full"
                          size="sm"
                        >
                          <ApperIcon 
                            name="Heart" 
                            size={14} 
                            className={`mr-2 ${favorites.includes(property.Id) ? 'fill-current' : ''}`} 
                          />
                          {favorites.includes(property.Id) ? 'Saved' : 'Save'}
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          size="sm"
                        >
                          <ApperIcon name="Phone" size={14} className="mr-2" />
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComparisonPanel;