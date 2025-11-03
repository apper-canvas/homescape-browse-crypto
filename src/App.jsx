import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import BrowsePage from "@/components/pages/BrowsePage";
import MapViewPage from "@/components/pages/MapViewPage";
import FavoritesPage from "@/components/pages/FavoritesPage";
import PropertyDetailPage from "@/components/pages/PropertyDetailPage";
import ComparePage from "@/components/pages/ComparePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/browse" replace />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="map" element={<MapViewPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="compare" element={<ComparePage />} />
          </Route>
        </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;