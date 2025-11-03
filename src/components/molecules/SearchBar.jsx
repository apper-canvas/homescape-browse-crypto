import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, placeholder = "Search by address, city, or zip code..." }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative flex items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-accent shadow-lg"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        size="lg"
        className="ml-4 px-8 shadow-lg"
      >
        <ApperIcon name="Search" size={20} className="mr-2" />
        Search
      </Button>
    </motion.form>
  );
};

export default SearchBar;