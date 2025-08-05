import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Layout components
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./components/auth/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ToastProvider } from './components/ui/toast';

// Page components
import { ProductList } from "./pages/products/ProductList";
import { AddProduct } from "./pages/products/AddProduct";
import { CategoryList } from "./pages/categories/CategoryList";
import { AddCategory } from "./pages/categories/AddCategory";
import InquiryList from "./pages/orders/InquiryList";
import { SubcategoryList } from "./pages/subCategories/SubcategoryList";
import { AddSubcategory } from "./pages/subCategories/AddSubcategory";
import { Banners } from "./pages/banners/Banners";
import { WorkshopsList } from "./pages/classRegistration/WorkshopsList";
import { RegistrationList } from "./pages/classRegistration/RegistrationList";
import { ReelsList } from "./pages/reels/ReelsList";
import { AddReel } from "./pages/reels/AddReel";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Redirect root to products */}
              <Route index element={<Navigate to="/products" replace />} />
              
              {/* Products routes */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              
              {/* Categories routes */}
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/add" element={<AddCategory />} />
              
              {/* Subcategories routes - placeholder */}
              <Route path="subcategories" element={<SubcategoryList/>} />
              <Route path="subcategories/add" element={<AddSubcategory/>} />
              
              {/* Orders route */}
              <Route path="orders" element={<InquiryList />} />
              
              {/* Workshop routes */}
              <Route path="class-registration" element={<WorkshopsList />} />
              <Route path="registrations" element={<RegistrationList />} />
              <Route path="banners" element={<Banners />} />
              
              {/* Reels routes */}
              <Route path="reels" element={<ReelsList />} />
              <Route path="reels/add" element={<AddReel />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ToastProvider>
  );
};