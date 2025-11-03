const STORAGE_KEY = "homescape_favorites";

const FavoritesService = {
  // Get all favorites
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const favorites = stored ? JSON.parse(stored) : [];
        resolve([...favorites]);
      }, 200);
    });
  },

  // Get favorite by property ID
  getById: (propertyId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const favorites = stored ? JSON.parse(stored) : [];
        const favorite = favorites.find(f => f.propertyId === propertyId);
        if (favorite) {
          resolve({ ...favorite });
        } else {
          reject(new Error("Favorite not found"));
        }
      }, 150);
    });
  },

  // Add to favorites
  create: (favorite) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const favorites = stored ? JSON.parse(stored) : [];
        
        // Check if already exists
        const existingIndex = favorites.findIndex(f => f.propertyId === favorite.propertyId);
        if (existingIndex === -1) {
          const newFavorite = {
            Id: favorites.length > 0 ? Math.max(...favorites.map(f => f.Id)) + 1 : 1,
            ...favorite
          };
          favorites.push(newFavorite);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
          resolve({ ...newFavorite });
        } else {
          resolve({ ...favorites[existingIndex] });
        }
      }, 200);
    });
  },

  // Remove from favorites
  delete: (propertyId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const favorites = stored ? JSON.parse(stored) : [];
        const filtered = favorites.filter(f => f.propertyId !== propertyId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        resolve(true);
      }, 200);
    });
  },

  // Clear all favorites
  clear: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEY);
        resolve(true);
      }, 150);
    });
  }
};

export default FavoritesService;