import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    brand: false,
    availability: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:transform-none lg:static lg:shadow-none lg:border-r lg:border-gray-200 lg:h-auto lg:overflow-visible ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={onClearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Filter Sections */}
        <div className="overflow-y-auto lg:h-auto p-4 space-y-6">
          {/* Categories */}
          <FilterSection
            title="Categories"
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={!filters.category}
                    onChange={() => onFilterChange('category', '')}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 group-hover:text-emerald-600">All Categories</span>
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat._id}
                      checked={filters.category === cat._id}
                      onChange={() => onFilterChange('category', cat._id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700 group-hover:text-emerald-600">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      ({cat.productCount || 0})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-gray-400 mt-4">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={() => onFilterChange('applyPrice', true)}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Apply
              </button>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection
            title="Rating"
            isExpanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <ul className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <li key={rating}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={() => onFilterChange('rating', rating)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">& Up</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>

          {/* Availability */}
          <FilterSection
            title="Availability"
            isExpanded={expandedSections.availability}
            onToggle={() => toggleSection('availability')}
          >
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => onFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">In Stock</span>
                </label>
              </li>
            </ul>
          </FilterSection>
        </div>
      </aside>
    </>
  );
}

function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
}
