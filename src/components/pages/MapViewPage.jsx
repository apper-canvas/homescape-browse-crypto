import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FilterPanel from "@/components/molecules/FilterPanel";
import MapView from "@/components/organisms/MapView";
import ComparisonPanel from "@/components/organisms/ComparisonPanel";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PropertyService from "@/services/api/PropertyService";
import FavoritesService from "@/services/api/FavoritesService";

const MapViewPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    searchQuery: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    propertyTypes: []
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await PropertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await FavoritesService.getAll();
      setFavorites(data.map(fav => fav.propertyId));
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const applyFilters = () => {
    let filtered = [...properties];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query) ||
        property.zipCode.includes(query)
      );
    }

    // Price range
    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= filters.priceMax);
    }

    // Bedrooms
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms);
    }

    // Bathrooms
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms);
    }

    // Property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      propertyTypes: []
    });
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

  const getComparisonProperties = () => {
    return properties.filter(property => comparisonList.includes(property.Id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen pt-20">
        {/* Map Controls */}
        <div className="absolute top-24 left-4 right-4 z-30 flex justify-between items-center">
          <div className="flex gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="shadow-lg backdrop-blur-sm bg-surface/95"
            >
              <ApperIcon name="Filter" size={18} className="mr-2" />
              Filters
              {Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true)) && (
                <span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
              )}
            </Button>
            
            <div className="bg-surface/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <span className="text-sm text-secondary">
                {filteredProperties.length} properties
              </span>
            </div>
          </div>

          {comparisonList.length > 0 && (
            <Button
              onClick={() => setShowComparison(true)}
              variant="primary"
              className="relative shadow-lg"
            >
              <ApperIcon name="BarChart3" size={18} className="mr-2" />
              Compare ({comparisonList.length})
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-24 left-4 z-40 w-80"
          >
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </motion.div>
        )}

        {/* Map */}
        <div className="h-full">
          <MapView
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCompare={handleAddToCompare}
          />
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
    </div>
  );
};

export default MapViewPage;