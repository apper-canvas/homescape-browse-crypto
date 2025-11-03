import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import PropertyService from "@/services/api/PropertyService";
import FavoritesService from "@/services/api/FavoritesService";

const ComparePage = () => {
  const [properties, setProperties] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propertiesData, favoritesData] = await Promise.all([
        PropertyService.getAll(),
        FavoritesService.getAll()
      ]);
      
      setProperties(propertiesData);
      setFavorites(favoritesData.map(fav => fav.propertyId));
      
      // Load first 3 properties for demonstration
      setComparisonList(propertiesData.slice(0, 3).map(p => p.Id));
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to load comparison data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleRemoveProperty = (propertyId) => {
    setComparisonList(prev => prev.filter(id => id !== propertyId));
    toast.success("Removed from comparison");
  };

  const handleToggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.includes(propertyId);
      
      if (isFavorite) {
        await FavoritesService.delete(propertyId);
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast.success("Removed from favorites");
      } else {
        const newFavorite = {
          propertyId: propertyId,
          savedDate: new Date().toISOString()
        };
        await FavoritesService.create(newFavorite);
        setFavorites(prev => [...prev, propertyId]);
        toast.success("Added to favorites");
      }
      
      // Trigger favorites count update
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (err) {
      toast.error("Failed to update favorites");
      console.error("Error updating favorites:", err);
    }
  };

  const handleAddProperty = async () => {
    if (comparisonList.length >= 3) {
      toast.warning("Maximum 3 properties can be compared at once");
      return;
    }

    // Find a property not in comparison
    const availableProperty = properties.find(p => !comparisonList.includes(p.Id));
    if (availableProperty) {
      setComparisonList(prev => [...prev, availableProperty.Id]);
      toast.success(`Added ${availableProperty.title} to comparison`);
    } else {
      toast.info("No more properties available to add");
    }
  };

  const comparisonProperties = properties.filter(property => 
    comparisonList.includes(property.Id)
  );

  const comparisonAttributes = [
    { key: 'price', label: 'Price', format: formatPrice },
    { key: 'bedrooms', label: 'Bedrooms', suffix: ' beds' },
    { key: 'bathrooms', label: 'Bathrooms', suffix: ' baths' },
    { key: 'squareFeet', label: 'Square Feet', format: formatSquareFeet, suffix: ' sqft' },
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'propertyType', label: 'Property Type' },
    { key: 'lotSize', label: 'Lot Size', format: (val) => val?.toLocaleString(), suffix: ' sqft' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary">Loading comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
              <ApperIcon name="BarChart3" size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Compare Properties
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              Make informed decisions by comparing key features, prices, and amenities side by side.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {comparisonProperties.length === 0 ? (
          <Empty
            title="No Properties to Compare"
            message="Start browsing properties and add them to comparison to see detailed side-by-side analysis."
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/browse'}
            icon="BarChart3"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-display font-semibold text-primary">
                  Comparing {comparisonProperties.length} Properties
                </h2>
                <p className="text-secondary">
                  Side-by-side comparison of key features and pricing
                </p>
              </div>
              
              {comparisonProperties.length < 3 && (
                <Button
                  onClick={handleAddProperty}
                  variant="primary"
                >
                  <ApperIcon name="Plus" size={18} className="mr-2" />
                  Add Property
                </Button>
              )}
            </div>

            {/* Property Cards */}
            <div className={`grid gap-6 ${
              comparisonProperties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
              comparisonProperties.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {comparisonProperties.map((property, index) => (
                <motion.div
                  key={property.Id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveProperty(property.Id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-error rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-accent to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-display font-semibold text-primary mb-2 line-clamp-2">
                        {property.title}
                      </h3>
                      <p className="text-sm text-secondary flex items-center mb-4">
                        <ApperIcon name="MapPin" size={14} className="mr-2 text-accent" />
                        {property.city}, {property.state}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-secondary">
                        <span className="flex items-center">
                          <ApperIcon name="Bed" size={14} className="mr-1 text-accent" />
                          {property.bedrooms} bed
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Bath" size={14} className="mr-1 text-accent" />
                          {property.bathrooms} bath
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Square" size={14} className="mr-1 text-accent" />
                          {formatSquareFeet(property.squareFeet)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Comparison Table */}
            <Card className="overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-display font-semibold text-primary mb-8 flex items-center">
                  <ApperIcon name="BarChart3" size={24} className="mr-3 text-accent" />
                  Detailed Comparison
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-medium text-secondary">Feature</th>
                        {comparisonProperties.map((property) => (
                          <th key={property.Id} className="text-left py-4 px-4 font-medium text-primary min-w-48">
                            {property.title.substring(0, 30)}...
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonAttributes.map((attr, index) => (
                        <tr key={attr.key} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="py-4 px-4 font-medium text-secondary">
                            {attr.label}
                          </td>
                          {comparisonProperties.map((property) => {
                            let value = property[attr.key];
                            if (attr.format && value) {
                              value = attr.format(value);
                            } else if (attr.suffix && value) {
                              value = `${value}${attr.suffix}`;
                            } else if (!value) {
                              value = 'N/A';
                            }
                            
                            return (
                              <td key={property.Id} className="py-4 px-4 text-primary font-medium">
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className={`grid gap-4 ${
              comparisonProperties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
              comparisonProperties.length === 2 ? 'grid-cols-2' : 
              'grid-cols-3'
            }`}>
              {comparisonProperties.map((property) => (
                <Card key={property.Id} className="p-6">
                  <h4 className="font-semibold text-primary mb-4 text-center">
                    {property.title.substring(0, 25)}...
                  </h4>
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleToggleFavorite(property.Id)}
                      variant={favorites.includes(property.Id) ? "primary" : "outline"}
                      className="w-full"
                      size="sm"
                    >
                      <ApperIcon 
                        name="Heart" 
                        size={16} 
                        className={`mr-2 ${favorites.includes(property.Id) ? 'fill-current' : ''}`} 
                      />
                      {favorites.includes(property.Id) ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      size="sm"
                      onClick={() => window.location.href = `/property/${property.Id}`}
                    >
                      <ApperIcon name="Eye" size={16} className="mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full"
                      size="sm"
                    >
                      <ApperIcon name="Phone" size={16} className="mr-2" />
                      Contact Agent
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;