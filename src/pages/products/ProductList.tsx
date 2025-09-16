import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../../lib/api";
import { EditProduct } from "./EditProduct";
import { useToast } from "../../components/ui/toast";
import { Pagination } from "../../components/ui/Pagination";
import { Filter, productSortOptions } from "../../components/ui/filter";

export const ProductList: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('-createdAt');

  interface ProductApiResponse {
    data: any[];
    total: number;
    totalPages: number;
  }

  const { data: productData, isLoading, error } = useQuery<ProductApiResponse>({
    queryKey: ["products", currentPage, itemsPerPage, sortOrder],
    queryFn: () => fetchProducts({ 
      page: currentPage, 
      limit: itemsPerPage,
      sort: sortOrder
    })
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (product: any) => {
    console.log('product',product);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (productId: string, productName: string) => {
    showToast(`Are you sure you want to delete "${productName}"?`, 'confirm', {
      onConfirm: async () => {
        try {
          await deleteProduct(productId);
          showToast('Product deleted successfully!', 'success');
          queryClient.invalidateQueries({ queryKey: ["products"] });
        } catch (error) {
          console.error("Error deleting product:", error);
          showToast('Failed to delete product. Please try again.', 'error');
        }
      },
      onCancel: () => showToast('Delete cancelled', 'info')
    });
  };

  const toggleExpanded = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Products</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Filter
            selectedSort={sortOrder}
            onSortChange={setSortOrder}
            sortOptions={productSortOptions}
            className="w-full sm:w-auto"
          />
          <Link
            to="/products/add"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-4 sm:p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-gray-500 text-sm sm:text-base">Loading products...</p>
              </div>
            ) : error ? (
              <div className="p-4 sm:p-8 text-center">
                <div className="text-red-500 mb-2 text-sm sm:text-base">⚠️ Error loading products</div>
                <p className="text-gray-500 text-xs sm:text-sm">Please try refreshing the page</p>
              </div>
            ) : productData?.data?.length === 0 ? (
              <div className="p-4 sm:p-8 text-center">
                <p className="text-gray-500 text-sm sm:text-base">No products found</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">Image</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">Product Details</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden md:table-cell">Category</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">Pricing</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden sm:table-cell">Stock</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden lg:table-cell">Variants</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden md:table-cell">Dates</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productData?.data?.map((product: any) => (
                    <React.Fragment key={product._id}>
                      <tr className="border-b hover:bg-gray-50">
                        {/* Image */}
                        <td className="p-3 sm:p-4">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg shadow-sm transition-transform duration-300 transform hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-[10px] sm:text-xs">No Image</span>
                            </div>
                          )}
                        </td>

                        {/* Product Details */}
                        <td className="p-3 sm:p-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                              {product.name1 || product.name}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#979797] line-clamp-2">
                              {product.description || 'No description available'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes && (
                                <p className="text-[11px] sm:text-xs text-blue-600">
                                  Sizes: {Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes}
                                </p>
                              )}
                              {product.color && (
                                <p className="text-[11px] sm:text-xs text-blue-600">
                                  Color: {product.color}
                                </p>
                              )}
                              
                            </div>
                            {/* Show category info on mobile */}
                            <div className="md:hidden space-y-1 mt-2 pt-2 border-t border-gray-100">
                              <p className="text-[11px] sm:text-xs text-[#979797]">
                                {product.category?.name || product.category || 'N/A'} / 
                                {product.subcategory?.name || product.subcategory || 'No subcategory'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 sm:p-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="font-medium text-[#1c1c1c] text-xs sm:text-sm">
                              {product.category?.name || product.category || 'N/A'}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#979797]">
                              {product.subcategory?.name || product.subcategory || 'No subcategory'}
                            </p>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="p-3 sm:p-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                              ₹{product.price?.toFixed(2) || 'N/A'}
                            </p>
                            {product.options && product.options.length > 0 && (
                              <p className="text-xs text-[#979797]">
                                Variants: ₹{Math.min(...product.options.map((opt: any) => opt.price || 0)).toFixed(2)} - 
                                {Math.max(...product.options.map((opt: any) => opt.price || 0)).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="p-3 sm:p-4 hidden sm:table-cell">
                          <div className="space-y-1">
                            <p className="font-medium text-[#1c1c1c] text-xs sm:text-sm">
                              {product.quantity || 0} {product.unit || 'meter'}
                            </p>
                            <div className={`inline-block px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs ${
                              (product.quantity || 0) > 20 
                                ? 'bg-green-100 text-green-800' 
                                : (product.quantity || 0) > 5 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {(product.quantity || 0) > 20 ? 'In Stock' : 
                               (product.quantity || 0) > 5 ? 'Low Stock' : 'Out of Stock'}
                            </div>
                          </div>
                        </td>

                        {/* Variants */}
                        <td className="p-3 sm:p-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm font-medium text-[#1c1c1c]">
                              {product.options?.length || 0} variants
                            </p>
                            {product.options && product.options.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(product._id)}
                                className="flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 hover:text-blue-800"
                              >
                                {expandedProducts.has(product._id) ? (
                                  <>
                                    <ChevronUpIcon className="w-3 h-3" />
                                    Hide details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDownIcon className="w-3 h-3" />
                                    View details
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="p-3 sm:p-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="text-[11px] sm:text-xs text-[#979797]">
                              Created: {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#979797]">
                              Updated: {product.updatedAt ? formatDate(product.updatedAt) : 'N/A'}
                            </p>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Product"
                            >
                              <EditIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(product._id, product.name1 || product.name)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Product"
                            >
                              <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Variants Row */}
                      {expandedProducts.has(product._id) && product.options && product.options.length > 0 && (
                        <tr className="bg-blue-50">
                          <td colSpan={8} className="p-3 sm:p-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-[#1c1c1c] text-xs sm:text-sm">Product Variants:</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                {product.options.map((option: any, index: number) => (
                                  <div key={option._id || index} className="bg-white p-2 sm:p-3 rounded-lg border">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-xs sm:text-sm text-[#1c1c1c]">
                                          {option.color || `Variant ${index + 1}`}
                                        </span>
                                        <span className="text-xs sm:text-sm font-semibold text-green-600">
                                          ₹{option.price?.toFixed(2) || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#979797]">
                                        <span>Stock: {option.quantity || 0}</span>
                                        <span>Images: {option.imageUrls?.length || 0}</span>
                                      </div>
                                      {option.imageUrls && option.imageUrls.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                          {option.imageUrls.slice(0, 3).map((url: string, imgIndex: number) => (
                                            <img
                                              key={imgIndex}
                                              src={url}
                                              alt={`${option.color} variant ${imgIndex + 1}`}
                                              className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded border"
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                              }}
                                            />
                                          ))}
                                          {option.imageUrls.length > 3 && (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded border flex items-center justify-center">
                                              <span className="text-[10px] sm:text-xs text-gray-500">+{option.imageUrls.length - 3}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
        
        
        {!isLoading && !error && productData && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={productData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};