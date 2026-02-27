import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { getProducts, getCategories } from '../redux/slices/productSlice';
import ProductGrid from '../components/ui/ProductGrid';
import FilterSidebar from '../components/ui/FilterSidebar';
import Button from '../components/ui/Button';

export default function ShopPage() {
  const dispatch = useDispatch();
  const { products, categories, loading, pagination } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '-createdAt',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true'
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 12,
      ...filters
    };

    // Remove empty values
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') {
        delete params[key];
      }
    });

    dispatch(getProducts(params));
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams, { replace: true });
  }, [dispatch, filters, pagination?.page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: '-createdAt',
      inStock: false
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.inStock
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.search ? `Search: "${filters.search}"` : 'Shop'}
          </h1>
          <p className="text-gray-500">
            {products.length} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop & Mobile */}
          <div className="lg:block w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Filter Toggle - Mobile */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <SlidersHorizontal size={20} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid3X3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                  {filters.category && (
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      Category
                      <X size={14} />
                    </button>
                  )}
                  {filters.minPrice && (
                    <button
                      onClick={() => handleFilterChange('minPrice', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      Min: Rs. {filters.minPrice}
                      <X size={14} />
                    </button>
                  )}
                  {filters.maxPrice && (
                    <button
                      onClick={() => handleFilterChange('maxPrice', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      Max: Rs. {filters.maxPrice}
                      <X size={14} />
                    </button>
                  )}
                  {filters.rating && (
                    <button
                      onClick={() => handleFilterChange('rating', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {filters.rating}+ Stars
                      <X size={14} />
                    </button>
                  )}
                  {filters.inStock && (
                    <button
                      onClick={() => handleFilterChange('inStock', false)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      In Stock
                      <X size={14} />
                    </button>
                  )}
                  {(filters.inStock) && (
                    <button
                      onClick={() => {
                        handleFilterChange('inStock', false);
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              columns={viewMode === 'grid' ? 4 : 3}
            />

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleFilterChange('page', i + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        pagination.page === i + 1
                          ? 'bg-emerald-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

