import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const FilterPanel = ({ filters, onFilterChange, onClearFilters, isVisible = true }) => {
  const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Villa"];

  const handlePriceChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value ? parseInt(value) : ""
    });
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.propertyTypes || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFilterChange({
      ...filters,
      propertyTypes: updatedTypes
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-primary flex items-center">
          <ApperIcon name="Filter" size={20} className="mr-2 text-accent" />
          Filters
        </h3>
        <Button
          onClick={onClearFilters}
          variant="ghost"
          size="sm"
          className="text-secondary hover:text-primary"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-primary">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.priceMin || ""}
            onChange={(e) => handlePriceChange("priceMin", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.priceMax || ""}
            onChange={(e) => handlePriceChange("priceMax", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <h4 className="font-medium text-primary">Bedrooms</h4>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onFilterChange({ ...filters, bedrooms: filters.bedrooms === num ? "" : num })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.bedrooms === num
                  ? 'bg-gradient-to-r from-accent to-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="space-y-3">
        <h4 className="font-medium text-primary">Bathrooms</h4>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => onFilterChange({ ...filters, bathrooms: filters.bathrooms === num ? "" : num })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.bathrooms === num
                  ? 'bg-gradient-to-r from-accent to-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Property Types */}
      <div className="space-y-3">
        <h4 className="font-medium text-primary">Property Type</h4>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={(filters.propertyTypes || []).includes(type)}
                  onChange={() => handlePropertyTypeToggle(type)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  (filters.propertyTypes || []).includes(type)
                    ? 'bg-gradient-to-r from-accent to-yellow-500 border-accent'
                    : 'border-gray-300 group-hover:border-accent'
                }`}>
                  {(filters.propertyTypes || []).includes(type) && (
                    <ApperIcon name="Check" size={12} className="text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;