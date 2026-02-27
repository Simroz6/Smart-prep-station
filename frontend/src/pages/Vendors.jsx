import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Package, Calendar, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/auth/sellers?page=${page}&limit=12`);
      setVendors(response.data.data.sellers);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.response?.data?.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchVendors(newPage);
  };

  const defaultAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff&size=128`;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => fetchVendors()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
          <p className="text-gray-500">
            Discover trusted sellers on our marketplace
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                    <div className="absolute -bottom-10 left-4">
                      <img
                        src={vendor.avatar || defaultAvatar(vendor.name)}
                        alt={vendor.name}
                        className="w-20 h-20 rounded-xl border-4 border-white object-cover shadow-md"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-4 px-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {vendor.name}
                    </h3>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 mb-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                        <span className="text-sm font-medium">{vendor.averageRating || 0}</span>
                        <span className="text-xs text-gray-500">({vendor.totalReviews || 0})</span>
                      </div>

                      {/* Products */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Package size={14} />
                        <span className="text-sm">{vendor.productCount || 0} Products</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {vendor.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {vendor.bio}
                      </p>
                    )}

                    {/* Join Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                      <Calendar size={12} />
                      <span>Joined {new Date(vendor.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* View Profile Button */}
                    <Link to={`/vendor/${vendor._id}`}>
                      <Button className="w-full" variant="outline" size="sm">
                        View Profile
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors yet</h3>
            <p className="text-gray-500">Be the first to start selling on our marketplace!</p>
            <Link to="/register?seller=true">
              <Button className="mt-4">Become a Seller</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
