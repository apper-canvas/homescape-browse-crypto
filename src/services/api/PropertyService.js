import propertyData from "@/services/mockData/properties.json";

const PropertyService = {
  // Get all properties
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...propertyData]);
      }, 300);
    });
  },

  // Get property by ID
  getById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const property = propertyData.find(p => p.Id === id);
        if (property) {
          resolve({ ...property });
        } else {
          reject(new Error("Property not found"));
        }
      }, 200);
    });
  },

  // Search properties
  search: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = propertyData.filter(property =>
          property.title.toLowerCase().includes(query.toLowerCase()) ||
          property.address.toLowerCase().includes(query.toLowerCase()) ||
          property.city.toLowerCase().includes(query.toLowerCase()) ||
          property.state.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 250);
    });
  },

  // Filter properties
  filter: (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...propertyData];

        if (filters.priceMin) {
          filtered = filtered.filter(p => p.price >= filters.priceMin);
        }
        if (filters.priceMax) {
          filtered = filtered.filter(p => p.price <= filters.priceMax);
        }
        if (filters.bedrooms) {
          filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms);
        }
        if (filters.bathrooms) {
          filtered = filtered.filter(p => p.bathrooms >= filters.bathrooms);
        }
        if (filters.propertyTypes && filters.propertyTypes.length > 0) {
          filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
        }

        resolve([...filtered]);
      }, 250);
    });
  }
};

export default PropertyService;