import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import ViewToggle from "@/components/molecules/ViewToggle";
import FilterPanel from "@/components/molecules/FilterPanel";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import MapView from "@/components/organisms/MapView";
import ComparisonPanel from "@/components/organisms/ComparisonPanel";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PropertyService from "@/services/api/PropertyService";
import FavoritesService from "@/services/api/FavoritesService";

const BrowsePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [currentView, setCurrentView] = useState('grid');
  
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

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
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

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'map') {
      navigate('/map');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Discover luxury properties with our advanced search and comparison tools. 
              Your perfect home is just a search away.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="lg:hidden"
            >
              <ApperIcon name="Filter" size={18} className="mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-secondary">
              {filteredProperties.length} properties found
            </span>
            
            {comparisonList.length > 0 && (
              <Button
                onClick={() => setShowComparison(true)}
                variant="primary"
                className="relative"
              >
                <ApperIcon name="BarChart3" size={18} className="mr-2" />
                Compare ({comparisonList.length})
                {comparisonList.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {comparisonList.length}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentView === 'grid' ? (
              <PropertyGrid
                properties={filteredProperties}
                loading={loading}
                error={error}
                onRetry={loadProperties}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onAddToCompare={handleAddToCompare}
              />
            ) : (
              <MapView
                properties={filteredProperties}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onAddToCompare={handleAddToCompare}
              />
            )}
          </div>
        </div>
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

export default BrowsePage;