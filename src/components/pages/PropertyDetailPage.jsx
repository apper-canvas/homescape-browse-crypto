import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import PropertyService from "@/services/api/PropertyService";
import FavoritesService from "@/services/api/FavoritesService";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await PropertyService.getById(parseInt(id));
      setProperty(data);
      
      // Check if property is in favorites
      const favorites = await FavoritesService.getAll();
      const isFav = favorites.some(fav => fav.propertyId === data.Id);
      setIsFavorite(isFav);
    } catch (err) {
      setError("Failed to load property details. Please try again.");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

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
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleToggleFavorite = async () => {
    if (!property) return;

    try {
      if (isFavorite) {
        await FavoritesService.delete(property.Id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        const newFavorite = {
          propertyId: property.Id,
          savedDate: new Date().toISOString()
        };
        await FavoritesService.create(newFavorite);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
      
      // Trigger favorites count update
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (err) {
      toast.error("Failed to update favorites");
      console.error("Error updating favorites:", err);
    }
  };

  const handleAddToCompare = () => {
    toast.success(`Added ${property.title} to comparison`);
    // In a real app, this would add to a comparison service
  };

  if (loading) {
    return <Loading variant="detail" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error 
          title="Property Not Found"
          message={error}
          onRetry={loadProperty}
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error 
          title="Property Not Found"
          message="The property you're looking for doesn't exist or has been removed."
          onRetry={() => navigate('/browse')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-secondary hover:text-primary"
        >
          <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
          Back to Properties
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
        >
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all shadow-lg hover:scale-110"
              >
                <ApperIcon name="ChevronLeft" size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all shadow-lg hover:scale-110"
              >
                <ApperIcon name="ChevronRight" size={24} />
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Status Badge */}
          <Badge 
            variant={property.status === 'For Sale' ? 'success' : 'primary'}
            className="absolute top-6 left-6 shadow-lg text-lg px-4 py-2"
          >
            {property.status}
          </Badge>

          {/* Price */}
          <div className="absolute bottom-6 right-6 bg-gradient-to-r from-accent to-yellow-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-xl">
            {formatPrice(property.price)}
          </div>
        </motion.div>
      </div>

      {/* Property Details */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Title and Address */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                  {property.title}
                </h1>
                <p className="text-secondary text-xl flex items-center">
                  <ApperIcon name="MapPin" size={24} className="mr-3 text-accent" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="text-center p-6 bg-surface rounded-2xl shadow-md">
                  <ApperIcon name="Bed" size={32} className="mx-auto mb-3 text-accent" />
                  <div className="text-3xl font-bold text-primary">{property.bedrooms}</div>
                  <div className="text-secondary font-medium">Bedrooms</div>
                </div>
                <div className="text-center p-6 bg-surface rounded-2xl shadow-md">
                  <ApperIcon name="Bath" size={32} className="mx-auto mb-3 text-accent" />
                  <div className="text-3xl font-bold text-primary">{property.bathrooms}</div>
                  <div className="text-secondary font-medium">Bathrooms</div>
                </div>
                <div className="text-center p-6 bg-surface rounded-2xl shadow-md">
                  <ApperIcon name="Square" size={32} className="mx-auto mb-3 text-accent" />
                  <div className="text-3xl font-bold text-primary">{formatSquareFeet(property.squareFeet)}</div>
                  <div className="text-secondary font-medium">Sq Ft</div>
                </div>
                <div className="text-center p-6 bg-surface rounded-2xl shadow-md">
                  <ApperIcon name="Calendar" size={32} className="mx-auto mb-3 text-accent" />
                  <div className="text-3xl font-bold text-primary">{property.yearBuilt}</div>
                  <div className="text-secondary font-medium">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-semibold text-primary mb-6">
                  About This Property
                </h3>
                <p className="text-secondary leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-2xl font-display font-semibold text-primary mb-6">
                    Amenities & Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-surface rounded-xl">
                        <ApperIcon name="Check" size={20} className="text-accent flex-shrink-0" />
                        <span className="text-secondary font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8"
            >
              <div className="bg-surface rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-display font-semibold text-primary mb-6">
                  Property Details
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-secondary font-medium">Property Type</span>
                    <span className="text-primary font-semibold">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-secondary font-medium">Lot Size</span>
                    <span className="text-primary font-semibold">{property.lotSize?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-secondary font-medium">Listed Date</span>
                    <span className="text-primary font-semibold">
                      {property.listedDate ? new Date(property.listedDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-secondary font-medium">Price/Sqft</span>
                    <span className="text-primary font-semibold">
                      ${Math.round(property.price / property.squareFeet).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleToggleFavorite}
                    variant={isFavorite ? "primary" : "outline"}
                    className="w-full py-4 text-lg"
                  >
                    <ApperIcon 
                      name="Heart" 
                      size={20} 
                      className={`mr-3 ${isFavorite ? 'fill-current' : ''}`} 
                    />
                    {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                  </Button>
                  
                  <Button
                    onClick={handleAddToCompare}
                    variant="secondary"
                    className="w-full py-4 text-lg"
                  >
                    <ApperIcon name="BarChart3" size={20} className="mr-3" />
                    Add to Compare
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-lg shadow-xl"
                  >
                    <ApperIcon name="Phone" size={20} className="mr-3" />
                    Contact Agent
                  </Button>
                </div>

                {/* Virtual Tour */}
                {property.virtualTourUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="w-full py-4 text-lg border-accent text-accent hover:bg-accent hover:text-white"
                      onClick={() => window.open(property.virtualTourUrl, '_blank')}
                    >
                      <ApperIcon name="Play" size={20} className="mr-3" />
                      Virtual Tour
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;