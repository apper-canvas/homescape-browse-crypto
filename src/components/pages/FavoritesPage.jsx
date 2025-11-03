import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import ComparisonPanel from "@/components/organisms/ComparisonPanel";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import PropertyService from "@/services/api/PropertyService";
import FavoritesService from "@/services/api/FavoritesService";

const FavoritesPage = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const loadFavoriteProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const favoritesData = await FavoritesService.getAll();
      const favoriteIds = favoritesData.map(fav => fav.propertyId);
      setFavorites(favoriteIds);
      
      if (favoriteIds.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      const propertiesData = await PropertyService.getAll();
      const favoriteProps = propertiesData.filter(property => 
        favoriteIds.includes(property.Id)
      );
      
      setFavoriteProperties(favoriteProps);
    } catch (err) {
      setError("Failed to load favorite properties. Please try again.");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteProperties();
    
    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      loadFavoriteProperties();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.includes(propertyId);
      
      if (isFavorite) {
        await FavoritesService.delete(propertyId);
        setFavorites(prev => prev.filter(id => id !== propertyId));
        setFavoriteProperties(prev => prev.filter(prop => prop.Id !== propertyId));
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

  const handleAddToCompare = async (propertyId) => {
    if (comparisonList.includes(propertyId)) {
      toast.info("Property is already in comparison list");
      return;
    }

    if (comparisonList.length >= 3) {
      toast.warning("Maximum 3 properties can be compared at once");
      return;
    }

    try {
      const property = await PropertyService.getById(propertyId);
      setComparisonList(prev => [...prev, propertyId]);
      toast.success(`Added ${property.title} to comparison`);
    } catch (err) {
      toast.error("Failed to add to comparison");
      console.error("Error adding to comparison:", err);
    }
  };

  const handleRemoveFromCompare = (propertyId) => {
    setComparisonList(prev => prev.filter(id => id !== propertyId));
    toast.success("Removed from comparison");
  };

  const handleClearAllFavorites = async () => {
    try {
      for (const propertyId of favorites) {
        await FavoritesService.delete(propertyId);
      }
      setFavorites([]);
      setFavoriteProperties([]);
      toast.success("All favorites cleared");
      
      // Trigger favorites count update
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (err) {
      toast.error("Failed to clear favorites");
      console.error("Error clearing favorites:", err);
    }
  };

  const getComparisonProperties = () => {
    return favoriteProperties.filter(property => comparisonList.includes(property.Id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">
                Your Favorite Properties
              </h1>
              <p className="text-gray-200 text-lg">
                {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {comparisonList.length > 0 && (
                <Button
                  onClick={() => setShowComparison(true)}
                  variant="primary"
                  className="relative bg-accent hover:bg-yellow-500"
                >
                  <ApperIcon name="BarChart3" size={18} className="mr-2" />
                  Compare ({comparisonList.length})
                </Button>
              )}
              
              {favoriteProperties.length > 0 && (
                <Button
                  onClick={handleClearAllFavorites}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <ApperIcon name="Trash2" size={18} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && !loading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ApperIcon name="AlertTriangle" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-primary mb-3">
              Error Loading Favorites
            </h3>
            <p className="text-secondary mb-6">
              {error}
            </p>
            <Button onClick={loadFavoriteProperties} variant="primary">
              <ApperIcon name="RefreshCw" size={18} className="mr-2" />
              Try Again
            </Button>
          </div>
        ) : favoriteProperties.length === 0 && !loading ? (
          <Empty
            title="No Favorite Properties"
            message="Start exploring properties and save your favorites to see them here. Your saved properties will help you compare and make better decisions."
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/browse'}
            icon="Heart"
          />
        ) : (
          <PropertyGrid
            properties={favoriteProperties}
            loading={loading}
            error=""
            onRetry={loadFavoriteProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCompare={handleAddToCompare}
          />
        )}
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel
        properties={getComparisonProperties()}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemoveProperty={handleRemoveFromCompare}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default FavoritesPage;